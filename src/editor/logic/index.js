import { Joi, AutoAdmin } from "../../lib";
import React from "react";
import { useMemo } from "react";
import PropTypes from "prop-types";
import { renderProps, renderTemplate } from "./template";
import { makeJoiLine } from "./joi_line";
import _ from "lodash";
import { Spin } from "antd";

const editorSchemaInner = Joi.object({
	name: Joi.string().required().min(1),
	label: Joi.string().required().min(1),
	fieldType: Joi.string()
		.required()
		.valid(
			"dropdown",
			"barcode",
			"upload|single file",
			"upload|multiple images",
			"upload|firebase",
			"upload|google cloud storage",
			"input",
			"format|url",
			"format|tel",
			"format|email",
			"format|thai zipcode",
			"format|thai citizen id",
			"advanced|reactive component",
			"checkbox",
			"number",
			"date",
			"text area"
		),
	_fieldType: Joi.any(),
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
	disableSorting: Joi.boolean(),
	disableFilter: Joi.boolean(),
});

const editorSchema1 = Joi.array()
	.items(editorSchemaInner, Joi.any().strip())
	.unique("name");
const editorSchema2 = Joi.array().items(editorSchemaInner).unique("name");

const settingsSchema = Joi.object({
	name: Joi.string(),
	description: Joi.string(),
	canCreate: Joi.boolean(),
	canUpdate: Joi.boolean(),
	canDelete: Joi.boolean(),
	querySchema: editorSchema1,
	disableExcelDownload: Joi.boolean(),
	disableExcelUpload: Joi.boolean(),
	uploadPreviewUrl: Joi.string(),
	steps: Joi.string(),
});

export const editorToCode = (editors, settings) => {
	var editors2 = editorSchema1.validate(editors);
	var settings2 = settingsSchema.validate(settings);
	return renderTemplate(editors2.value, settings2.value);
};

export const validateEditor = (editors) => editorSchema2.validate(editors);

const traverse = (node) => {
	if (Joi.isSchema(node)) return node;
	var ans = {};
	for (var key in node) ans[key] = traverse(node[key]);
	return Joi.object(ans);
};

export const makeJoiObj = (editors, settings) => {
	var ans = {};
	for (var editor of editors)
		_.set(ans, editor.name, makeJoiLine(editor, settings, true));
	return traverse(ans);
};

export const App = (props) => {
	const { editors, settings } = props;

	const props2 = useMemo(() => {
		if (!settings) return null;

		const ans = renderProps(editors, settings, true);
		ans.schema = makeJoiObj(editors, settings);
		if (settings.querySchema)
			ans.querySchema = makeJoiObj(settings.querySchema, {});
		return ans;
	}, [editors, settings]);

	if (!editors.length) return "กรุณาสร้างข้อมูลด้านซ้าย";
	if (!settings)
		return (
			<center>
				<Spin />
			</center>
		);
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
	settings: null,
};
