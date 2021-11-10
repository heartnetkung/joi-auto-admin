import _extends from "@babel/runtime/helpers/extends";

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import { Form, SubmitButton, ResetButton } from "formik-antd";
import { Formik } from "formik";
import PropTypes from "prop-types";
import { Space, Row, Col, Divider } from "antd";
import Field from "./field";
import { calculateSpan, handleCascader } from "./logic";
import { useMemo } from "react";
import React from 'react';

var CombinedForm = function CombinedForm(props) {
  var onSubmit = props.onSubmit,
      inline = props.inline,
      initialValues = props.initialValues;
  var resetButtonLabel = props.resetButtonLabel,
      submitButtonLabel = props.submitButtonLabel,
      schema = props.schema;

  var _useMemo = useMemo(function () {
    var formSpec2 = calculateSpan(schema.formSpec, inline);

    var _handleCascader = handleCascader(formSpec2),
        formSpec = _handleCascader.formSpec,
        cascaderHook = _handleCascader.cascaderHook;

    var onSubmitHooks = formSpec.map(function (a) {
      var _a$meta;

      return a == null ? void 0 : (_a$meta = a.meta) == null ? void 0 : _a$meta.onSubmitHook;
    }).filter(function (a) {
      return !!a;
    }).concat(cascaderHook);

    var onSubmit2 = function onSubmit2(postData, actions) {
      for (var _iterator = _createForOfIteratorHelperLoose(onSubmitHooks), _step; !(_step = _iterator()).done;) {
        var hook = _step.value;
        postData = hook(postData);
      }

      onSubmit(postData, actions);
    };

    return {
      formSpec: formSpec,
      onSubmit2: onSubmit2
    };
  }, [schema, inline, onSubmit]),
      formSpec = _useMemo.formSpec,
      onSubmit2 = _useMemo.onSubmit2;

  return /*#__PURE__*/React.createElement(Formik, {
    initialValues: initialValues || schema.toDefaultValues(),
    onSubmit: onSubmit2
  }, function () {
    return /*#__PURE__*/React.createElement(Form, {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 18
      },
      colon: !inline
    }, /*#__PURE__*/React.createElement(Row, {
      gutter: 8,
      justify: inline ? "center" : undefined
    }, formSpec.filter(function (a) {
      return !a.meta.formHide;
    }).map(function (a, i) {
      return /*#__PURE__*/React.createElement(Col, {
        key: a.name,
        span: a.colSpan || 24,
        offset: a.offset
      }, /*#__PURE__*/React.createElement(Field, _extends({}, a, {
        isFirst: i === 0
      })));
    }), inline && /*#__PURE__*/React.createElement(Col, {
      span: 4
    }, /*#__PURE__*/React.createElement(SubmitButton, {
      type: "primary",
      style: {
        marginBottom: 24
      }
    }, submitButtonLabel))), inline && /*#__PURE__*/React.createElement(Divider, {
      style: {
        marginTop: 10
      }
    }), !inline && /*#__PURE__*/React.createElement("center", null, /*#__PURE__*/React.createElement(Space, null, /*#__PURE__*/React.createElement(ResetButton, null, resetButtonLabel), /*#__PURE__*/React.createElement(SubmitButton, {
      type: "primary"
    }, submitButtonLabel))));
  });
};

CombinedForm.propTypes = {
  initialValues: PropTypes.any,
  onSubmit: PropTypes.func.isRequired,
  resetButtonLabel: PropTypes.string,
  submitButtonLabel: PropTypes.string,
  schema: PropTypes.object,
  inline: PropTypes.bool
};
CombinedForm.defaultProps = {
  initialValues: null,
  resetButtonLabel: "ล้างค่า",
  submitButtonLabel: "ยืนยัน",
  schema: null,
  inline: false
};
export default CombinedForm;