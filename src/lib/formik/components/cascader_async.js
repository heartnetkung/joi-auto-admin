import _ from "lodash";
import React, { useEffect, useState } from "react";
import { Cascader } from "formik-antd";
import PropTypes from "prop-types";
import { Spin } from "antd";
import { useFormikContext } from "formik";

const CascaderAsync = (props) => {
	const { cascaderFetchData: fetchData, fieldNames, name } = props;
	const childrenField = fieldNames?.children || "children";
	const valueField = fieldNames?.value || "value";
	const [options, setOptions] = useState([]);
	const [loading, setLoading] = useState(false);
	const { values } = useFormikContext();

	// fetch heirarchy of data for the initial value
	useEffect(() => {
		(async () => {
			setLoading(true);
			var ans = [];
			try {
				var initValue = _.get(values, name);
				if (!Array.isArray(initValue)) initValue = [];

				var queues = [fetchData([])];
				for (let i = 0, ii = initValue.length - 1; i < ii; i++)
					queues.push(fetchData(initValue.slice(0, i + 1)));
				var results = await Promise.all(queues);
				ans = results[0];

				for (let i = 0, ii = initValue.length - 1; i < ii; i++) {
					var currentValue = initValue[i];
					var currentResult = results[i];
					var node = null;
					for (var j = 0, jj = currentResult.length; j < jj; j++)
						if (currentResult[j][valueField] === currentValue) {
							node = currentResult[j];
							break;
						}
					if (!node) break;
					node[childrenField] = results[i + 1];
				}
			} catch (e) {}
			setOptions(ans);
			setLoading(false);
		})();
		/* eslint-disable react-hooks/exhaustive-deps */
	}, []);

	const loadData = async (selectedOptions) => {
		const lastOption = selectedOptions[selectedOptions.length - 1];
		lastOption.loading = true;
		try {
			const newNodes = await fetchData(
				selectedOptions.map((a) => a[valueField])
			);
			if (Array.isArray(newNodes)) lastOption[childrenField] = newNodes;
		} catch (e) {}
		lastOption.loading = false;
		setOptions([...options]);
	};

	const dropdownRender = (a) => {
		if (!loading) return a;
		return (
			<center style={{ minWidth: 150, padding: 20 }}>
				<Spin />
			</center>
		);
	};

	return (
		<Cascader
			{..._.omit(props, ["cascaderFetchData"])}
			options={options}
			loadData={loadData}
			dropdownRender={dropdownRender}
		/>
	);
};

CascaderAsync.propTypes = {
	cascaderFetchData: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	fieldNames: PropTypes.object,
};

CascaderAsync.defaultProps = {
	fieldNames: undefined,
};

export default CascaderAsync;
