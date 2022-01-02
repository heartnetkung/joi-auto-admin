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
	var ans = {};
	for (var editor of editors) {
		var spec = editorToChance(editor);
		var specObj = {};
		if (Array.isArray(spec))
			for (var j = 0, jj = spec.length; j < jj; j++)
				specObj[editor.name + "-" + j] = spec[j];
		else specObj[editor.name] = spec;

		for (var key in specObj) {
			var { name, args } = specObj[key];
			args = args
				? toSource(args)
						.replace(/^\[\s*/, "")
						.replace(/\s*\]$/, "")
				: "";
			_.set(ans, key, raw(`chance.${name}(${args})`));
		}
	}
	return `()=>{const ans=[]; for(let i=0;i<${count};i++)ans.push(${showRaw(
		JSON.stringify(ans)
	)}); return ans;}`;
};

export const randomData = (editors, count, seed) => {
	var ans = [];
	var newRandom;
	var chance = getChance(seed);
	for (var i = 0; i < count; i++) {
		var newValue = {};
		for (var editor of editors) {
			var spec = editorToChance(editor);
			var specObj = {};
			if (Array.isArray(spec))
				for (var j = 0, jj = spec.length; j < jj; j++)
					specObj[editor.name + "-" + j] = spec[j];
			else specObj[editor.name] = spec;

			for (var key in specObj) {
				var { name, args } = specObj[key];
				newRandom = chance[name].apply(chance, args || []);
				_.set(newValue, key, newRandom);
			}
		}
		ans.push(newValue);
	}
	return ans;
};

const editorToChance = (editor) => {
	switch (editor.fieldType) {
		case "hierarchical dropdown|static option, allow modify":
			return [
				{
					name: "pickone",
					args: [["Hardware Business", "Software Business"]],
				},
				{
					name: "pickone",
					args: [["Apple"]],
				},
			];
		case "hierarchical dropdown|static option, no modify":
			return [
				{
					name: "pickone",
					args: [["G001", "G002", "G003", "G004"]],
				},
			];
		case "hierarchical dropdown|async option":
			return {
				name: "pickone",
				args: [
					[
						["Hardware Business", "Intel"],
						["Software Business", "Google"],
					],
				],
			};
		case "hierarchical dropdown|thai province":
			return [
				{ name: "pickone", args: [["กรุงเทพมหานคร"]] },
				{ name: "pickone", args: [["จตุจักร"]] },
				{ name: "pickone", args: [["จตุจักร"]] },
				{ name: "pickone", args: [["10900"]] },
			];
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
		case "dropdown":
			return {
				name: "pickone",
				args: [["pizza", "steak", "sushi", "hamburger", "noodles"]],
			};
		case "common|number":
			return { name: "natural", args: [{ max: 30 }] };
		case "date|date":
		case "date|date-time":
		case "date|month":
		case "date|time":
			return { name: "date", args: [] };
		case "common|barcode scanner hardware":
			return { name: "pickone", args: [[["a001"], ["a002"]]] };
		case "common|paragraph":
			return { name: "paragraph" };
		case "common|password":
			return { name: "pickone", args: [[null]] };
		case "custom component|dependent input example":
			return { name: "pickone", args: [["{}"]] };
		case "custom component|async searchable dropdown":
			return { name: "pickone", args: [["a01", "a02"]] };
		case "custom component|array of fields example":
			var data = [
				[{ item: "Pizza", note: "ไม่ใส่ผัก" }],
				[
					{ item: "Pizza", note: "ไม่ใส่ผัก" },
					{ item: "Hamburger", note: "ซอสเยอะๆ" },
				],
			];
			return { name: "pickone", args: [data] };
		default:
			return { name: "word" };
	}
};
