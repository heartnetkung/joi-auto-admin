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
		if (type === "date") {
			var format = meta.showTime ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD";
			if (fieldType === "TimePicker") format = "HH:mm";
			if (fieldType === "MonthPicker") format = "YYYY-MM";
			current = moment(current).format(format);
		}
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
			for (var i = 0, ii = column || 1; i < ii; i++) {
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
		for (var i = 0, ii = column || 1; i < ii; i++) {
			var prefix2 = spec.name + `[${i}].`;
			var ans2 = makeHeader(formSpec2, table2, columns, prefix2);
			ans2 = _.mapValues(ans2, (a) => `${spec.label} ${a}[${i + 1}]`);
			_.assign(ans, ans2);
		}
	}
	return ans;
};
