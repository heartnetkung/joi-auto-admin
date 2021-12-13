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
		}
		ans.push(newValue);
	}
	return ans;
};

const editorToChance = (editor) => {
	switch (editor.fieldType) {
		case "url":
		case "upload-multi":
		case "upload-single":
			return { name: "avatar", args: [{ protocol: "https" }] };
		case "tel":
			return { name: "pickone", args: [["0812345678", "021111111"]] };
		case "email":
			return { name: "email" };
		case "checkbox":
			return { name: "bool" };
		case "number":
			return { name: "natural", args: [{ max: 30 }] };
		case "date":
			return { name: "date", args: [] };
		case "barcode":
			return { name: "pickone", args: [[[]]] };
		case "dropdown":
			return { name: "pickone", args: [["m", "f"]] };
		default:
			return { name: "word" };
	}
};
