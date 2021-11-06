import { utils, writeFile, read } from "xlsx";
import _ from "lodash";

export const tableToExcel = (dataArray, fileName) => {
	dataArray = dataArray.map(handleNested);
	var worksheet = utils.json_to_sheet(dataArray, { dateNF: "yyyy-mm-dd" });
	if (!fileName) return worksheet;

	var workbook = utils.book_new();
	utils.book_append_sheet(workbook, worksheet, "Sheet 1");
	writeFile(workbook, fileName);
};

export const excelToTable = (fileObject) =>
	new Promise((res, rej) => {
		var reader = new FileReader();
		reader.onload = (e) => {
			try {
				var data = e.target.result;
				var workbook = read(data, { type: "binary" });
				var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
				var ans = utils.sheet_to_json(firstSheet, { header: "A" });
				res(ans);
			} catch (error) {
				rej(error);
			}
		};
		reader.onerror = () => rej(reader.error);
		reader.readAsBinaryString(fileObject);
	});

const handleNested = (obj) => {
	var paths = listPaths(obj);
	var ans = {};
	for (var path of paths) {
		var current = _.get(obj, path);
		if (Array.isArray(current)) current += "";
		ans[path] = current;
	}
	return ans;
};

const listPaths = (obj, prefix) => {
	var keys = Object.keys(obj);
	prefix = prefix ? prefix + "." : "";
	return keys.reduce(function (result, key) {
		if (isObject(obj[key]))
			return result.concat(listPaths(obj[key], prefix + key));
		result.push(prefix + key);
		return result;
	}, []);
};

const isObject = (x) => Object.prototype.toString.call(x) === "[object Object]";
