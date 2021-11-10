import _extends from "@babel/runtime/helpers/extends";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import PropTypes from "prop-types";
import { useState, useEffect, useMemo } from "react";
import Table from "../table";
import { alert, appendId } from "./util";
import { useModal, useAPI, usePersistFn } from "../shared/hook";
import EditModal from "./edit_modal";
import Header from "./header";
import { JoiWrapper } from "../joi/joi_wrapper";
import { tableToExcel, excelToTable } from "../shared/xlsx";
import { deserializeTable, serializeTable } from "../joi/serialize";
import ExcelErrorModal from "./excel_error_modal";
import Form from "../formik/form";
import Joi from "joi/lib/index";
import React from 'react';
var INITIAL_FORM_STATUS = {
  isEdit: false,
  initialValue: null,
  error: null
};

var Controller = function Controller(props) {
  var getMany = props.getMany,
      createMany = props.createMany,
      updateOne = props.updateOne,
      deleteMany = props.deleteMany;
  var canExportCsv = props.canExportCsv,
      canImportCsv = props.canImportCsv,
      name = props.name,
      description = props.description;
  var schema = props.schema,
      querySchema = props.querySchema,
      rowButtons = props.rowButtons,
      tableScroll = props.tableScroll;
  var canDownloadExcel = props.canDownloadExcel,
      canUploadExcel = props.canUploadExcel,
      uploadPreviewUrl = props.uploadPreviewUrl;

  var _useState = useState(INITIAL_FORM_STATUS),
      editModalData = _useState[0],
      setEditModalData = _useState[1];

  var _useState2 = useState([]),
      excelError = _useState2[0],
      setExcelError = _useState2[1];

  var _useAPI = useAPI(getMany, true, true),
      getManyStatus = _useAPI[0],
      doGetMany = _useAPI[1],
      setData = _useAPI[2];

  var _useAPI2 = useAPI(deleteMany),
      deleteStatus = _useAPI2[0],
      doDelete = _useAPI2[1];

  var editModalControl = useModal();
  var excelModalControl = useModal();
  var schema2 = useMemo(function () {
    return new JoiWrapper(schema);
  }, [schema]);
  var querySchema2 = useMemo(function () {
    return querySchema && new JoiWrapper(querySchema);
  }, [querySchema]);
  var onCreate = usePersistFn(function () {
    setEditModalData(INITIAL_FORM_STATUS);
    editModalControl.setVisible(true);
  });
  var onEdit = usePersistFn(function (obj) {
    setEditModalData({
      isEdit: true,
      initialValue: obj,
      error: null
    });
    editModalControl.setVisible(true);
  });
  var onSubmit = usePersistFn( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(data, actions) {
      var tableData, returnData;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              setEditModalData(function (a) {
                return _extends({}, a, {
                  error: null
                });
              });
              _context.prev = 1;

              if (!editModalData.isEdit) {
                _context.next = 12;
                break;
              }

              data = Joi.attempt(data, schema2.joiObj);
              _context.next = 6;
              return updateOne(data);

            case 6:
              tableData = getManyStatus.data;
              setData(tableData.map(function (a) {
                return a._id === data._id ? data : a;
              }));
              alert.success("แก้ไขข้อมูลเรียบร้อย");
              editModalControl.setVisible(false);
              _context.next = 22;
              break;

            case 12:
              data = Joi.attempt(data, schema2.joiObj);
              _context.next = 15;
              return createMany([data]);

            case 15:
              returnData = _context.sent;

              if (!(!Array.isArray(returnData) || returnData.length !== 1)) {
                _context.next = 18;
                break;
              }

              return _context.abrupt("return", alert.error("ข้อมูลจากเซิฟเวอร์ไม่ถูกต้อง"));

            case 18:
              data = appendId(returnData[0]);
              setData([data].concat(getManyStatus.data));
              alert.success("สร้างข้อมูลเรียบร้อย");
              editModalControl.setVisible(false);

            case 22:
              _context.next = 28;
              break;

            case 24:
              _context.prev = 24;
              _context.t0 = _context["catch"](1);
              setEditModalData(function (a) {
                return _extends({}, a, {
                  error: _context.t0
                });
              });
              actions.setSubmitting(false);

            case 28:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[1, 24]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
  var onDelete = usePersistFn( /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(selectedKeys) {
      var data, selectedSet, values;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              data = getManyStatus.data;
              selectedSet = new Set(selectedKeys);
              values = data.filter(function (a) {
                return selectedSet.has(a._id);
              });
              _context2.next = 6;
              return doDelete(values);

            case 6:
              setData(data.filter(function (a) {
                return !selectedSet.has(a._id);
              }));
              _context2.next = 12;
              break;

            case 9:
              _context2.prev = 9;
              _context2.t0 = _context2["catch"](0);
              alert.error(_context2.t0);

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 9]]);
    }));

    return function (_x3) {
      return _ref2.apply(this, arguments);
    };
  }());
  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(function () {
    doGetMany({}).then(function (data) {
      return setData(data.map(appendId));
    }).catch(function (error) {
      return alert.error(error);
    });
  }, []);
  var onQuery = usePersistFn( /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(query) {
      var data;
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              query = Joi.attempt(query, querySchema2.joiObj);
              _context3.next = 4;
              return doGetMany(query);

            case 4:
              data = _context3.sent;
              setData(data.map(appendId));
              _context3.next = 11;
              break;

            case 8:
              _context3.prev = 8;
              _context3.t0 = _context3["catch"](0);
              alert.error(_context3.t0);

            case 11:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[0, 8]]);
    }));

    return function (_x4) {
      return _ref3.apply(this, arguments);
    };
  }());
  var onDownloadExcel = usePersistFn(function () {
    if (!getManyStatus.data) return;
    var table = serializeTable(getManyStatus.data, schema2, true);
    tableToExcel(table, "export.xlsx");
  });
  var onExampleExcel = usePersistFn(function () {
    if (uploadPreviewUrl) return window.open(uploadPreviewUrl, "_blank").focus();
    if (!getManyStatus.data) return;
    var table = serializeTable(getManyStatus.data.slice(0, 3), schema2);
    tableToExcel(table, "example.xlsx");
  });
  var onUploadExcel = usePersistFn( /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(a) {
      var rawExcel, newRows, newData;
      return _regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return excelToTable(a);

            case 3:
              rawExcel = _context4.sent;
              newRows = deserializeTable(rawExcel, schema2);
              _context4.next = 7;
              return createMany(newRows);

            case 7:
              newData = _context4.sent;

              if (!(!Array.isArray(newData) || newData.length !== newRows.length)) {
                _context4.next = 10;
                break;
              }

              return _context4.abrupt("return", alert.error("ข้อมูลจากเซิฟเวอร์ไม่ถูกต้อง"));

            case 10:
              setData([].concat(newData.map(appendId), getManyStatus.data));
              alert.success("อัพโหลดเรียบร้อย");
              _context4.next = 20;
              break;

            case 14:
              _context4.prev = 14;
              _context4.t0 = _context4["catch"](0);

              if (!(_context4.t0.name !== "SerializeError")) {
                _context4.next = 18;
                break;
              }

              return _context4.abrupt("return", alert.error(_context4.t0));

            case 18:
              setExcelError(_context4.t0.errors);
              excelModalControl.setVisible(true);

            case 20:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[0, 14]]);
    }));

    return function (_x5) {
      return _ref4.apply(this, arguments);
    };
  }());
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Header, {
    name: name
  }), querySchema && /*#__PURE__*/React.createElement(Form, {
    schema: querySchema2,
    onSubmit: onQuery,
    submitButtonLabel: "\u0E14\u0E36\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25",
    inline: true
  }), /*#__PURE__*/React.createElement(Table, _extends({}, getManyStatus, {
    loading: getManyStatus.loading || deleteStatus.loading,
    canExportCsv: canExportCsv,
    canImportCsv: canImportCsv,
    schema: schema2,
    querySchema: querySchema,
    rowButtons: rowButtons,
    description: description,
    onEdit: updateOne && onEdit,
    onCreate: createMany && onCreate,
    onDelete: deleteMany && onDelete,
    data: getManyStatus.data,
    onDownloadExcel: canDownloadExcel ? onDownloadExcel : null,
    onUploadExcel: canUploadExcel ? onUploadExcel : null,
    onExampleExcel: canUploadExcel ? onExampleExcel : null,
    tableScroll: tableScroll
  })), /*#__PURE__*/React.createElement(EditModal, _extends({}, editModalControl, editModalData, {
    schema: schema2,
    onSubmit: onSubmit
  })), /*#__PURE__*/React.createElement(ExcelErrorModal, _extends({}, excelModalControl, {
    errors: excelError
  })));
};

Controller.propTypes = {
  // API
  getMany: PropTypes.func.isRequired,
  createMany: PropTypes.func,
  updateOne: PropTypes.func,
  deleteMany: PropTypes.func,
  // modifier
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  tableScroll: PropTypes.object,
  // form
  schema: PropTypes.object.isRequired,
  querySchema: PropTypes.object,
  rowButtons: PropTypes.array,
  //excel
  canDownloadExcel: PropTypes.bool,
  canUploadExcel: PropTypes.bool,
  uploadPreviewUrl: PropTypes.string
};
Controller.defaultProps = {
  getOne: null,
  createMany: null,
  updateOne: null,
  deleteMany: null,
  description: "",
  tableScroll: undefined,
  rowButtons: [],
  querySchema: null,
  canDownloadExcel: true,
  canUploadExcel: true,
  uploadPreviewUrl: null
};
export default Controller;