import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useFormikContext } from "formik";
import { Cascader } from "antd";
import PropTypes from "prop-types";

const CascaderStatic = (props) => {
	const { names, fieldNames, name, notFound } = props;
	const { cascaderOptions: options, notFoundText: nft } = props;
	const { setFieldValue, values } = useFormikContext();
	const [options2, setOptions2] = useState([]);
	const { label: l, value: v, children: c } = fieldNames;
	const [value, setValue] = useState([]);
	const diffValue = convertNames(names, []).map((a) => _.get(values, a));

	const syncToOtherFields = (value) => {
		var notFound = false;
		convertNames(names, value).forEach((a, i) => {
			if (!a) return;
			if (value[i] === nft) {
				notFound = true;
				setFieldValue(a, "", false);
			} else setFieldValue(a, value[i], false);
		});
		if (notFound) setFieldValue(name + ".$notFound", true, false);
	};

	const filter = (inputValue, path) =>
		path.some(
			(a) => a[l].toLowerCase().indexOf(inputValue.toLowerCase()) > -1
		);

	useEffect(() => {
		if (!notFound) setOptions2(options);
		else setOptions2(appendNotFoundText(options, l, c, v, nft));
	}, [notFound, options, l, c, v, nft]);

	useEffect(() => {
		var data = syncFromOtherFields(values, names, options, l, c, v, nft);
		setValue(data.ans);
		if (data.notFound && data.ans.length)
			setFieldValue(name + ".$notFound", true, false);
		/* eslint-disable react-hooks/exhaustive-deps */
	}, [...diffValue, options, l, c, v, nft]);

	const displayRender = (labels) => {
		if (!value.length) return null;
		const value2 = [];
		const names2 = convertNames(names, value);
		for (let i = 0, ii = value.length; i < ii; i++)
			if (names2[i]) value2.push(labels[i] || value[i]);
		return value2.join(" / ");
	};

	return (
		<Cascader
			{..._.omit(props, [
				"names",
				"notFound",
				"notFoundText",
				"cascaderOptions",
			])}
			options={options2}
			showSearch={{ filter }}
			onChange={syncToOtherFields}
			displayRender={displayRender}
			fieldNames={fieldNames}
			value={value}
			name={name + ".$value"}
		/>
	);
};

const convertNames = (names, value) => {
	if (Array.isArray(names)) return names;
	var ans = [];
	ans[value.length ? value.length - 1 : 0] = names;
	return ans;
};

const appendNotFoundText = (nodeArray, l, c, v, nft) => {
	var ans = [];
	var isLeaf = false;
	for (var node of nodeArray) {
		var newNode = { ...node };
		if (node[c]) newNode[c] = appendNotFoundText(node[c], l, c, v, nft);
		else isLeaf = true;
		ans.push(newNode);
	}
	if (isLeaf) ans.push({ [l]: nft, [v]: nft });
	return ans;
};

const syncFromOtherFields = (values, names, node, l, c, v, nft) => {
	var notFound = false;
	var ans = [];
	if (Array.isArray(names)) {
		names.forEach((name, i) => {
			var newNode = node.find((a) => a[v] === _.get(values, name));
			if (!newNode) notFound = true;
			else if (newNode[c]) node = newNode[c];
		});
		names.forEach((name, i) => {
			const theValue = _.get(values, name);
			if (!name || !theValue) return;
			ans[i] = theValue === nft ? "" : theValue;
		});
	} else {
		var lastValue = _.get(values, names);
		var traverse = (nodeArray, path) => {
			for (var node of nodeArray) {
				if (node[v] === lastValue) {
					ans = [...path, node[v]];
					return false;
				}
				if (node[c]) {
					var ret = traverse(node[c], [...path, node[v]]);
					if (!ret) return false;
				}
			}
			return true;
		};
		notFound = traverse(node, []);
	}
	return { ans, notFound };
};

CascaderStatic.propTypes = {
	name: PropTypes.string.isRequired,
	notFound: PropTypes.bool,
	notFoundText: PropTypes.string,
	names: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
	fieldNames: PropTypes.object,
	cascaderOptions: PropTypes.array.isRequired,
};

CascaderStatic.defaultProps = {
	notFound: false,
	notFoundText: "อื่นๆ",
	fieldNames: undefined,
};

export default CascaderStatic;
