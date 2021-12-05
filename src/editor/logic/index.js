import { Joi, AutoAdmin } from "../../lib";
import React from "react";
import { useMemo } from "react";
import PropTypes from "prop-types";
import { renderProps, renderTemplate } from "./template";
import { makeJoiLine } from "./joi_line";
import _ from "lodash";

const editorSchema = Joi.array().items(
	Joi.object({
		name: Joi.string().required().min(1),
		label: Joi.string().required().min(1),
		fieldType: Joi.string()
			.required()
			.valid(
				"cascader_async",
				"cascader_address",
				"dropdown",
				"barcode",
				"upload",
				"input",
				"url",
				"tel",
				"email",
				"checkbox",
				"number",
				"date"
			),
		step: Joi.number(),
		placeholder: Joi.string(),
		defaultValue: Joi.string(),
		require: Joi.boolean(),
		disabled: Joi.boolean(),
		twoColumn: Joi.boolean(),
		extraMargin: Joi.boolean(),
		columnWidth: Joi.number(),
		cellEllipsis: Joi.boolean(),
		columnHide: Joi.boolean(),
		disabledSorting: Joi.boolean(),
		disabledFilter: Joi.boolean(),
	}),
	Joi.any().strip()
);

const settingsSchema = Joi.object({
	name: Joi.string(),
	description: Joi.string(),
	canCreate: Joi.boolean(),
	canUpdate: Joi.boolean(),
	canDelete: Joi.boolean(),
	querySchema: editorSchema,
	canDownloadExcel: Joi.boolean(),
	canUploadExcel: Joi.boolean(),
	uploadPreviewUrl: Joi.boolean(),
	steps: Joi.string(),
});

export const editorToCode = (editors, settings) => {
	var editors2 = editorSchema.validate(editors);
	var settings2 = settingsSchema.assert(settings);
	return renderTemplate(editors2.value, settings2.value);
};

export const validateEditor = (editors) => editorSchema.validate(editors);

const traverse = (node) => {
	if (Joi.isSchema(node)) return node;
	var ans = {};
	for (var key in node) ans[key] = traverse(node[key]);
	return Joi.object(ans);
};

const makeJoiObj = (editors, settings) => {
	var ans = {};
	for (var editor of editors)
		_.set(ans, editor.name, makeJoiLine(editor, settings, true));
	return traverse(ans);
};

export const App = (props) => {
	const { editors, settings } = props;

	const props2 = useMemo(() => {
		const ans = renderProps(editors, settings, true);
		ans.schema = makeJoiObj(editors, settings);
		return ans;
	}, [editors, settings]);

	if (!editors.length) return "กรุณาสร้างข้อมูลด้านซ้าย";
	return <AutoAdmin {...props2} />;
};
App.propTypes = {
	editors: PropTypes.array,
	settings: PropTypes.object,
};
App.defaultProps = {
	editors: [
		{
			name: "hello.abc",
			label: "helloName",
			require: true,
			defaultValue: "a",
			extraMargin: true,
		},
	],
	settings: { canCreate: true },
};