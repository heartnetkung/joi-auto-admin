import PropTypes from "prop-types";
import {
	Input,
	InputNumber,
	Checkbox,
	DatePicker,
	Form,
	Select,
	Switch,
} from "formik-antd";
import AddressDistrict from "./components/address_district";
import AddressProvince from "./components/address_province";
import moment from "moment";
import { useRef, useEffect } from "react";

const { WeekPicker, RangePicker, MonthPicker } = DatePicker;

const Field = (props) => {
	const { fieldType, label, required, name, validate, meta, isFirst } = props;

	const ref = useRef(null);
	useEffect(() => {
		if (ref.current) ref.current.focus();
	}, []);

	const props2 = { ...meta, name, ref: isFirst ? ref : null };

	if (fieldType === "AddressProvince") return <AddressProvince {...props} />;
	if (fieldType === "AddressDistrict") return <AddressDistrict {...props} />;

	return (
		<Form.Item
			label={label}
			required={required}
			name={name}
			validate={validate}
		>
			{fieldType === "Checkbox" && <Checkbox {...props2}></Checkbox>}
			{fieldType === "DatePicker" && (
				<DatePicker
					{...props2}
					defaultValue={
						props2.defaultValue && moment(props2.defaultValue)
					}
				/>
			)}
			{fieldType === "WeekPicker" && <WeekPicker {...props2} />}
			{fieldType === "RangePicker" && <RangePicker {...props2} />}
			{fieldType === "MonthPicker" && <MonthPicker {...props2} />}
			{fieldType === "Input" && <Input {...props2} />}
			{fieldType === "InputNumber" && <InputNumber {...props2} />}
			{fieldType === "InputPhone" && (
				<Input {...props2} type="tel" pattern="\d+" />
			)}
			{fieldType === "InputPassword" && <Input.Password {...props2} />}
			{fieldType === "TextArea" && <Input.TextArea {...props2} />}
			{fieldType === "Select" && <Select {...props2} />}
			{fieldType === "Switch" && <Switch {...props2} />}
		</Form.Item>
	);
};

Field.propTypes = {
	fieldType: PropTypes.oneOf([
		"AddressProvince",
		"AddressDistrict",
		"Checkbox",
		"DatePicker",
		"WeekPicker",
		"RangePicker",
		"MonthPicker",
		"Input",
		"InputNumber",
		"InputPhone",
		"InputPassword",
		"TextArea",
		"Select",
		"Switch",
	]).isRequired,
	name: PropTypes.string.isRequired,
	validate: PropTypes.func.isRequired,
	label: PropTypes.string.isRequired,
	required: PropTypes.bool.isRequired,
	meta: PropTypes.object.isRequired,
	isFirst: PropTypes.bool.isRequired,
};

export default Field;
