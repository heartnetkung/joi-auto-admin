import { Joi } from "../../lib";
import _ from "lodash";
import { raw, softEval, func, regex, showRaw } from "./util";
import toSource from "tosource";
import { DependentComp, AsyncDropdown, THAddress } from "./custom_component";
import { lookupLabel } from "./lookup_label";

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
		case "common|paragraph":
			newFieldType = "TextArea";
			break;
		case "common|time":
			newFieldType = "TimePicker";
			type = "date";
			if (editor.defaultValue)
				editor = {
					...editor,
					defaultValue: "1900-01-01 " + editor.defaultValue,
				};
			break;
		case "custom component|dependent input example":
			editor = {
				onFieldRender: isObj
					? DependentComp
					: raw("DependentComp", isObj),
				...editor,
			};
			break;
		case "custom component|async searchable dropdown":
			editor = {
				onFieldRender: isObj
					? AsyncDropdown
					: raw("AsyncDropdown", isObj),
				...editor,
			};
			break;
		case "hierarchical dropdown|static option, allow modify":
			editor = {
				...editor,
				cascaderOptions: [
					{
						l: "Hardware Business",
						c: [{ l: "Apple" }, { l: "Intel" }],
					},
					{
						l: "Software Business",
						c: [{ l: "Apple" }, { l: "Google" }],
					},
				],
				names: [editor.name + "-0", editor.name + "-1"],
				fieldNames: { label: "l", value: "l", children: "c" },
				cellHide: true,
				notFound: true,
			};
			type = "object";
			break;
		case "hierarchical dropdown|static option, no modify":
			editor = {
				...editor,
				cascaderOptions: [
					{
						l: "Vegetable",
						v: "Vegetable",
						c: [
							{ l: "Tomato (G001)", v: "G001" },
							{ l: "Carrot (G002)", v: "G002" },
						],
					},
					{
						l: "Fruit",
						v: "Fruit",
						c: [
							{ l: "Apple (G003)", v: "G003" },
							{ l: "Banana (G004)", v: "G004" },
						],
					},
				],
				names: editor.name + "-0",
				fieldNames: { label: "l", value: "v", children: "c" },
				cellHide: true,
			};
			type = "object";
			break;
		case "hierarchical dropdown|thai province":
			editor = {
				...editor,
				onFieldRender: isObj ? THAddress : raw("THAddress", isObj),
				names: [
					editor.name + "-0",
					editor.name + "-1",
					editor.name + "-2",
					editor.name + "-3",
				],
				fieldNames: { label: "l", value: "l", children: "c" },
				cellHide: true,
				notFound: true,
			};
			if (isObj) editor.cascaderOptions = raw("thAddressData", isObj);
			type = "object";
			break;
		case "hierarchical dropdown|async option":
			editor = {
				...editor,
				cascaderFetchData: func(
					`async (selected)=>{
await wait(500);
if(!selected.length) return [{l:"Hardware Business",isLeaf:false},{l:"Software Business",isLeaf:false}];
if(selected[0] === 'Hardware Business') return [{l:"Apple"},{l:"Intel"}];
if(selected[0] === 'Software Business') return [{l:"Apple"},{l:"Google"}];
}`,
					isObj
				),
				fieldNames: { label: "l", value: "l", children: "c" },
			};
			type = "array";
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
						`(a)=>{if (!/^changeme$/.test(a)) throw new Error("changeme error");return a;}`,
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
		case "common|number":
			type = "number";
			break;
		case "common|month":
			newFieldType = "MonthPicker";
			type = "date";
			break;
		case "common|date-time":
			editor = { ...editor, showTime: true };
			type = "date";
			break;
		case "common|date":
			type = "date";
			break;
		case "common|barcode scanner hardware":
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
			suffix.push({
				name: "valid",
				args: ["pizza", "steak", "sushi", "hamburger", "noodles"],
			});
			editor = {
				...editor,
				validLabel: ["Pizza", "Steak", "Sushi", "Hamburger", "Noodles"],
			};
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
				uploadFileInit: func(
					`() => {
//getFirebase();
}`,
					isObj
				),
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
	ans.push({ name: type }, { name: "label", args: [lookupLabel(editor)] });

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
		"_id",
		"conditional",
	]);
	if (editor.extraMargin)
		meta.containerStyle = _.assign(meta.containerStyle, {
			marginBottom: 20,
		});
	if (editor.columnWidth) meta.cellWidth = editor.columnWidth;
	if (newFieldType) meta.fieldType = newFieldType;
	if (!meta.placeholder) delete meta.placeholder;
	if (editor.conditional) {
		if (!editor.fieldHide)
			meta.fieldHide = func(
				`(a)=>a["${editor.conditional[0]}"]!=="${editor.conditional[1]}"`,
				isObj
			);
		else if (isObj) {
			const original = meta.fieldHide;
			meta.fieldHide = (a) =>
				original(a) ||
				a[editor.conditional[0]] !== editor.conditional[1];
		} else {
			meta.fieldHide = func(
				showRaw(meta.fieldHide, isObj) +
					`||(a["${editor.conditional[0]}"]!=="${editor.conditional[1]}")`,
				isObj
			);
		}
	}
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

export const makeExtraJoiLines = (editor, settings, isObj) => {
	if (!/^hierarchical dropdown|/.test(editor.fieldType)) return [];

	const { name, fieldType } = editor;
	const extend = _.pick(editor, [
		"require",
		"step",
		"columnWidth",
		"disableSorting",
		"disableFilter",
		"conditional",
	]);
	const obj = {
		...extend,
		fieldHide: !isObj
			? raw(`a=>(a['${name}']?!a['${name}'].$notFound:true)`, isObj)
			: (a) => (a[name] ? !a[name].$notFound : true),
		twoColumn: true,
	};

	switch (fieldType) {
		case "hierarchical dropdown|static option, allow modify":
			return [
				makeJoiLine({ ...obj, label: "category" }, settings, isObj),
				makeJoiLine({ ...obj, label: "brand" }, settings, isObj),
			];
		case "hierarchical dropdown|static option, no modify":
			return [
				makeJoiLine({ ...obj, label: "product code" }, settings, isObj),
			];
		case "hierarchical dropdown|thai province":
			return [
				makeJoiLine(
					{
						...obj,
						label: "จังหวัด",
						placeholder: "เช่น กรุงเทพมหานคร",
					},
					settings,
					isObj
				),
				makeJoiLine(
					{ ...obj, label: "เขต/อำเภอ", placeholder: "เช่น จตุจักร" },
					settings,
					isObj
				),
				makeJoiLine(
					{ ...obj, label: "แขวง/ตำบล", placeholder: "เช่น จตุจักร" },
					settings,
					isObj
				),
				makeJoiLine(
					{
						...obj,
						label: "รหัสไปรษณีย์",
						fieldType: "format|thai zipcode",
					},
					settings,
					isObj
				),
			];
		default:
			return [];
	}
};
