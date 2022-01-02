import _ from "lodash";
import { Input, Select } from "formik-antd";
import React, { useEffect, useState } from "react";
import { useFormikContext } from "formik";
import CascaderStatic from "../../lib/formik/components/cascader_static";
import { SketchPicker } from "react-color";
import { Button, Dropdown } from "antd";

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

export const THAddress = (props) => {
	const [options, setOptions] = useState([]);
	const className = "thAddress" + props.name.replace(/[^a-z0-9]/gi, "");

	useEffect(() => {
		const listener = () => {
			const selector = "." + className + " .ant-cascader-menu";
			const columns = document.querySelectorAll(selector);
			const length = columns.length;
			for (let i = 0; i < length; i++)
				columns[i].classList.add("th-address-small");
			if (length > 1)
				columns[length - 2].classList.remove("th-address-small");
			if (length > 0)
				columns[length - 1].classList.remove("th-address-small");
		};
		document.addEventListener("click", listener);
		return () => document.removeEventListener("click", listener);
	}, []);

	useEffect(() => {
		(async () => {
			const data = await import("../../lib/assets/th_address");
			setOptions(data.default);
		})();
	}, []);

	return (
		<CascaderStatic
			{...props}
			cascaderOptions={options}
			dropdownRender={(a) => <div className={className}>{a}</div>}
		></CascaderStatic>
	);
};

// WARNING string version and functional version are different
THAddress.str = `const THAddress = (props) => {
const className = "thAddress" + props.name.replace(/[^a-z0-9]/gi, "");
//responsive dropdown for small screens
useEffect(() => {
const listener = () => {
const selector = "." + className + " .ant-cascader-menu";
const columns = document.querySelectorAll(selector);
const length = columns.length;
for (let i = 0; i < length; i++)
columns[i].classList.add("th-address-small");
if (length > 1)
columns[length - 2].classList.remove("th-address-small");
if (length > 0)
columns[length - 1].classList.remove("th-address-small");
};
document.addEventListener("click", listener);
return () => document.removeEventListener("click", listener);
}, []);
return (
<CascaderStatic
{...props}
dropdownRender={(a) => <div className={className}>{a}</div>}
></CascaderStatic>
);
};
`;

export const ColorPicker = (props) => {
	const { name } = props;
	const { values, setFieldValue } = useFormikContext();
	const color = _.get(values, name) || "#bbcccc";
	const setColor = ({ hex }) => setFieldValue(name, hex, false);

	return (
		<>
			<div
				style={{
					width: 32,
					height: 32,
					background: color,
					display: "inline-block",
					marginRight: 20,
					verticalAlign: "bottom",
				}}
			/>
			<Dropdown
				overlay={
					<SketchPicker
						color={color}
						onChangeComplete={setColor}
						disableAlpha
					/>
				}
				trigger={["click"]}
			>
				<Button {...props}>เปลี่ยนสี</Button>
			</Dropdown>
		</>
	);
};
ColorPicker.str=`const ColorPicker = (props) => {
const { name } = props;
const { values, setFieldValue } = useFormikContext();
const color = _.get(values, name) || "#bbcccc";
const setColor = ({ hex }) => setFieldValue(name, hex, false);
return (
<>
<div
style={{
width: 32,
height: 32,
background: color,
display: "inline-block",
marginRight: 20,
verticalAlign: "bottom",
}}
/>
<Dropdown
overlay={
<SketchPicker
color={color}
onChangeComplete={setColor}
disableAlpha
/>
}
trigger={["click"]}
>
<Button {...props}>เปลี่ยนสี</Button>
</Dropdown>
</>
);
};
`