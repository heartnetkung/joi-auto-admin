import _ from "lodash";
import { Input, Select } from "formik-antd";
import React, { useEffect, useState } from "react";
import { useFormikContext } from "formik";
import { Cascader } from "antd";

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

export const DependentComp = (props) => {
	const { values, setFieldValue } = useFormikContext();
	const values2 = JSON.stringify(_.set({ ...values }, props.name, null));
	useEffect(() => {
		setFieldValue(props.name, values2, false);
		/* eslint-disable react-hooks/exhaustive-deps */
	}, [values2, props.name]);
	return <Input disabled {...props} />;
};

DependentComp.str = `const DependentComp = (props)=>{
const {values,setFieldValue} = useFormikContext();
const values2 = JSON.stringify(_.set({ ...values }, props.name, null));
useEffect(()=>{
// you can also use setFieldValue to mutate other fields
setFieldValue(props.name,values2,false);},[values2,props.name])
return <Input disabled {...props}/>;
}`;

export const AsyncDropdown = (props) => {
	const [choices, setChoices] = useState([]);
	const fetchChoices = async () => {
		await wait(500);
		return [
			{ label: "Toyota", value: "a01" },
			{ label: "Hyundai", value: "a02" },
		];
	};
	useEffect(() => {
		(async () => {
			const data = await fetchChoices();
			// remap value so that value is also searchable
			const data2 = data.map(({ label, value }) => ({
				label: label + " " + value,
				value,
			}));
			setChoices(data2);
		})();
	}, []);
	return (
		<Select
			{...props}
			showSearch
			optionFilterProp="label"
			options={choices}
			filterOption={(input, option) =>
				option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
			}
		></Select>
	);
};

AsyncDropdown.str = `const AsyncDropdown = (props) => {
const [choices, setChoices] = useState([]);
const fetchChoices = async () => {
await wait(500);
return [
{ label: "Toyota", value: "a01" },
{ label: "Hyundai", value: "a02" },
];
};
useEffect(() => {
(async () => {
const data = await fetchChoices();
// remap value so that value is also searchable
const data2 = data.map(({ label, value }) => ({
label: label + " " + value,
value,
}));
setChoices(data2);
})();
}, []);
return (
<Select
{...props}
showSearch
optionFilterProp="label"
options={choices}
filterOption={(input, option) =>
option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
}
></Select>
);
}
`;

export const CascaderStatic = (props) => {
	const { options, names, fieldNames, name, notFound, notFoundText } = props;
	const { setFieldValue, values } = useFormikContext();
	const [options2, setOptions2] = useState([]);
	const { label: l, value: v, children: c } = fieldNames;
	const [value, setValue] = useState([]);
	const filter = (inputValue, path) =>
		path.some(
			(a) => a[l].toLowerCase().indexOf(inputValue.toLowerCase()) > -1
		);
	const onChange = (value) => {
		let notFound = false;
		names.forEach((a, i) => {
			if (!a) return;
			if (value[i] === notFoundText) {
				notFound = true;
				setFieldValue(a, "", false);
			} else setFieldValue(a, value[i], false);
		});
		if (notFound) setFieldValue(name + ".$notFound", true, false);
	};
	useEffect(() => {
		if (!notFound) {
			setOptions2(options);
			return;
		}
		const traverse = (nodeArray) => {
			const ans = [];
			let isLeaf = false;
			for (var node of nodeArray) {
				const newNode = { ...node };
				if (node[c]) newNode[c] = traverse(node[c]);
				else isLeaf = true;
				ans.push(newNode);
			}
			if (isLeaf) ans.push({ [l]: notFoundText, [v]: notFoundText });
			return ans;
		};
		setOptions2(traverse(options));
	}, [notFound, options, l, c, v, notFoundText]);
	useEffect(() => {
		const ans = [];
		names.forEach((name, i) => {
			const theValue = _.get(values, name);
			if (!name || !theValue) return;
			ans[i] = theValue === notFoundText ? "" : theValue;
		});
		setValue(ans);

		let notFound = false;
		let node = options;
		names.forEach((name, i) => {
			var newNode = node.find((a) => a[v] === _.get(values, name));
			if (!newNode) notFound = true;
			else if (newNode[c]) node = newNode[c];
		});
		if (notFound && ans.length)
			setFieldValue(name + ".$notFound", true, false);
		/* eslint-disable react-hooks/exhaustive-deps */
	}, [...names.map((a) => _.get(values, a)), options, l, c, v, notFoundText]);
	const displayRender = (labels) => {
		if (!value.length) return null;
		const value2 = [];
		for (let i = 0, ii = value.length; i < ii; i++)
			if (names[i]) value2.push(labels[i] || value[i]);
		return value2.join(" / ");
	};
	return (
		<Cascader
			{..._.omit(props, ["names", "notFound", "notFoundText"])}
			options={options2}
			showSearch={{ filter }}
			onChange={onChange}
			displayRender={displayRender}
			fieldNames={fieldNames}
			value={value}
			name={name + ".$value"}
		/>
	);
};
CascaderStatic.str = `
const CascaderStatic = (props) => {
const { options, names, fieldNames, name, notFound, notFoundText } = props;
const { setFieldValue, values } = useFormikContext();
const [options2, setOptions2] = useState([]);
const { label: l, value: v, children: c } = fieldNames;
const [value, setValue] = useState([]);
const filter = (inputValue, path) =>
path.some(
(a) => a[l].toLowerCase().indexOf(inputValue.toLowerCase()) > -1
);
const onChange = (value) => {
let notFound = false;
names.forEach((a, i) => {
if (!a) return;
if (value[i] === notFoundText) {
notFound = true;
setFieldValue(a, "", false);
} else setFieldValue(a, value[i], false);
});
if (notFound) setFieldValue(name + ".$notFound", true, false);
};
useEffect(() => {
if (!notFound) {
setOptions2(options);
return;
}
const traverse = (nodeArray) => {
const ans = [];
let isLeaf = false;
for (var node of nodeArray) {
const newNode = { ...node };
if (node[c]) newNode[c] = traverse(node[c]);
else isLeaf = true;
ans.push(newNode);
}
if (isLeaf) ans.push({ [l]: notFoundText, [v]: notFoundText });
return ans;
};
setOptions2(traverse(options));
}, [notFound, options, l, c, v, notFoundText]);
useEffect(() => {
const ans = [];
names.forEach((name, i) => {
const theValue = _.get(values, name);
if (!name || !theValue) return;
ans[i] = theValue === notFoundText ? "" : theValue;
});
setValue(ans);

let notFound = false;
let node = options;
names.forEach((name, i) => {
var newNode = node.find((a) => a[v] === _.get(values, name));
if (!newNode) notFound = true;
else if (newNode[c]) node = newNode[c];
});
if (notFound && ans.length)
setFieldValue(name + ".$notFound", true, false);
/* eslint-disable react-hooks/exhaustive-deps */
}, [...names.map((a) => _.get(values, a)), options, l, c, v, notFoundText]);
const displayRender = (labels) => {
if (!value.length) return null;
const value2 = [];
for (let i = 0, ii = value.length; i < ii; i++)
if (names[i]) value2.push(labels[i] || value[i]);
return value2.join(" / ");
};
return (
<Cascader
{..._.omit(props, ["names", "notFound", "notFoundText"])}
options={options2}
showSearch={{ filter }}
onChange={onChange}
displayRender={displayRender}
fieldNames={fieldNames}
value={value}
name={name + ".$value"}
/>
);
}`;
