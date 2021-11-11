import numeral from "numeral";
import moment from "moment";
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

export const formatColumn = (a) => {
	if (a.type === "number")
		return { ...a, width: 80, render: (a) => numeral(a).format("0,0") };
	if (a.type === "date")
		return {
			...a,
			width: 130,
			render: (a) => moment(a).format("YYYY-MM-DD"),
		};
	if (a.fieldType === "Select") return { ...a, render: (b) => a.valid[b] };
	return a;
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
