import _extends from "@babel/runtime/helpers/extends";
import { useRef } from "react";
import { Button } from "antd";
import PropTypes from "prop-types";
import _ from "lodash";
import React from 'react';

var FileUploader = function FileUploader(props) {
  var handleFile = props.handleFile,
      children = props.children,
      accept = props.accept;

  var props2 = _.omit(props, ["handleFile", "children"]);

  var hiddenFileInput = useRef(null);

  var handleClick = function handleClick(event) {
    return hiddenFileInput.current.click();
  };

  var handleChange = function handleChange(event) {
    return handleFile(event.target.files[0]);
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, _extends({}, props2, {
    onClick: handleClick
  }), children), /*#__PURE__*/React.createElement("input", {
    accept: accept,
    type: "file",
    ref: hiddenFileInput,
    onChange: handleChange,
    style: {
      display: "none"
    }
  }));
};

FileUploader.propTypes = {
  handleFile: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  accept: PropTypes.string.isRequired
  /*example: ".xlsx"*/

};
export default FileUploader;