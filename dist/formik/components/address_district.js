import _extends from "@babel/runtime/helpers/extends";

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import PropTypes from "prop-types";
import { Cascader, Form } from "formik-antd";
import districtData from "../../assets/district";
import { useCallback } from "react";
import { getErrorMessage } from "../../joi/error_message";
import Joi from "joi/lib/index";

var Component = function Component(props) {
  var name = props.name,
      label = props.label,
      required = props.required,
      meta = props.meta,
      labelCol = props.labelCol,
      wrapperCol = props.wrapperCol;
  var validate = useCallback(function (value) {
    var schema = Joi.array();
    if (required) schema = schema.required();
    var rawError = schema.validate(value);
    if (!rawError.error || !Array.isArray(rawError.error.details)) return null;

    for (var _iterator = _createForOfIteratorHelperLoose(rawError.error.details), _step; !(_step = _iterator()).done;) {
      var errorObj = _step.value;
      return getErrorMessage(errorObj, label);
    }

    return null;
  }, [label, required]);
  return /*#__PURE__*/React.createElement(Form.Item, {
    label: label,
    required: required,
    name: name,
    validate: validate,
    labelCol: labelCol,
    wrapperCol: wrapperCol
  }, /*#__PURE__*/React.createElement(Cascader, _extends({
    options: getDistrict(),
    showSearch: {
      filter: provinceFilter
    },
    name: name
  }, meta)));
};

Component.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  meta: PropTypes.object.isRequired,
  labelCol: PropTypes.object,
  wrapperCol: PropTypes.object
};
Component.defaultProps = {
  labelCol: undefined,
  wrapperCol: undefined
};

var provinceFilter = function provinceFilter(inputValue, path) {
  return path.some(function (option) {
    return option.label.indexOf(inputValue) > -1;
  });
};

var district = null;

var getDistrict = function getDistrict(a) {
  if (!district) {
    district = districtData.map(function (province) {
      return {
        value: province.l,
        label: province.l,
        children: province.c.map(function (district) {
          return {
            value: district.l,
            label: district.l
          };
        })
      };
    });
  }

  return district;
};

export default Component;