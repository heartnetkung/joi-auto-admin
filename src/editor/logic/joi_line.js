import { Joi } from "../../lib";
import _ from "lodash";
import { raw, softEval, func } from "./util";
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
	var suffix = null;
	switch (editor.fieldType) {
		case "format|url":
			newFieldType = "InputURL";
			break;
		case "format|tel":
			newFieldType = "InputPhone";
			break;
		case "format|email":
			newFieldType = "InputEmail";
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
			suffix = { name: "min", args: [1] };
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
			suffix = { name: "valid", args: ["m", "f"] };
			editor = { ...editor, validLabel: ["ชาย", "หญิง"] };
			break;
		case "upload|multiple images":
			editor = {
				...editor,
				multiple: true,
				uploadFile: func(
					'async (fileObj) => "https://www.gravatar.com/avatar/1"',
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
					'async (fileObj) => "https://www.gravatar.com/avatar/1"',
					isObj
				),
				uploadFileType: "file",
				accept: ".pdf",
			};
			break;
		default:
			break;
	}
	// not implemented cascader_async, cascader_address, upload

	ans.push({ name: type }, { name: "label", args: [editor.label] });

	if (editor.require) ans.push({ name: "required" });
	if (editor.defaultValue)
		ans.push({
			name: "default",
			args: [softEval(editor.defaultValue, type)],
		});
	if (suffix) ans.push(suffix);

	var meta = _.omit(editor, [
		"require",
		"defaultValue",
		"label",
		"fieldType",
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
