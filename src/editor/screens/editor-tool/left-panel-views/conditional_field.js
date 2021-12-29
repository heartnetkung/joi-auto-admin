import React, { useMemo } from "react";
import { PlusOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Row, Col, Select, Button } from "antd";
import { lookupLabel } from "../../../logic/lookup_label";

const ConditionalField = (props) => {
	const { formState, setSettingState, settingState } = props;

	const lines = settingState.cfLine || [makeLine([])];
	const setLines = (cfLine) => setSettingState({ ...settingState, cfLine });
	const addLine = () => setLines([...lines, makeLine(lines)]);
	const removeLine = (index) => () => {
		var newLines = [...lines];
		newLines.splice(index, 1);
		if (!newLines.length)
			setSettingState({ ...settingState, conditionalField: false });
		setLines(newLines);
	};
	const editLine = (index, field) => (value) => {
		var newLines = [...lines];
		var newValue = { ...lines[index], [field]: value };
		newLines.splice(index, 1, newValue);
		setLines(newLines);
	};

	const { dropdowns, fields } = useMemo(
		() => ({
			dropdowns: formState
				.filter((a) => a.fieldType === "dropdown")
				.map((a) => ({ label: lookupLabel(a), value: a._id })),
			fields: formState.map((a) => ({
				label: lookupLabel(a),
				value: a._id,
			})),
		}),
		[formState]
	);

	return (
		<>
			{lines.map((a, i) => (
				<Row gutter={8} key={a._id} style={{ marginTop: 20 }}>
					<Col span={1}>
						<Button
							icon={
								<CloseCircleOutlined
									style={{ color: "#ccc" }}
								/>
							}
							type="text"
							onClick={removeLine(i)}
						/>
					</Col>
					<Col span={7} offset={1}>
						<Select
							style={{ width: "100%" }}
							size={1}
							placeholder="When dropdown..."
							options={dropdowns}
							value={a.dropdown}
							onChange={editLine(i, "dropdown")}
							dropdownRender={dropdownRender(
								"Dropdown field needed."
							)}
						/>
					</Col>
					<Col span={7}>
						<Select
							options={OPTIONS}
							style={{ width: "100%" }}
							size={1}
							placeholder="equals..."
							value={a.equal}
							onChange={editLine(i, "equal")}
						/>
					</Col>
					<Col span={7}>
						<Select
							options={fields.filter(filterField(a, lines))}
							style={{ width: "100%" }}
							size={1}
							placeholder="Show this field"
							value={a.field}
							onChange={editLine(i, "field")}
							dropdownRender={dropdownRender("All fields used.")}
						/>
					</Col>
				</Row>
			))}
			<Button
				block
				type="primary"
				icon={<PlusOutlined />}
				style={{ marginTop: 30 }}
				onClick={addLine}
			>
				Add ConditionalField
			</Button>
		</>
	);
};

const makeLine = (allLines) => {
	var _id = Math.floor(Math.random() * 10000);
	if (!allLines.length) return { _id };
	return { ...allLines[allLines.length - 1], field: null, _id };
};

const filterField = (current, lines) => (c) =>
	!lines.find((b) => c.value === b.field && b.field !== current.field);

const dropdownRender = (notFoundText) => (a) => {
	if (a.props.options.length) return a;
	return (
		<>
			{a}
			<center style={{ marginTop: -15, marginBottom: 10 }}>
				{notFoundText}
			</center>
		</>
	);
};

const OPTIONS = [
	{ value: "pizza", label: "Pizza" },
	{ value: "steak", label: "Steak" },
	{ value: "sushi", label: "Sushi" },
	{ value: "hamburger", label: "Hamburger" },
	{ value: "noodles", label: "Noodles" },
];

export default ConditionalField;
