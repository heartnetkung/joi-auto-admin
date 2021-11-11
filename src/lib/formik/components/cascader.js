import PropTypes from "prop-types";
import { Cascader } from "formik-antd";
import { useState } from "react";
import { usePersistFn } from "../../shared/hook";
import _ from "lodash";
import React from 'react'
;
const CASCADER_OMIT = ["compLabels", "label", "asyncLoad"];

const MyCascader = (props) => {
	const { asyncLoad, options, showSearch } = props;
	const [options2, setOptions] = useState(options);
	const props2 = _.omit(props, CASCADER_OMIT);

	const loadData = usePersistFn(async (selected) => {
		var lastRow = selected[selected.length - 1];
		lastRow.loading = true;
		await asyncLoad(selected);
		lastRow.loading = false;
		setOptions([...options2]);
	});

	return (
		<Cascader
			{...props2}
			options={options2}
			loadData={typeof asyncLoad === "function" ? loadData : null}
			showSearch={
				typeof asyncLoad === "function" ? undefined : showSearch
			}
		></Cascader>
	);
};

MyCascader.propTypes = {
	asyncLoad: PropTypes.func,
	options: PropTypes.array,
	showSearch: PropTypes.object,
};

MyCascader.defaultProps = {
	asyncLoad: undefined,
	options: [],
	showSearch: undefined,
};

export default MyCascader;