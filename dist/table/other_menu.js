import { DownloadOutlined, UploadOutlined, EyeOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { Menu, Button } from "antd";
import FileUpload from "../shared/file_upload";
import React from 'react';

var OtherMenu = function OtherMenu(props) {
  var onDownloadExcel = props.onDownloadExcel,
      onUploadExcel = props.onUploadExcel,
      onExampleExcel = props.onExampleExcel;
  var downloadExcelLabel = props.downloadExcelLabel,
      uploadExcelLabel = props.uploadExcelLabel,
      exampleExcelLabel = props.exampleExcelLabel;
  return /*#__PURE__*/React.createElement(Menu, null, onDownloadExcel && /*#__PURE__*/React.createElement(Menu.Item, {
    key: "1"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "text",
    onClick: onDownloadExcel,
    icon: /*#__PURE__*/React.createElement(DownloadOutlined, null),
    block: true,
    style: {
      textAlign: "left"
    }
  }, downloadExcelLabel)), onUploadExcel && /*#__PURE__*/React.createElement(Menu.Item, {
    key: "2"
  }, /*#__PURE__*/React.createElement(FileUpload, {
    type: "text",
    handleFile: onUploadExcel,
    icon: /*#__PURE__*/React.createElement(UploadOutlined, null),
    accept: ".xlsx",
    block: true,
    style: {
      textAlign: "left"
    }
  }, uploadExcelLabel)), onExampleExcel && /*#__PURE__*/React.createElement(Menu.Item, {
    key: "3"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "text",
    onClick: onExampleExcel,
    icon: /*#__PURE__*/React.createElement(EyeOutlined, null),
    block: true,
    style: {
      textAlign: "left"
    }
  }, exampleExcelLabel)));
};

OtherMenu.propTypes = {
  onDownloadExcel: PropTypes.func,
  onUploadExcel: PropTypes.func,
  onExampleExcel: PropTypes.func,
  downloadExcelLabel: PropTypes.string,
  uploadExcelLabel: PropTypes.string,
  exampleExcelLabel: PropTypes.string
};
OtherMenu.defaultProps = {
  onDownloadExcel: null,
  onUploadExcel: null,
  onExampleExcel: null,
  downloadExcelLabel: "ดาวน์โหลด Excel",
  uploadExcelLabel: "อัพโหลด Excel",
  exampleExcelLabel: "ตัวอย่าง Excel อัพโหลด"
};
export default OtherMenu;