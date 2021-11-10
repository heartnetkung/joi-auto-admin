import _extends from "@babel/runtime/helpers/extends";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import PropTypes from "prop-types";
import { Cascader } from "formik-antd";
import { useState } from "react";
import { usePersistFn } from "../../shared/hook";
import _ from "lodash";
import React from 'react';

var MyCascader = function MyCascader(props) {
  var asyncLoad = props.asyncLoad,
      options = props.options,
      showSearch = props.showSearch;

  var _useState = useState(options),
      options2 = _useState[0],
      setOptions = _useState[1];

  var props2 = _.omit(props, "asyncLoad");

  var loadData = usePersistFn( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(selected) {
      var lastRow;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              lastRow = selected[selected.length - 1];
              lastRow.loading = true;
              _context.next = 4;
              return asyncLoad(selected);

            case 4:
              lastRow.loading = false;
              setOptions([].concat(options2));

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
  return /*#__PURE__*/React.createElement(Cascader, _extends({}, props2, {
    options: options2,
    loadData: typeof asyncLoad === "function" ? loadData : null,
    showSearch: typeof asyncLoad === "function" ? undefined : showSearch
  }));
};

MyCascader.propTypes = {
  asyncLoad: PropTypes.func,
  options: PropTypes.array,
  showSearch: PropTypes.object
};
MyCascader.defaultProps = {
  asyncLoad: undefined,
  options: [],
  showSearch: undefined
};
export default MyCascader;