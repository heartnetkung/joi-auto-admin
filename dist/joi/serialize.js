import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import _wrapNativeSuper from "@babel/runtime/helpers/wrapNativeSuper";

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import _ from "lodash";
import { parseExcelDate } from "../shared/xlsx";
import moment from "moment";
import { getErrorMessage } from "./error_message";
import Joi from "joi/lib/index";
export var SerializeError = /*#__PURE__*/function (_Error) {
  _inheritsLoose(SerializeError, _Error);

  function SerializeError(errors) {
    var _this;

    _this = _Error.call(this, "SerializeError") || this;
    _this.name = "SerializeError";
    _this.errors = errors;
    Error.captureStackTrace(_assertThisInitialized(_this), _this.constructor);
    return _this;
  }

  return SerializeError;
}( /*#__PURE__*/_wrapNativeSuper(Error));
export var deserializeTable = function deserializeTable(table, schema) {
  var errors = [];
  var ans = [];

  for (var i = 0, ii = table.length; i < ii; i++) {
    try {
      ans.push(deserializeRow(table[i], schema, ""));
    } catch (error) {
      errors = [].concat(errors, error.details.map(mapError(i)));
    }
  }

  if (errors.length) throw new SerializeError(errors);
  return ans;
};

var mapError = function mapError(i) {
  return function (a) {
    var _a$context;

    return {
      line: i + 2,
      label: (_a$context = a.context) == null ? void 0 : _a$context.label,
      message: getErrorMessage(a),
      type: a.type
    };
  };
};

var deserializeRow = function deserializeRow(excelRow, schema) {
  if (!schema.columnCache) schema.columnCache = _.keyBy(schema.toColumns(), "title");
  var ans = {};

  for (var x in excelRow) {
    var column = schema.columnCache[x];
    if (!column || column.disabled) continue;
    var current = excelRow[x];
    if (column.type === "array" && typeof current === "string") current = current.split(/\s*,\s*/);else if (column.type === "date" && typeof current === "string") current = moment(current).parseZone(new Date()).toDate();else if (column.type === "date") current = parseExcelDate(current);

    _.set(ans, column.dataIndex, current);
  }

  return Joi.attempt(ans, schema.joiObj, {
    abortEarly: false
  });
};

export var serializeTable = function serializeTable(table, schema, showDisabled) {
  var columns = schema.toColumns();
  var ans = [];

  for (var _iterator = _createForOfIteratorHelperLoose(table), _step; !(_step = _iterator()).done;) {
    var rowData = _step.value;
    var newRow = {};

    for (var _iterator2 = _createForOfIteratorHelperLoose(columns), _step2; !(_step2 = _iterator2()).done;) {
      var column = _step2.value;
      if (!showDisabled && column.disabled) continue;

      var current = _.get(rowData, column.dataIndex);

      if (column.type === "array") current += "";else if (column.type === "date") current = moment(current).format("YYYY-MM-DD");
      newRow[column.title] = current;
    }

    ans.push(newRow);
  }

  return ans;
};