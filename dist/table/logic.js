import _extends from "@babel/runtime/helpers/extends";
import numeral from "numeral";
import moment from "moment";
import _ from "lodash";
export var sorter = function sorter(a, b, c) {
  var dataIndex = this.dataIndex;
  return _.get(a, dataIndex) > _.get(b, dataIndex) ? -1 : 1;
};
export var onFilter = function onFilter(value, record) {
  var dataIndex = this.dataIndex,
      render = this.render;
  if (render) return render(record[dataIndex]) === value;
  return record[dataIndex] === value;
};
export var formatColumn = function formatColumn(a) {
  if (a.type === "number") return _extends({}, a, {
    width: 80,
    render: function render(a) {
      return numeral(a).format("0,0");
    }
  });
  if (a.type === "date") return _extends({}, a, {
    width: 130,
    render: function render(a) {
      return moment(a).format("YYYY-MM-DD");
    }
  });
  if (a.fieldType === "AddressDistrict") return _extends({}, a, {
    render: function render(a) {
      return a[1] + ", " + a[0];
    },
    ellipsis: true
  });
  if (a.fieldType === "Select") return _extends({}, a, {
    render: function render(b) {
      return a.valid[b];
    }
  });
  return a;
};