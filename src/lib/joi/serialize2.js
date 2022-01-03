import _ from "lodash";
import moment from "moment";
import { getErrorMessage } from "./error_message";
import Joi from "joi/lib/index";
import { JoiWrapper, guessFieldType } from "./joi_wrapper";

const ALLOWED_TYPES = new Set([
	"array",
	"boolean",
	"date",
	"number",
	"object",
	"string",
]);
const PICKED_TYPES = ["type", "fieldType", "meta"];

//TODO fixEmptyString
export const serializeTable = (table, schema) => {
	var columns = {};
	var formSpec = makeFormSpec(schema, table);
	var header = makeHeader(formSpec, table, columns, "");
	var ans = [header];
	for (var rowData of table) ans.push(makeBodyRow(rowData, header, columns));
	return ans;
};

const makeBodyRow = (rowData, header, columns) => {
	var ans = {};
	for (var fullName in header) {
		var current = _.get(rowData, fullName);
		var { type, meta, fieldType } = columns[fullName];
		if (type === "date")
			current = moment(current).format(getTimeFormat(fieldType, meta));
		ans[fullName] = current;
	}
	return ans;
};

const makeFormSpec = (schema) =>
	schema.formSpec.filter(
		(a) =>
			a.fieldHide !== true &&
			ALLOWED_TYPES.has(a.type) &&
			!/^\$|\.\$/.test(a.name)
	);

const getTimeFormat = (fieldType, meta) => {
	if (fieldType === "TimePicker") return "HH:mm";
	if (fieldType === "MonthPicker") return "YYYY-MM";
	return meta.showTime ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD";
};

const makeHeader = (formSpec, table, columns, prefix) => {
	var ans = {};
	for (var spec of formSpec) {
		if (spec.type !== "array") {
			ans[prefix + spec.name] = spec.label;
			columns[prefix + spec.name] = _.pick(spec, PICKED_TYPES);
			continue;
		}

		var column = _.chain(table)
			.map(spec.name)
			.filter((a) => Array.isArray(a))
			.map("length")
			.max()
			.value();
		var subSpec = spec._extractedSchema?.$_terms?.items?.[0];
		if (!subSpec || !ALLOWED_TYPES.has(subSpec.type)) continue;

		if (subSpec.type !== "object") {
			for (let i = 0, ii = column || 1; i < ii; i++) {
				var key = prefix + spec.name + `[${i}]`;
				ans[key] = spec.label + `[${i + 1}]`;
				var meta = subSpec?.$_terms?.metas?.[0] || {};
				var type = subSpec.type;
				columns[key] = {
					type,
					meta,
					fieldType: guessFieldType({ type }, meta),
				};
			}
			continue;
		}

		var formSpec2 = new JoiWrapper(subSpec).formSpec;
		var table2 = _.map(table, spec.name);
		for (let i = 0, ii = column || 1; i < ii; i++) {
			var prefix2 = spec.name + `[${i}].`;
			var ans2 = makeHeader(formSpec2, table2, columns, prefix2);
			// eslint-disable-next-line
			ans2 = _.mapValues(ans2, (a) => `${spec.label} ${a}[${i + 1}]`);
			_.assign(ans, ans2);
		}
	}
	return ans;
};

var tzOffset = null;
const getTzOffset = () => {
	if (!tzOffset) tzOffset = new Date().getTimezoneOffset() / 60;
	return tzOffset;
};

export const deserializeTable = (table, schema) => {
	var columns = {};
	var formSpec = makeFormSpec(schema, table);
	makeHeader(formSpec, table, columns, "");
	table = table.slice(1);

	var errors = [];
	var ans = [];
	for (var i = 0, ii = table.length; i < ii; i++) {
		try {
			ans.push(deserializeRow(table[i], columns, schema));
		} catch (error) {
			if (error.details)
				errors = [...errors, ...error.details.map(mapError(i))];
			else errors = [...errors, mapError(i)(error)];
		}
	}

	if (errors.length) throw new SerializeError(errors);
	return ans;
};

const deserializeRow = (excelRow, columns, schema) => {
	var ans = {};
	for (var key in excelRow) {
		var value = excelRow[key];
		var keyWithoutArray = key.replace(/\[.+\]/g, "[0]");
		var column = columns[keyWithoutArray];
		if (!column) continue;

		if (typeof value !== "string") {
			_.set(ans, key, value);
			continue;
		}

		var { type, fieldType, meta } = column;
		value = value.trim();
		if (type === "number") value = parseFloat(value);
		else if (type === "boolean") value = /true/i.test(value);
		else if (type === "date") {
			value = moment(value, getTimeFormat(fieldType, meta)).toDate();
			if (fieldType === "TimePicker") {
				value.setFullYear(1900);
				value.setDate(1);
				value.setMonth(0);
			} else if (!meta.showTime) {
				var newHours = value.getHours() - getTzOffset();
				if (newHours < 0) {
					newHours += 24;
					value.setDate(value.getDate() - 1);
				}
				value.setHours(newHours);
			}
		}
		_.set(ans, key, value);
	}
	return Joi.attempt(ans, schema.joiObj, { abortEarly: false });
};

const mapError = (i) => {
	return (a) => ({
		line: i + 3,
		label: a.context?.label || "",
		message: a.context ? getErrorMessage(a) : a.message,
		type: a.type || "error",
	});
};

export class SerializeError extends Error {
	constructor(errors) {
		super("SerializeError");
		this.name = "SerializeError";
		this.errors = errors;
		Error.captureStackTrace(this, this.constructor);
	}
}
