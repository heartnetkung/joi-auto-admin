import { utils, writeFile, read, SSF } from "xlsx";
import _ from "lodash";
import moment from "moment";
export var tableToExcel = function tableToExcel(dataArray, fileName) {
  dataArray.forEach(handleNested);
  var worksheet = utils.json_to_sheet(dataArray, {
    dateNF: "yyyy-mm-dd"
  });
  if (!fileName) return worksheet;
  var workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Sheet 1");
  writeFile(workbook, fileName);
};
export var parseExcelDate = function parseExcelDate(date) {
  var a = SSF.parse_date_code(date);
  var momentInput = {
    y: a.y,
    M: a.m - 1,
    d: a.d,
    h: a.H,
    m: a.M,
    s: a.S
  };
  return moment(momentInput).parseZone(new Date()).toDate();
};
export var excelToTable = function excelToTable(fileObject) {
  return new Promise(function (res, rej) {
    var reader = new FileReader();

    reader.onload = function (e) {
      try {
        var data = e.target.result;
        var workbook = read(data, {
          type: "binary"
        });
        var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        var ans = utils.sheet_to_json(firstSheet);
        res(ans.map(parse));
      } catch (error) {
        rej(error);
      }
    };

    reader.onerror = function () {
      return rej(reader.error);
    };

    reader.readAsBinaryString(fileObject);
  });
};

var parse = function parse(a) {
  return _.omit(a, "__rowNum__");
};

var handleNested = function handleNested(obj) {
  for (var key in obj) {
    var value = obj[key];
    if (isObject(value)) throw new Error("XLSX layer does not support object");
    if (Array.isArray(value)) throw new Error("XLSX layer does not support array");
  }
};

var isObject = function isObject(x) {
  return Object.prototype.toString.call(x) === "[object Object]";
};