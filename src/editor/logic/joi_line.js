import { Joi } from "../../lib";
import _ from "lodash";
import { raw, softEval, func, regex } from "./util";
import toSource from "tosource";

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
		case "text area":
			newFieldType = 'TextArea'
			break;
		case "format|url":
			newFieldType = "InputURL";
			break;
		case "format|tel":
			newFieldType = "InputPhone";
			break;
		case "format|email":
			newFieldType = "InputEmail";
			break;
		case "format|thai zipcode":
			editor = { placeholder: "เช่น 10210", ...editor };
			suffix.push({ name: "pattern", args: [regex(/^\d{5}$/, isObj)] });
			suffix.push({ name: "message", args: ["รหัสไปรษณีย์ไม่ถูกต้อง"] });
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
			type = "bool";
			break;
		case "number":
		case "date":
			type = editor.fieldType;
			break;
		case "barcode":
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
