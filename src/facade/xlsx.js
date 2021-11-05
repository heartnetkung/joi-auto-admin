import XLSX from "xlsx";
import _ from "lodash";

export const tableToExcel = (dataArray, fileName) => {
	dataArray = dataArray.map(handleNested);
	var worksheet = XLSX.utils.json_to_sheet(dataArray);
	if (!fileName) return worksheet;

	var workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
	XLSX.writeFile(workbook, fileName);
};

export const excelToTable = (fileObject) =>
	new Promise((res, rej) => {
		var reader = new FileReader();
		reader.onload = (e) => {
			var data = e.target.result;
			var workbook = XLSX.read(data, { type: "binary" });
			var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
			var ans = XLSX.utils.sheet_to_json(firstSheet, { header: "A" });
			res(ans);
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
