import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { Button, Space, Dropdown } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useCallback } from "react";
import React from 'react';

var TableMenu = function TableMenu(props) {
  var deleteButtonLabel = props.deleteButtonLabel,
      createButtonLabel = props.createButtonLabel,
      selectedRows = props.selectedRows;
  var onCreate = props.onCreate,
      onDelete = props.onDelete,
      setSelectedRows = props.setSelectedRows,
      otherMenu = props.otherMenu;
  var onDelete2 = useCallback( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return onDelete(selectedRows);

          case 2:
            setSelectedRows([]);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })), [selectedRows, onDelete, setSelectedRows]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right",
      margin: 10
    }
  }, /*#__PURE__*/React.createElement(Space, null, !!selectedRows.length && onDelete && /*#__PURE__*/React.createElement(Button, {
    type: "danger",
    onClick: onDelete2,
    icon: /*#__PURE__*/React.createElement(DeleteOutlined, null)
  }, deleteButtonLabel), !selectedRows.length && onCreate && /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    onClick: onCreate,
    icon: /*#__PURE__*/React.createElement(PlusOutlined, null)
  }, createButtonLabel), otherMenu && /*#__PURE__*/React.createElement(Dropdown, {
    overlay: otherMenu,
    placement: "bottomRight"
  }, /*#__PURE__*/React.createElement(Button, null, "\u0E40\u0E21\u0E19\u0E39\u0E2D\u0E37\u0E48\u0E19\u0E46"))));
};

TableMenu.propTypes = {
  selectedRows: PropTypes.array.isRequired,
  setSelectedRows: PropTypes.func.isRequired,
  createButtonLabel: PropTypes.string,
  deleteButtonLabel: PropTypes.string,
  otherMenu: PropTypes.node,
  onCreate: PropTypes.func,
  onDelete: PropTypes.func
};
TableMenu.defaultProps = {
  createButtonLabel: "สร้าง",
  deleteButtonLabel: "ลบ",
  onCreate: null,
  onDelete: null,
  otherMenu: null
};
export default TableMenu;