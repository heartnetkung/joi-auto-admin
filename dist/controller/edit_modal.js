import PropTypes from "prop-types";
import { Modal, Alert } from "antd";
import Form from "../formik/form";
import Header from "./header";
import React from 'react';

var EditModal = function EditModal(props) {
  var visible = props.visible,
      onClose = props.onClose,
      isEdit = props.isEdit,
      schema = props.schema,
      onSubmit = props.onSubmit;
  var createHeader = props.createHeader,
      editHeader = props.editHeader,
      error = props.error,
      initialValue = props.initialValue; //need to unmount in order for initialValue and autoFocus to work

  if (!visible) return null;
  return /*#__PURE__*/React.createElement(Modal, {
    centered: true,
    visible: visible,
    width: 800,
    footer: null,
    onCancel: onClose,
    maskClosable: false
  }, /*#__PURE__*/React.createElement(Header, {
    title: isEdit ? editHeader : createHeader,
    small: true
  }), error && /*#__PURE__*/React.createElement(Alert, {
    message: error.message || error,
    type: "error",
    showIcon: true,
    style: {
      margin: 30,
      marginBottom: 20,
      marginTop: -10
    }
  }), /*#__PURE__*/React.createElement(Form, {
    initialValues: initialValue,
    schema: schema,
    onSubmit: onSubmit
  }));
};

EditModal.propTypes = {
  isEdit: PropTypes.bool.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  schema: PropTypes.object.isRequired,
  editHeader: PropTypes.string,
  createHeader: PropTypes.string,
  error: PropTypes.instanceOf(Error),
  initialValue: PropTypes.object
};
EditModal.defaultProps = {
  createHeader: "เพิ่มข้อมูลใหม่",
  editHeader: "แก้ไขข้อมูล",
  error: null,
  initialValue: undefined
};
export default EditModal;