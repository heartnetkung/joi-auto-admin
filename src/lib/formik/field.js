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
import Cascader from "./components/cascader";
import Barcode from "./components/barcode";
import moment from "moment";
import React from "react";
import { useFormikContext } from "formik";
import { Col } from "antd";

const { WeekPicker, RangePicker, MonthPicker } = DatePicker;

const Field = (props) => {
	const { fieldType, label, required, name, validate, meta } = props;
	const { labelCol, wrapperCol, colSpan, offset, className } = props;
	const { fieldHide, currentStep, containerStyle } = props;

	const props2 = { ...meta, name };
	const { values } = useFormikContext();

	if (typeof fieldHide === "function") {
		if (fieldHide(values, currentStep)) return null;
	} else if (fieldHide) return null;

	return (
		<Col
			span={colSpan || 24}
			offset={offset}
			className={className}
			style={containerStyle}
		>
			<Form.Item
				label={label}
				required={required}
				name={name}
				validate={validate}
				labelCol={labelCol}
				wrapperCol={wrapperCol}
			>
				{fieldType === "Barcode" && <Barcode {...props2} />}
				{fieldType === "Cascader" && <Cascader {...props2} />}
				{fieldType === "Checkbox" && <Checkbox {...props2}></Checkbox>}
				{fieldType === "DatePicker" && (
					<DatePicker
						{...props2}
						defaultValue={
							props2.defaultValue && moment(props2.defaultValue)
						}
						style={{ width: "100%" }}
					/>
				)}
				{fieldType === "WeekPicker" && <WeekPicker {...props2} />}
				{fieldType === "RangePicker" && <RangePicker {...props2} />}
				{fieldType === "MonthPicker" && <MonthPicker {...props2} />}
				{fieldType === "Input" && <Input {...props2} />}
				{fieldType === "InputEmail" && (
					<Input {...props2} type="email" />
				)}
				{fieldType === "InputNumber" && (
					<InputNumber {...props2} style={{ width: "100%" }} />
				)}
				{fieldType === "InputURL" && (
					<Input {...props2} type="url" />
				)}
				{fieldType === "InputPhone" && (
					<Input placeholder="ไม่ต้องใส่ขีด" {...props2} type="tel" />
				)}
				{fieldType === "InputPassword" && (
					<Input.Password {...props2} />
				)}
				{fieldType === "TextArea" && <Input.TextArea {...props2} />}
				{fieldType === "Select" && (
					<Select {...props2} style={{ textAlign: "left" }}>
						{props2.valid &&
							Object.entries(props2.valid).map(([k, v]) => (
								<Select.Option key={k} value={k}>
									{v}
								</Select.Option>
							))}
					</Select>
				)}
				{fieldType === "Switch" && <Switch {...props2} />}
			</Form.Item>
		</Col>
	);
};

Field.propTypes = {
	fieldType: PropTypes.oneOf([
		"Barcode",
		"Cascader",
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
	currentStep: PropTypes.number.isRequired,
	colSpan: PropTypes.number,
	offset: PropTypes.number,
	labelCol: PropTypes.object,
	wrapperCol: PropTypes.object,
	fieldHide: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
	className: PropTypes.string,
	containerStyle: PropTypes.object,
};
Field.defaultProps = {
	labelCol: undefined,
	wrapperCol: undefined,
	fieldHide: undefined,
	colSpan: undefined,
	offset: undefined,
	className: undefined,
	containerStyle: undefined,
};

export default Field;
