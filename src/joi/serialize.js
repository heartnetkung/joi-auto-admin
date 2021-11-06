import _ from "lodash";
import { parseExcelDate } from "../facade/xlsx";
import moment from "moment";
import { getErrorMessage } from "./error_message";
import Joi from "joi/lib/index";

export class SerializeError extends Error {
	constructor(errors) {
		super("SerializeError");
		this.name = "SerializeError";
		this.errors = errors;
		Error.captureStackTrace(this, this.constructor);
	}
}

export const deserializeTable = (table, schema) => {
	var errors = [];
	var ans = [];
	for (var i = 0, ii = table.length; i < ii; i++) {
		try {
			ans.push(deserializeRow(table[i], schema, ""));
		} catch (error) {
			errors = [...errors, error.details.map(mapError(i))];
		}
	}

	if (errors.length) throw new SerializeError(errors);
	return ans;
};

const mapError = (i) => {
	return (a) => ({
		line: i + 2,
		label: a.context?.label,
		message: getErrorMessage(a),
		type: a.type,
	});
};

const deserializeRow = (excelRow, schema) => {
	if (!schema.columnCache)
		schema.columnCache = _.keyBy(schema.toColumns(), "title");

	var ans = {};
	for (var x in excelRow) {
		var column = schema.columnCache[x];
		if (!column) continue;

		var current = excelRow[x];
		if (column.type === "array" && typeof current === "string")
			current = current.split(/\s*,\s*/);
		else if (column.type === "date" && typeof current === "string")
			current = moment(current).parseZone(new Date()).toDate();
		else if (column.type === "date") current = parseExcelDate(current);

		_.set(ans, column.dataIndex, current);
	}
	return Joi.attempt(ans, schema.joiObj, { abortEarly: false });
};

export const serializeTable = (table, schema) => {
	var columns = schema.toColumns();
	var ans = [];
	for (var rowData of table) {
		var newRow = {};
		for (var column of columns) {
			var current = _.get(rowData, column.dataIndex);

			if (column.type === "array") current += "";
			else if (column.type === "date")
				current = moment(current).format("YYYY-MM-DD");

			newRow[column.title] = current;
		}
		ans.push(newRow);
	}
	return ans;
};
