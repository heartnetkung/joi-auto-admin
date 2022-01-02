import React, { useMemo, useRef } from "react";
import { Col, Row, Button, Divider } from "antd";
import { useFormikContext } from "formik";
import _ from "lodash";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { JoiWrapper } from "../joi/joi_wrapper";
import Field from "./field";
import PropTypes from "prop-types";

const FieldArray = (props) => {
	const { name, label, _extractedSchema, required } = props;
	const { containerStyle, appendDivider, meta } = props;
	const props2 = { ...meta, name };

	const { values, setFieldValue } = useFormikContext();
	const arrayValues = _.get(values, name) || [{}];
	const keys = useRef(null);
	keys.current = keys.current || arrayValues.map(() => Math.random() + "");

	const { formSpec, min, max } = useMemo(() => {
		var arraySchema = _extractedSchema?.$_terms?.items?.[0];
		if (!arraySchema) throw new Error("schema not found");
		return {
			formSpec: new JoiWrapper(arraySchema).formSpec,
			min: _extractedSchema?._singleRules?.get("min")?.args?.limit || 1,
			max: _extractedSchema?._singleRules?.get("max")?.args?.limit,
		};
	}, [_extractedSchema]);

	const addRow = () => {
		if (max && arrayValues.length >= max) return;
		const newValue = _.fromPairs(
			formSpec.map((a) => [a.name, a.defaultValue])
		);
		setFieldValue(name, [...arrayValues, newValue], false);
		keys.current.push(Math.random() + "");
	};
	const removeRow = (index) => {
		if (arrayValues.length <= min) return;
		keys.current = _.filter(keys.current, (a, i) => i !== index);
		var newValue = _.filter(arrayValues, (a, i) => i !== index);
		setFieldValue(name, newValue, false);
	};

	return (
		<>
			<Col span="24" style={{ marginBottom: 30, ...containerStyle }}>
				<Row gutter="8">
					<Col span="4" align="right">
						<span
							className={
								required
									? "field-array-span-required field-array-span"
									: "field-array-span"
							}
						>
							{label}
						</span>
					</Col>
					<Col span="18">
						{arrayValues.map((a, i) => (
							<Row key={keys.current[i]}>
								<Col span="20">
									<Row gutter="16">
										{formSpec.map((b) => (
											<Field
												{...b}
												name={`${name}[${i}].${b.name}`}
												key={b.name}
												label=""
												wrapperCol={{ span: 24 }}
												colSpan={12}
												offset={0}
												meta={{
													...b.meta,
													placeholder: b.label,
												}}
											/>
										))}
									</Row>
								</Col>
								<Col span="1" offset="1">
									<MinusCircleOutlined
										onClick={() => removeRow(i)}
										style={{ fontSize: 16, marginTop: 8 }}
									/>
								</Col>
							</Row>
						))}

						<Button
							type="dashed"
							onClick={addRow}
							block
							icon={<PlusOutlined />}
							{...props2}
						>
							เพิ่มแถว
						</Button>
					</Col>
				</Row>
			</Col>
			{appendDivider && (
				<Col span={20} offset={2}>
					<Divider style={{ marginBottom: 40, marginTop: 14 }} />{" "}
				</Col>
			)}
		</>
	);
};

FieldArray.propTypes = {
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	required: PropTypes.bool.isRequired,
	meta: PropTypes.object.isRequired,
	containerStyle: PropTypes.object,
	appendDivider: PropTypes.bool,
};
FieldArray.defaultProps = {
	containerStyle: undefined,
	appendDivider: false,
};

export default FieldArray;
