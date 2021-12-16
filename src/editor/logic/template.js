import _ from "lodash";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import { makeJoiLine, makeExtraJoiLines } from "./joi_line";
import { raw, showRaw, func } from "./util";
import { randomData, genChanceString } from "./chance";
import {
	DependentComp,
	AsyncDropdown,
	CascaderStatic,
} from "./custom_component";

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const traverse = (node) => {
	if (typeof node === "string") return node;

	var ans = {};
	for (var key in node) ans[key] = raw(traverse(node[key]));
	return raw(`Joi.object(${JSON.stringify(ans, null, 1)})`);
};

export const renderJoi = (editors, settings, isComp) => {
	var ans = {};
	for (var editor of editors) {
		_.set(ans, editor.name, makeJoiLine(editor, settings));
		var extraJoiLines = makeExtraJoiLines(editor, settings);
		for (var i = 0, ii = extraJoiLines.length; i < ii; i++)
			_.set(ans, editor.name + "-" + i, extraJoiLines[i]);
	}
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
		"largeComponent",
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

export const renderImport = (editors) => {
	const ans = new Set();
	const reactImport = new Set();
	const formikAntdImport = new Set();

	for (var { fieldType } of editors) {
		if (fieldType === "upload|google cloud storage")
			ans.add("import axios from 'axios';");
		else if (fieldType === "upload|firebase") {
			ans.add("import { initializeApp } from 'firebase/app';");
			ans.add(
				"import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';"
			);
			ans.add("import { nanoid } from 'nanoid';");
		} else if (fieldType === "custom component|dependent input example") {
			ans.add("import {useFormikContext} from 'formik';");
			ans.add("import _ from 'lodash';");
			formikAntdImport.add("Input");
			reactImport.add("useEffect");
		} else if (fieldType === "custom component|async searchable dropdown") {
			reactImport.add("useEffect");
			reactImport.add("useState");
			formikAntdImport.add("Select");
		} else if (
			fieldType === "hierarchical dropdown|static option, allow modify" ||
			fieldType === "hierarchical dropdown|static option, no modify"
		) {
			reactImport.add("useEffect");
			reactImport.add("useState");
			ans.add("import { Cascader } from 'antd';");
			ans.add("import {useFormikContext} from 'formik';");
		}
	}

	const reactString = reactImport.size
		? ",{" + [...reactImport].join(",") + "}"
		: "";
	ans.add(`import React${reactString} from 'react';`);

	if (formikAntdImport.size)
		ans.add(
			`import {${[...formikAntdImport].join(",")}} from 'formik-antd';`
		);
	return [...ans].join("\n");
};

export const renderFunction = (editors) => {
	const ans = new Set();
	for (var { fieldType } of editors) {
		if (fieldType === "upload|firebase")
			ans.add(`\nlet storage = null;
const getFirebase = () => {
if (!storage) storage = getStorage(initializeApp({
apiKey: "",
authDomain: "",
projectId: "",
storageBucket: "",
messagingSenderId: "",
appId: "",
measurementId: "",
}));
return storage;
};`);
		else if (fieldType === "custom component|dependent input example")
			ans.add("\n" + DependentComp.str);
		else if (fieldType === "custom component|async searchable dropdown")
			ans.add("\n" + AsyncDropdown.str);
		else if (
			fieldType === "hierarchical dropdown|static option, allow modify" ||
			fieldType === "hierarchical dropdown|static option, no modify"
		)
			ans.add("\n" + CascaderStatic.str);
	}
	if (!ans.size) return "";
	return "\n" + [...ans].join("\n");
};

export const renderTemplate = (editors, settings) => {
	return format(`import { Joi, AutoAdmin, Chance } from 'joi_auto_admin';
${renderImport(editors)}

const wait = (ms) => new Promise((res) => setTimeout(res, ms));
const chance = new Chance(0);${renderFunction(editors)}

const schema = ${renderJoi(editors, settings)};

const mockData = ${genChanceString(editors, 3)};

const App = ()=>{
	const props = ${renderProps(editors, settings)};
	return <AutoAdmin {...props} />
}

export default App;
`);
};
