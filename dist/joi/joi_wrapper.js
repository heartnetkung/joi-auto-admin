import _extends from "@babel/runtime/helpers/extends";

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import Joi from "joi/lib/index";
import { getErrorMessage } from "./error_message";
import _ from "lodash";

var JoiWrapper = /*#__PURE__*/function () {
  function JoiWrapper(joiObj) {
    if (Joi.isSchema(joiObj)) {
      this.joiObj = joiObj;
      this.describe = joiObj.describe();
    } else {
      try {
        this.joiObj = Joi.build(joiObj);
        this.describe = joiObj;
      } catch (e) {
        throw new Error("Invalid Joi Object");
      }
    }

    this.joiObj = this.joiObj.append({
      _id: Joi.any()
    });
    this.formSpec = [];
    traverse(this.describe, [], this.formSpec, this.joiObj);
    this.toColumns = this.toColumns.bind(this);
    this.toDefaultValues = this.toDefaultValues.bind(this);
  }

  var _proto = JoiWrapper.prototype;

  _proto.toColumns = function toColumns() {
    if (!this.columns) {
      this.columns = this.formSpec.map(function (a) {
        return {
          title: a.label,
          dataIndex: a.name.split("."),
          key: a.name,
          type: a.type,
          fieldType: a.fieldType,
          disabled: a.meta.disabled,
          valid: a.meta.valid,
          tableHide: a.meta.tableHide
        };
      });
    }

    return this.columns;
  };

  _proto.toDefaultValues = function toDefaultValues() {
    if (!this.defaultValues) {
      var ans = this.defaultValues = {};

      for (var _iterator = _createForOfIteratorHelperLoose(this.formSpec), _step; !(_step = _iterator()).done;) {
        var _step$value = _step.value,
            name = _step$value.name,
            defaultValue = _step$value.defaultValue;
        if (typeof defaultValue === "function") defaultValue = defaultValue();
        if (defaultValue !== undefined) _.set(ans, name, defaultValue);
      }
    }

    return this.defaultValues;
  };

  return JoiWrapper;
}();

var traverse = function traverse(node, path, ans, joiObj) {
  var _node$flags;

  if (node != null && (_node$flags = node.flags) != null && _node$flags.label) ans.push(new JoiField(node, path, joiObj));
  var keys = node.keys;
  if (keys) for (var key in keys) {
    traverse(keys[key], [].concat(path, [key]), ans, joiObj);
  }
};

var JoiField = /*#__PURE__*/function () {
  function JoiField(field, path, joiObj) {
    var _field$flags, _field$flags2, _field$flags3;

    this.required = (field == null ? void 0 : (_field$flags = field.flags) == null ? void 0 : _field$flags.presence) === "required";
    this.label = field == null ? void 0 : (_field$flags2 = field.flags) == null ? void 0 : _field$flags2.label;
    this.name = path.join(".");
    this.meta = this.getMeta(field);
    this.fieldType = this.guessFieldType(field, this.meta);
    this._extractedSchema = joiObj.extract(path);
    this.validate = this.validate.bind(this);
    this.type = field.type;
    this.twoColumn = !!this.meta.twoColumn;
    this.defaultValue = field == null ? void 0 : (_field$flags3 = field.flags) == null ? void 0 : _field$flags3.default;
    delete this.meta.twoColumn;
    delete this.meta.fieldType;
    delete this.meta.validLabel;
  }

  var _proto2 = JoiField.prototype;

  _proto2.getMeta = function getMeta(field) {
    var _field$flags4;

    var metas = field == null ? void 0 : field.metas;
    var ans = {};
    if (Array.isArray(metas) && metas.length === 1) ans = _extends({}, metas[0]);

    if (field != null && (_field$flags4 = field.flags) != null && _field$flags4.only && field != null && field.allow) {
      var _validLabel, _field$allow;

      var _ans = ans,
          validLabel = _ans.validLabel;
      var allow = field == null ? void 0 : field.allow;
      if (!Array.isArray(validLabel)) validLabel = allow;else if (((_validLabel = validLabel) == null ? void 0 : _validLabel.length) !== (field == null ? void 0 : (_field$allow = field.allow) == null ? void 0 : _field$allow.length)) throw new Error("validLabel is required and must have the equal length");
      var valid = ans.valid = {};

      for (var i = 0, ii = allow.length; i < ii; i++) {
        valid[allow[i]] = validLabel[i];
      }
    }

    return ans;
  };

  _proto2.guessFieldType = function guessFieldType(field, meta) {
    if (meta.fieldType) return meta.fieldType;
    if (field.type === "boolean") return "Checkbox";
    if (field.type === "date") return "DatePicker";
    if (field.type === "number") return "InputNumber";
    if (meta.valid) return "Select";
    return "Input";
  };

  _proto2.validate = function validate(value) {
    var rawError = this._extractedSchema.validate(value);

    if (!rawError.error || !Array.isArray(rawError.error.details)) return null;

    for (var _iterator2 = _createForOfIteratorHelperLoose(rawError.error.details), _step2; !(_step2 = _iterator2()).done;) {
      var errorObj = _step2.value;
      return getErrorMessage(errorObj, this.label);
    }

    return null;
  };

  return JoiField;
}();

export { JoiField, JoiWrapper };