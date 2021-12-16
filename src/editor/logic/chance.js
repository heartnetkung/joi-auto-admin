import { Chance } from "../../lib";
import _ from "lodash";
import { raw, showRaw } from "./util";
import toSource from "tosource";

var chance = null;
const getChance = (seed) => {
	if (seed) return new Chance(seed);
	if (!chance) chance = new Chance(Math.random());
	return chance;
};

export const genChanceString = (editors, count) => {
	var objSpec = {};
	for (var editor of editors) {
		var spec = editorToChance(editor);
		var args = spec.args
			? toSource(spec.args)
					.replace(/^\[\s*/, "")
					.replace(/\s*\]$/, "")
			: "";
		_.set(objSpec, editor.name, raw(`chance.${spec.name}(${args})`));
	}
	return `()=>{const ans=[]; for(let i=0;i<${count};i++)ans.push(${showRaw(
		JSON.stringify(objSpec)
	)}); return ans;}`;
};

export const randomData = (editors, count, seed) => {
	var ans = [];
	var chance = getChance(seed);
	for (var i = 0; i < count; i++) {
		var newValue = {};
		for (var editor of editors) {
			var spec = editorToChance(editor);
			var newRandom = chance[spec.name].apply(chance, spec.args || []);
			_.set(newValue, editor.name, newRandom);

			var extraSpecs = extraEditorToChance(editor);
			for (var key in extraSpecs) {
				spec = extraSpecs[key];
				newRandom = chance[spec.name].apply(chance, spec.args || []);
				_.set(newValue, key, newRandom);
			}
		}
		ans.push(newValue);
	}
	return ans;
};

const extraEditorToChance = (editor) => {
	if (!/^hierarchical dropdown|/.test(editor.fieldType)) return {};

	const { fieldType, name } = editor;
	switch (fieldType) {
		case "hierarchical dropdown|static option, allow modify":
			return {
				[name + "-0"]: {
					name: "pickone",
					args: [["Hardware Business", "Software Business"]],
				},
				[name + "-1"]: {
					name: "pickone",
					args: [["Apple"]],
				},
			};
		default:
			return {};
	}
};

const editorToChance = (editor) => {
	switch (editor.fieldType) {
		case "format|url":
		case "upload|single file":
			return { name: "avatar", args: [{ protocol: "https" }] };
		case "upload|multiple images":
		case "upload|firebase":
		case "upload|google cloud storage":
			return {
				name: "pickone",
				args: [
					[
						"https://www.gravatar.com/avatar/407cedb085e93b2253656ce07a52a898",
					],
				],
			};
		case "format|regex validation example":
		case "format|custom validation example":
			return { name: "pickone", args: [["changeme"]] };
		case "format|thai tel":
			return { name: "pickone", args: [["0812345678", "021111111"]] };
		case "format|email":
			return { name: "email" };
		case "format|thai zipcode":
			return { name: "pickone", args: [["10210", "10400"]] };
		case "format|thai citizen id":
			return {
				name: "pickone",
				args: [["0139499973311", "0547041689552"]],
			};
		case "checkbox":
			return { name: "bool" };
		case "number":
			return { name: "natural", args: [{ max: 30 }] };
		case "date":
			return { name: "date", args: [] };
		case "common|barcode scanner":
			return { name: "pickone", args: [[["a001"], ["a002"]]] };
		case "dropdown":
			return { name: "pickone", args: [["m", "f"]] };
		case "common|text area":
			return { name: "paragraph" };
		case "common|password":
			return { name: "pickone", args: [[null]] };
		case "custom component|dependent input example":
			return { name: "pickone", args: [["{}"]] };
		case "custom component|async searchable dropdown":
			return { name: "pickone", args: [["a01", "a02"]] };
		default:
			return { name: "word" };
	}
};
