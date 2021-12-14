import _ from "lodash";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import { makeJoiLine } from "./joi_line";
import { raw, showRaw, func } from "./util";
import { randomData, genChanceString } from "./chance";

export const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const traverse = (node) => {
	if (typeof node === "string") return node;

	var ans = {};
	for (var key in node) ans[key] = raw(traverse(node[key]));
	return raw(`Joi.object(${JSON.stringify(ans, null, 1)})`);
};

export const renderJoi = (editors, settings, isComp) => {
	var ans = {};
	for (var editor of editors)
		_.set(ans, editor.name, makeJoiLine(editor, settings));
	return showRaw(traverse(ans));
};

export const renderProps = (editors, settings, isComp) => {
	const { canCreate, canUpdate, canDelete, querySchema, devMode } = settings;

	// required
	var ans = { name: settings.name || "{tableName}" };

	if (isComp) {
		ans.getMany = raw(async () => {
			await wait(500);
			return randomData(editors, 3);
		}, isComp);
	} else {
		ans.schema = raw("schema", false);
		if (querySchema) ans.querySchema = raw(renderJoi(querySchema, {}));
		ans.getMany = raw("async ()=>{await wait(500);return mockData();}");
	}

	if (canCreate)
		ans.createMany = func("async (a)=>{await wait(500);return a;}", isComp);
	if (canDelete)
		ans.deleteMany = func("async ()=>{await wait(500);}", isComp);
	if (canUpdate) ans.updateOne = func("async ()=>{await wait(500);}", isComp);

	// literal
	var extras = _.pick(settings, [
		"disableExcelDownload",
		"disableExcelUpload",
		"uploadPreviewUrl",
		"description",
		"steps",
	]);
	_.assign(ans, extras);
	ans.devMode = devMode || false;
	if (ans.steps) ans.steps = ans.steps.split(/\s*,\s*/);

	if (isComp) return ans;
	return showRaw(JSON.stringify(ans, null, 1));
};

export const format = (a, isJson) => {
	if (isJson) a = "(" + a + ")";
	return prettier.format(a, { parser: "babel", plugins: [parserBabel] });
};

export const renderTemplate = (editors, settings) => {
	return format(`import { Joi, AutoAdmin, Chance } from 'joi_auto_admin';
import React from 'react';

const chance = new Chance(0);
const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const schema = ${renderJoi(editors, settings)};

const mockData = ${genChanceString(editors, 3)};

const App = ()=>{
	const props = ${renderProps(editors, settings)};
	return <AutoAdmin {...props} />
}

export default App;
`);
};
