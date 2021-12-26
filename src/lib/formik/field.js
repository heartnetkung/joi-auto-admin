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
import Barcode from "./components/barcode";
import CascaderStatic from "./components/cascader_static";
import CascaderAsync from "./components/cascader_async";
import FileUpload from "./components/file_upload";
import moment from "moment";
import React from "react";
import { Col, Divider } from "antd";

const { WeekPicker, MonthPicker } = DatePicker;

const Field = (props) => {
	const { fieldType, label, required, name, validate, meta } = props;
	const { labelCol, wrapperCol, colSpan, offset, className } = props;
	const { containerStyle, onFieldRender, type, appendDivider } = props;
	const props2 = { ...meta, name };

	return (
		<>
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
					{fieldType === "Custom" &&
						onFieldRender &&
						onFieldRender(props2)}
					{fieldType === "Barcode" && (
						<Barcode
							placeholder="พิมพ์แล้วกด Enter เช่น a001"
							{...props2}
						/>
					)}
					{fieldType === "CascaderAsync" && <CascaderAsync {...props2} />}
					{fieldType === "CascaderStatic" && (
						<CascaderStatic {...props2} />
					)}
					{fieldType === "Checkbox" && <Checkbox {...props2} />}
					{fieldType === "DatePicker" && (
						<DatePicker
							placeholder="เลือกวันที่"
							{...props2}
							defaultValue={
								props2.defaultValue &&
								moment(props2.defaultValue)
							}
							style={{ ...props2.style, width: "100%" }}
						/>
					)}
					{fieldType === "WeekPicker" && <WeekPicker {...props2} />}
					{fieldType === "MonthPicker" && <MonthPicker {...props2} />}
					{fieldType === "Input" && <Input {...props2} />}
					{fieldType === "InputEmail" && (
						<Input {...props2} type="email" />
					)}
					{fieldType === "InputNumber" && (
						<InputNumber
							{...props2}
							style={{ ...props2.style, width: "100%" }}
						/>
					)}
					{fieldType === "InputURL" && (
						<Input {...props2} type="url" />
					)}
					{fieldType === "InputPhone" && (
						<Input
							placeholder="เช่น 0811111111"
							{...props2}
							type="tel"
						/>
					)}
					{fieldType === "InputPassword" && (
						<Input.Password {...props2} />
					)}
					{fieldType === "TextArea" && <Input.TextArea {...props2} />}
					{fieldType === "Select" && (
						<Select
							placeholder="เลือก"
							{...props2}
							style={{ ...props2.style, textAlign: "left" }}
						>
							{props2.valid &&
								Object.entries(props2.valid).map(([k, v]) => (
									<Select.Option key={k} value={k}>
										{v}
									</Select.Option>
								))}
						</Select>
					)}
					{fieldType === "Switch" && <Switch {...props2} />}
					{fieldType === "FileUpload" && (
						<FileUpload {...props2} dataType={type} />
					)}
				</Form.Item>
			</Col>
			{appendDivider && (
				<Col span={20} offset={2}>
					<Divider style={{ marginBottom: 48 }} />{" "}
				</Col>
			)}
		</>
	);
};

Field.propTypes = {
	fieldType: PropTypes.oneOf([
		"Barcode",
		"Checkbox",
		"DatePicker",
		"WeekPicker",
		"MonthPicker",
		"Input",
		"InputNumber",
		"InputPhone",
		"InputEmail",
		"InputURL",
		"InputPassword",
		"TextArea",
		"Select",
		"Switch",
		"FileUpload",
		"Custom",
		"CascaderStatic",
		"CascaderAsync",
	]).isRequired,
	name: PropTypes.string.isRequired,
	validate: PropTypes.func.isRequired,
	label: PropTypes.string.isRequired,
	required: PropTypes.bool.isRequired,
	meta: PropTypes.object.isRequired,
	colSpan: PropTypes.number,
	offset: PropTypes.number,
	labelCol: PropTypes.object,
	wrapperCol: PropTypes.object,
	className: PropTypes.string,
	containerStyle: PropTypes.object,
	onFieldRender: PropTypes.func,
	appendDivider: PropTypes.bool,
};
Field.defaultProps = {
	labelCol: undefined,
	wrapperCol: undefined,
	colSpan: undefined,
	offset: undefined,
	className: undefined,
	containerStyle: undefined,
	onFieldRender: undefined,
	appendDivider: false,
};

export default Field;
