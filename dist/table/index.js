import _extends from "@babel/runtime/helpers/extends";
import { Table, Row } from "antd";
import { useState, useMemo } from "react";
import _ from "lodash";
import { EditOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import RowMenu from "./row_menu";
import TableMenu from "./table_menu";
import { sorter, onFilter, formatColumn } from "./logic";
import OtherMenu from "./other_menu";
import { useMaxWidth } from "../shared/hook";
import React from 'react';

var TableComp = function TableComp(props) {
  var data = props.data,
      schema = props.schema,
      rowButtons = props.rowButtons,
      onEdit = props.onEdit,
      paginationSize = props.paginationSize;
  var onDelete = props.onDelete,
      onCreate = props.onCreate,
      tableScroll = props.tableScroll;
  var loading = props.loading,
      onDownloadExcel = props.onDownloadExcel,
      onUploadExcel = props.onUploadExcel,
      onExampleExcel = props.onExampleExcel;

  var _useState = useState([]),
      selectedRows = _useState[0],
      setSelectedRows = _useState[1];

  var columns = useMemo(function () {
    var ans2 = schema.toColumns().map(formatColumn).map(function (column) {
      var filters = _.chain(data).map(column.dataIndex.join(".")).map(column.render || _.identity).uniq().sortBy().map(function (a) {
        return {
          text: a,
          value: a
        };
      }).value();

      var ans = _extends({}, column);

      ans.sorter = sorter.bind(ans);

      if (filters.length < 50) {
        ans.onFilter = onFilter.bind(ans);
        ans.filters = filters;
      }

      return ans;
    }).filter(function (column) {
      return !column.tableHide;
    });
    var rowButtons2 = [].concat(rowButtons);
    if (onEdit) rowButtons2.push({
      icon: /*#__PURE__*/React.createElement(EditOutlined, null),
      onClick: onEdit
    });

    if (rowButtons2.length) {
      var render = function render(text, record) {
        return /*#__PURE__*/React.createElement(RowMenu, {
          buttons: rowButtons2,
          record: record
        });
      };

      var width = 60 * rowButtons2.length + 20;
      ans2.push({
        title: "เมนู",
        width: width,
        render: render
      });
    }

    return ans2;
  }, [schema, data, rowButtons, onEdit]);
  var rowSelection = !!onDelete && {
    selectedRowKeys: selectedRows,
    onChange: setSelectedRows
  };
  var smallScreen = useMaxWidth(575);
  var tableScroll2 = smallScreen ? {
    x: true,
    y: true
  } : tableScroll;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: loading ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement(TableMenu, {
    selectedRows: selectedRows,
    setSelectedRows: setSelectedRows,
    onDelete: onDelete,
    onCreate: onCreate,
    otherMenu: !onDownloadExcel && !onUploadExcel && !onExampleExcel ? null : /*#__PURE__*/React.createElement(OtherMenu, {
      onDownloadExcel: onDownloadExcel,
      onUploadExcel: onUploadExcel,
      onExampleExcel: onExampleExcel
    })
  })), /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Table, {
    loading: loading,
    columns: columns,
    dataSource: data,
    pagination: {
      defaultPageSize: paginationSize
    },
    scroll: tableScroll2,
    rowSelection: rowSelection,
    rowKey: "_id",
    style: {
      minWidth: Math.min(columns.length * 130, 800)
    }
  })));
};

TableComp.propTypes = {
  rowButtons: PropTypes.array,
  onCreate: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  schema: PropTypes.object.isRequired,
  paginationSize: PropTypes.number,
  tableScroll: PropTypes.object,
  loading: PropTypes.bool,
  onDownloadExcel: PropTypes.func,
  onUploadExcel: PropTypes.func,
  onExampleExcel: PropTypes.func
};
TableComp.defaultProps = {
  rowButtons: [],
  onDelete: null,
  onCreate: null,
  onEdit: null,
  paginationSize: 20,
  tableScroll: {
    y: 600,
    x: true
  },
  loading: false,
  onDownloadExcel: null,
  onUploadExcel: null,
  onExampleExcel: null
};
export default TableComp;