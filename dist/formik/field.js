import _extends from "@babel/runtime/helpers/extends";
import PropTypes from "prop-types";
import { Input, InputNumber, Checkbox, DatePicker, Form, Select, Switch } from "formik-antd";
import Cascader from "./components/cascader";
import moment from "moment";
import { useRef, useEffect } from "react";
import React from "react";
var WeekPicker = DatePicker.WeekPicker,
    RangePicker = DatePicker.RangePicker,
    MonthPicker = DatePicker.MonthPicker;

var Field = function Field(props) {
  var fieldType = props.fieldType,
      label = props.label,
      required = props.required,
      name = props.name,
      validate = props.validate,
      meta = props.meta,
      isFirst = props.isFirst;
  var labelCol = props.labelCol,
      wrapperCol = props.wrapperCol;
  var ref = useRef(null);
  useEffect(function () {
    if (ref.current) ref.current.focus();
  }, []);

  var props2 = _extends({}, meta, {
    name: name,
    ref: isFirst ? ref : null
  });

  return /*#__PURE__*/React.createElement(Form.Item, {
    label: label,
    required: required,
    name: name,
    validate: validate,
    labelCol: labelCol,
    wrapperCol: wrapperCol
  }, fieldType === "Cascader" && /*#__PURE__*/React.createElement(Cascader, _extends({}, props2, {
    ref: undefined
  })), fieldType === "Checkbox" && /*#__PURE__*/React.createElement(Checkbox, props2), fieldType === "DatePicker" && /*#__PURE__*/React.createElement(DatePicker, _extends({}, props2, {
    defaultValue: props2.defaultValue && moment(props2.defaultValue),
    style: {
      width: "100%"
    }
  })), fieldType === "WeekPicker" && /*#__PURE__*/React.createElement(WeekPicker, props2), fieldType === "RangePicker" && /*#__PURE__*/React.createElement(RangePicker, props2), fieldType === "MonthPicker" && /*#__PURE__*/React.createElement(MonthPicker, props2), fieldType === "Input" && /*#__PURE__*/React.createElement(Input, props2), fieldType === "InputNumber" && /*#__PURE__*/React.createElement(InputNumber, _extends({}, props2, {
    style: {
      width: "100%"
    }
  })), fieldType === "InputPhone" && /*#__PURE__*/React.createElement(Input, _extends({}, props2, {
    type: "tel",
    pattern: "\\d+"
  })), fieldType === "InputPassword" && /*#__PURE__*/React.createElement(Input.Password, props2), fieldType === "TextArea" && /*#__PURE__*/React.createElement(Input.TextArea, props2), fieldType === "Select" && /*#__PURE__*/React.createElement(Select, _extends({}, props2, {
    ref: undefined
  }), props2.valid && Object.entries(props2.valid).map(function (_ref) {
    var k = _ref[0],
        v = _ref[1];
    return /*#__PURE__*/React.createElement(Select.Option, {
      key: k,
      value: k
    }, v);
  })), fieldType === "Switch" && /*#__PURE__*/React.createElement(Switch, props2));
};

Field.propTypes = {
  fieldType: PropTypes.oneOf(["AddressProvince", "AddressDistrict", "Cascader", "Checkbox", "DatePicker", "WeekPicker", "RangePicker", "MonthPicker", "Input", "InputNumber", "InputPhone", "InputPassword", "TextArea", "Select", "Switch"]).isRequired,
  name: PropTypes.string.isRequired,
  validate: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  meta: PropTypes.object.isRequired,
  isFirst: PropTypes.bool.isRequired,
  labelCol: PropTypes.object,
  wrapperCol: PropTypes.object
};
Field.defaultProps = {
  labelCol: undefined,
  wrapperCol: undefined
};
export default Field;