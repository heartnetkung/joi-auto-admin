import _ from "lodash";
import { Input, Select } from "formik-antd";
import React, { useEffect, useState } from "react";
import { useFormikContext } from "formik";

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
