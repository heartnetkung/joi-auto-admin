import PropTypes from "prop-types";
import { Input } from "formik-antd";
import { useState, useEffect, useRef, memo } from "react";
import _ from "lodash";
import React from "react";
import { Typography, Divider, Col, Row, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { FieldArray } from "formik";
import { usePersistFn } from "../../shared/hook";

const OMIT_FIELDS = ["loadBarcodeName"];
const { Text } = Typography;

const Barcode = (props) => {
	const { loadBarcodeName, name } = props;

	const props2 = _.omit(props, OMIT_FIELDS);
	const [barcodes, setBarcodes] = useState([]);
	const [inputValue, setInputValue] = useState("");
	const ref = useRef(null);

	const onKeyDown = usePersistFn(async (event) => {
		if (event.key !== "Enter") return;
		if (ref.current) ref.current.push(inputValue);
		setBarcodes((a) => [...a, { inputValue, _id: Math.random() }]);
		setInputValue("");
		event.preventDefault();
	});

	const remove = usePersistFn((index) => {
		if (ref.current) ref.current.remove(index);
		setBarcodes((a) => a.filter((a, i) => i !== index));
	});

	const render = usePersistFn((helpers) => {
		ref.current = helpers;
		return (
			<>
				<Input
					{...props2}
					onKeyDown={onKeyDown}
					validator={null}
					name={"$" + name}
					value={inputValue}
					onChange={(event) => setInputValue(event.target.value)}
				/>
				<Divider />
				{barcodes.map((a, i) => (
					<BarcodeLine
						key={a._id}
						index={i}
						loadItemName={loadBarcodeName}
						name={name}
						remove={remove}
						value={a.inputValue}
					/>
				))}
			</>
		);
	});

	return <FieldArray name={name} render={render} />;
};

Barcode.propTypes = {
	loadBarcodeName: PropTypes.func.isRequired,
};

Barcode.defaultProps = {};

const BarcodeLine = memo((props) => {
	const { index, loadItemName, name, value, remove } = props;
	const [itemName, setItemName] = useState("");

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		loadItemName(value)
			.then((a) => setItemName(a || "ไม่พบข้อมูล"))
			.catch(() => setItemName("ไม่พบข้อมูล"));
	}, []);

	return (
		<>
			<Row>
				<Col span={8}>
					<Input
						disabled={true}
						size="small"
						style={{ marginBottom: 5 }}
						name={name + `[${index}]`}
					/>
				</Col>
				<Col span={8}>
					<Button
						icon={<CloseOutlined />}
						size="small"
						shape="circle"
						style={{ marginLeft: 20 }}
						onClick={() => remove(index)}
					/>
					<Text style={{ marginLeft: 20 }}>{itemName}</Text>
				</Col>
			</Row>
		</>
	);
});

export default Barcode;
