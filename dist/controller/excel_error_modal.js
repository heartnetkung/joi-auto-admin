import _extends from "@babel/runtime/helpers/extends";
import PropTypes from "prop-types";
import { Modal, Table } from "antd";
import Header from "./header";
import { ExclamationCircleFilled } from "@ant-design/icons";
import React from 'react';
var COLUMNS = [{
  title: "บรรทัด",
  dataIndex: "line",
  width: 100
}, {
  title: "คอลัมน์",
  dataIndex: "label",
  width: 100
}, {
  title: "ปัญหาที่พบ",
  dataIndex: "message"
}].map(function (a) {
  return _extends({}, a, {
    key: a.dataIndex
  });
});

var ExcelErrorModal = function ExcelErrorModal(props) {
  var visible = props.visible,
      onClose = props.onClose,
      errors = props.errors,
      title = props.title;
  var dataSource = errors.map(function (a, i) {
    return _extends({}, a, {
      key: i
    });
  });
  return /*#__PURE__*/React.createElement(Modal, {
    centered: true,
    visible: visible,
    width: 600,
    footer: null,
    onCancel: onClose
  }, /*#__PURE__*/React.createElement(Header, {
    title: title,
    icon: /*#__PURE__*/React.createElement(ExclamationCircleFilled, {
      style: {
        color: '#faad14'
      }
    }),
    small: true
  }), /*#__PURE__*/React.createElement(Table, {
    columns: COLUMNS,
    dataSource: dataSource,
    tableScroll: {
      y: 600
    },
    pagination: false,
    size: "small"
  }));
};

ExcelErrorModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  errors: PropTypes.array,
  title: PropTypes.string
};
ExcelErrorModal.defaultProps = {
  errors: [],
  title: "อัพโหลดไม่สำเร็จ"
};
export default ExcelErrorModal;