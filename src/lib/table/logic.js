import numeral from "numeral";
import moment from "moment";
import _ from "lodash";

export const sorter = function (a, b, c) {
	var { dataIndex } = this;
	return _.get(a, dataIndex) > _.get(b, dataIndex) ? -1 : 1;
};

export const onFilter = function (value, record) {
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
	if (a.fieldType === "AddressDistrict")
		return { ...a, render: (a) => `${a[1]}, ${a[0]}`, ellipsis: true };
	if (a.fieldType === "Select") return { ...a, render: (b) => a.valid[b] };
	return a;
};
