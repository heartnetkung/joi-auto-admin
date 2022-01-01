import { Joi, AutoAdmin } from "../../lib";
import React from "react";
import { useMemo } from "react";
import PropTypes from "prop-types";
import { renderProps, renderTemplate } from "./template";
import { makeJoiLine, makeExtraJoiLines } from "./joi_line";
import _ from "lodash";
import { Spin } from "antd";

const editorSchemaInner = Joi.object({
	_id: Joi.string().required(),
	name: Joi.string().required().min(1),
	label: Joi.string(),
	fieldType: Joi.string()
		.required()
		.valid(
			"dropdown",
			"upload|single file",
			"upload|multiple images",
			"upload|firebase",
			"upload|google cloud storage",
			"input",
			"format|url",
			"format|thai tel",
			"format|email",
			"format|thai zipcode",
			"format|thai citizen id",
			"format|regex validation example",
			"format|custom validation example",
			"custom component|dependent input example",
			"custom component|async searchable dropdown",
			"hierarchical dropdown|thai province",
			"hierarchical dropdown|static option, allow modify",
			"hierarchical dropdown|static option, no modify",
			"hierarchical dropdown|async option",
			"checkbox",
			"common|number",
			"common|date",
			"common|date-time",
			"common|time",
			"common|paragraph",
			"common|password",
			"common|barcode scanner hardware"
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
	columnHide: Joi.boolean(),
	disableSorting: Joi.boolean(),
	disableFilter: Joi.boolean(),
	appendDivider: Joi.boolean(),
	conditional: Joi.array(),
});

const editorSchema1 = Joi.array()
	.items(editorSchemaInner, Joi.any().strip())
	.unique("name");
const editorSchema2 = Joi.array().items(editorSchemaInner).unique("name");

const settingsSchema = Joi.object({
	title: Joi.string(),
	description: Joi.string(),
	canCreate: Joi.boolean(),
	canUpdate: Joi.boolean(),
	canDelete: Joi.boolean(),
	querySchema: editorSchema1,
	disableExcelDownload: Joi.boolean(),
	disableExcelUpload: Joi.boolean(),
	uploadPreviewUrl: Joi.string(),
	rowButtonExample: Joi.boolean(),
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
	for (var editor of editors) {
		_.set(ans, editor.name, makeJoiLine(editor, settings, true));
		var extraJoiLines = makeExtraJoiLines(editor, settings, true);
		for (var i = 0, ii = extraJoiLines.length; i < ii; i++)
			_.set(ans, editor.name + "-" + i, extraJoiLines[i]);
	}
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
	editors: PropTypes.array.isRequired,
	settings: PropTypes.object,
};
App.defaultProps = {
	settings: null,
};
