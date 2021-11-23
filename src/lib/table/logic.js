import _ from "lodash";

const sorter = function (a, b) {
  var { dataIndex } = this;
  return _.get(a, dataIndex) > _.get(b, dataIndex) ? -1 : 1;
};

const onFilter = function (value, record) {
  var { dataIndex, render } = this;
  if (render) return render(record[dataIndex]) === value;
  return record[dataIndex] === value;
};

export const addFilter = (data) => {
  return (column) => {
    var filters = _.chain(data)
      .map(column.dataIndex.join("."))
      .map(column.render || _.identity)
      .uniq()
      .sortBy()
      .map((a) => ({ text: a, value: a }))
      .value();
    var ans = { ...column };
    ans.sorter = sorter.bind(ans);
    if (filters.length < 50 && filters.length) {
      ans.onFilter = onFilter.bind(ans);
      ans.filters = filters;
    }
    return ans;
  };
};
