import _ from "lodash";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import { makeJoiLine, makeExtraJoiLines } from "./joi_line";
import { raw, showRaw, func } from "./util";
import { randomData, genChanceString } from "./chance";
import * as Comp from "./custom_component";
import { SmileOutlined } from "@ant-design/icons";
import React from "react";

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
	const { rowButtonExample, title } = settings;

	// required
	var ans = { title: title || "{tableName}" };

	if (isComp) {
		ans.getMany = raw(async () => {
			await wait(500);
			return randomData(editors, 3);
		}, isComp);
	} else {
		ans.schema = raw("schema", false);
		if (querySchema) {
			ans.querySchema = raw(renderJoi(querySchema, {}));
			ans.getMany = raw(
				"async (tableQuery)=>{await wait(500);return mockData();}"
			);
		} else
			ans.getMany = raw("async ()=>{await wait(500);return mockData();}");
	}

	if (canCreate)
		ans.createMany = func("async (a)=>{await wait(500);return a;}", isComp);
	if (canDelete)
		ans.deleteMany = func("async ()=>{await wait(500);}", isComp);
	if (canUpdate) ans.updateOne = func("async ()=>{await wait(500);}", isComp);
	if (rowButtonExample) {
		ans.rowButtons = [
			{
				label: "hello",
				icon: isComp ? (
					<SmileOutlined />
				) : (
					raw("<SmileOutlined />", isComp)
				),
				onClick: func(
					`(rowData, updateData)=>{
alert(JSON.stringify(rowData));
// updateData(newRowData);
}`,
					isComp
				),
			},
		];
		ans.tableButtons = [
			{
				label: "hello",
				icon: isComp ? (
					<SmileOutlined />
				) : (
					raw("<SmileOutlined />", isComp)
				),
				onClick: func(
					`(rowDataArray, updateData)=>{
alert(JSON.stringify(rowDataArray));
// update data rows used for table rendering (matched by _id field)
// updateData(newRowDataArray);
}`,
					isComp
				),
			},
		];
	}

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

export const renderImport = (editors, settings) => {
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
		} else if (fieldType === "hierarchical dropdown|thai province") {
			ans.add(
				'import CascaderStatic from "joi-auto-admin/dist/formik/components/cascader_static";'
			);
			ans.add(
				'import thAddressData from "joi-auto-admin/dist/assets/th_address";'
			);
			reactImport.add("useEffect");
		} else if (fieldType === "custom component|color picker") {
			ans.add("import {useFormikContext} from 'formik';");
			ans.add("import _ from 'lodash';");
			ans.add("import {Button, Dropdown} from 'antd';");
			ans.add("import { SketchPicker } from 'react-color';");
		}
	}

	if (settings.rowButtonExample)
		ans.add('import { SmileOutlined } from "@ant-design/icons";');

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
			ans.add("\n" + Comp.DependentComp.str);
		else if (fieldType === "custom component|async searchable dropdown")
			ans.add("\n" + Comp.AsyncDropdown.str);
		else if (fieldType === "hierarchical dropdown|thai province")
			ans.add("\n" + Comp.THAddress.str);
		else if (fieldType === "custom component|color picker")
			ans.add("\n" + Comp.ColorPicker.str);
	}
	if (!ans.size) return "";
	return "\n" + [...ans].join("\n");
};

export const renderTemplate = (editors, settings) => {
	return format(`import { Joi, AutoAdmin, Chance } from 'joi_auto_admin';
${renderImport(editors, settings)}

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
