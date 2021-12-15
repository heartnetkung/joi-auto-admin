import { Joi } from "../../lib";
import _ from "lodash";
import { raw, softEval, func, regex } from "./util";
import toSource from "tosource";
import { DependentComp } from "./advanced_component";

const makeObject = (joiList) => {
	var ans = Joi;
	for (var joi of joiList) ans = ans[joi.name](...(joi.args || []));
	return ans;
};

const makeString = (joiList) => {
	var ans = "Joi";
	for (var joi of joiList) {
		var args = joi.args || [];
		ans += `.${joi.name}(${args.map((a) =>
			toSource(a).replace(/\n/g, "")
		)})`;
	}
	return ans;
};

// return [{funcName, args}]
export const makeJoiLine = (editor, settings, isObj) => {
	var ans = [];

	var type = "string";
	var newFieldType = "";
	var suffix = [];
	switch (editor.fieldType) {
		case "common|text area":
			newFieldType = "TextArea";
			break;
		case "advanced|dependent input example":
			var onFieldRender = isObj
				? DependentComp
				: raw(DependentComp.str, isObj);
			editor = { onFieldRender, ...editor };
			break;
		case "format|url":
			newFieldType = "InputURL";
			break;
		case "format|thai tel":
			newFieldType = "InputPhone";
			break;
		case "format|email":
			newFieldType = "InputEmail";
			break;
		case "common|password":
			editor = { ...editor, cellHide: true };
			newFieldType = "InputPassword";
			break;
		case "format|thai zipcode":
			editor = { placeholder: "เช่น 10210", ...editor };
			suffix.push({ name: "pattern", args: [regex(/^\d{5}$/, isObj)] });
			suffix.push({ name: "message", args: ["รหัสไปรษณีย์ไม่ถูกต้อง"] });
			break;
		case "format|regex validation example":
			suffix.push({
				name: "pattern",
				args: [regex(/^changeme$/, isObj)],
			});
			suffix.push({ name: "message", args: ["changeme error"] });
			break;
		case "format|custom validation example":
			suffix.push({
				name: "custom",
				args: [
					func(
						`(a)=>{
if (!/^changeme$/.test(a)) throw new Error("changeme error");
return a;}`,
						isObj
					),
				],
			});
			break;
		case "format|thai citizen id":
			editor = { placeholder: "เช่น 0139499973311", ...editor };
			suffix.push({
				name: "custom",
				args: [
					func(
						`(id)=>{
if (!/^\u0091d{13}$/.test(id)) throw new Error("เลขประชาชนต้องเป็นเลข 13 หลัก");
var digits = [];
for(var i = 0; i < 13; i++) digits.push(parseInt(id[i]));
var checksum = 0;
for(var j = 0; j < 12; i++) checksum += (13 - j) * digits[j];
var digit13 = checksum % 11;
digit13 = digit13 > 1 ? 11 - digit13 : 1 - digit13;
if (digit13 !== digits[12]) throw new Error("เลขประชาชนไม่ถูกต้อง");
return id;}`,
						isObj
					),
				],
			});
			break;
		case "checkbox":
			type = "boolean";
			break;
		case "number":
		case "date":
			type = editor.fieldType;
			break;
		case "advanced|barcode scanner":
			type = "array";
			suffix.push({ name: "min", args: [1] });
			editor = {
				...editor,
				containerStyle: { marginBottom: 30 },
				loadBarcodeName: func(
					'async (a) => {await wait(500); if (a === "a001") return "iPhone";}',
					isObj
				),
			};
			break;
		case "dropdown":
			suffix.push({ name: "valid", args: ["m", "f"] });
			editor = { ...editor, validLabel: ["ชาย", "หญิง"] };
			break;
		case "upload|multiple images":
			editor = {
				...editor,
				multiple: true,
				uploadFile: func(
					'async (fileObj) => {await wait(500); return "https://www.gravatar.com/avatar/1"}',
					isObj
				),
				uploadFileType: "image",
				accept: ".png,.jpeg,.jpg,.gif",
			};
			type = "array";
			break;
		case "upload|firebase":
			editor = {
				...editor,
				multiple: true,
				uploadFile: func(
					`async (file) => {
// const path = 'images/' + nanoid();
// const storageRef = ref(getFirebase(), path);
// await uploadBytes(storageRef, file);
// return await getDownloadURL(storageRef);
await wait(500);
return "https://www.gravatar.com/avatar/1"}`,
					isObj
				),
				uploadFileInit: func(`() => getFirebase()`, isObj),
				uploadFileType: "image",
				accept: ".png,.jpeg,.jpg,.gif",
			};
			type = "array";
			break;
		case "upload|google cloud storage":
			editor = {
				...editor,
				multiple: true,
				uploadFile: func(
					`async (file) => {
// https://cloud.google.com/storage/docs/samples/storage-generate-signed-url-v4
// var serverUrl = 'https://www.example.com/get-upload-url?filename=';
// var url = await axios.get(serverUrl + encodeURIComponent(file.name));
// await axios.put(url, file, {headers: { "Content-Type": file.type }});
// return url;
await wait(500);
return "https://www.gravatar.com/avatar/1"}`,
					isObj
				),
				uploadFileType: "image",
				accept: ".png,.jpeg,.jpg,.gif",
			};
			type = "array";
			break;
		case "upload|single file":
			editor = {
				...editor,
				multiple: false,
				uploadFile: func(
					'async (fileObj) => {await wait(500); return "https://www.gravatar.com/avatar/1"}',
					isObj
				),
				uploadFileType: "file",
				accept: ".pdf",
			};
			break;
		default:
			break;
	}
	ans.push({ name: type }, { name: "label", args: [editor.label] });

	if (editor.require) ans.push({ name: "required" });
	if (editor.defaultValue)
		ans.push({
			name: "default",
			args: [softEval(editor.defaultValue, type)],
		});
	ans = ans.concat(suffix);

	var meta = _.omit(editor, [
		"require",
		"defaultValue",
		"label",
		"fieldType",
		"_fieldType",
		"extraMargin",
		"name",
		"columnWidth",
	]);
	if (editor.extraMargin)
		meta.containerStyle = _.assign(meta.containerStyle, {
			marginBottom: 20,
		});
	if (editor.columnWidth) meta.cellWidth = editor.columnWidth;
	if (newFieldType) meta.fieldType = newFieldType;
	if (!meta.placeholder) delete meta.placeholder;
	if (settings.steps) meta.step = meta.step || 0;
	else delete meta.step;

	if (_.size(meta))
		ans.push({
			name: "meta",
			args: [isObj ? meta : raw(JSON.stringify(meta))],
		});

	if (isObj) return makeObject(ans);
	return makeString(ans);
};
