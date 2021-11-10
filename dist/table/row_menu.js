import _extends from "@babel/runtime/helpers/extends";
import { Button, Space } from "antd";
import PropTypes from "prop-types";
import React from 'react';

var RowMenu = function RowMenu(props) {
  var buttons = props.buttons,
      record = props.record;
  return /*#__PURE__*/React.createElement(Space, null, buttons.map(function (action, index) {
    return /*#__PURE__*/React.createElement(Button, _extends({}, action, {
      key: index,
      onClick: action.onClick ? function (event) {
        return action.onClick(record, event);
      } : NOOP
    }), action.label);
  }));
};

RowMenu.propTypes = {
  buttons: PropTypes.array.isRequired,
  record: PropTypes.any.isRequired
};

var NOOP = function NOOP() {};

export default RowMenu;