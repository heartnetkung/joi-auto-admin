import PropTypes from "prop-types";
import * as Raw from "formik-antd";
import Barcode from "./components/barcode";
import CascaderStatic from "./components/cascader_static";
import CascaderAsync from "./components/cascader_async";
import FileUpload from "./components/file_upload";
import moment from "moment";
import React from "react";
import { Col, Divider } from "antd";

const { WeekPicker, MonthPicker } = Raw.DatePicker;

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
				<Raw.Form.Item
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
					{fieldType === "CascaderAsync" && (
						<CascaderAsync {...props2} />
					)}
					{fieldType === "CascaderStatic" && (
						<CascaderStatic {...props2} />
					)}
					{fieldType === "Checkbox" && <Raw.Checkbox {...props2} />}
					{fieldType === "DatePicker" && (
						<Raw.DatePicker
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
					{fieldType === "Input" && <Raw.Input {...props2} />}
					{fieldType === "InputEmail" && (
						<Raw.Input {...props2} type="email" />
					)}
					{fieldType === "InputNumber" && (
						<Raw.InputNumber
							{...props2}
							style={{ ...props2.style, width: "100%" }}
						/>
					)}
					{fieldType === "InputURL" && (
						<Raw.Input {...props2} type="url" />
					)}
					{fieldType === "InputPhone" && (
						<Raw.Input
							placeholder="เช่น 0811111111"
							{...props2}
							type="tel"
						/>
					)}
					{fieldType === "InputPassword" && (
						<Raw.Input.Password {...props2} />
					)}
					{fieldType === "TextArea" && (
						<Raw.Input.TextArea {...props2} />
					)}
					{fieldType === "Select" && (
						<Raw.Select
							placeholder="เลือก"
							{...props2}
							style={{ ...props2.style, textAlign: "left" }}
						>
							{props2.valid &&
								Object.entries(props2.valid).map(([k, v]) => (
									<Raw.Select.Option key={k} value={k}>
										{v}
									</Raw.Select.Option>
								))}
						</Raw.Select>
					)}
					{fieldType === "Switch" && <Raw.Switch {...props2} />}
					{fieldType === "FileUpload" && (
						<FileUpload {...props2} dataType={type} />
					)}
				</Raw.Form.Item>
			</Col>
			{appendDivider && (
				<Col span={20} offset={2}>
					<Divider style={{ marginBottom: 40, marginTop: 14 }} />{" "}
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
