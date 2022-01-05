import { Button, Space, Dropdown } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useCallback } from "react";
import React from "react";

const TableMenu = (props) => {
	const { deleteButtonLabel, createButtonLabel, selectedRows } = props;
	const { onCreate, onDelete, setSelectedRows, otherMenu } = props;
	const { tableButtons, updateDataAtRow, data } = props;

	const onDelete2 = useCallback(async () => {
		await onDelete(selectedRows);
		setSelectedRows([]);
	}, [selectedRows, onDelete, setSelectedRows]);

	return (
		<div style={{ textAlign: "right", margin: 10 }}>
			<Space>
				{!!selectedRows.length && onDelete && (
					<Button
						type="danger"
						onClick={onDelete2}
						icon={<DeleteOutlined />}
					>
						{deleteButtonLabel}
					</Button>
				)}
				{!!selectedRows.length &&
					tableButtons.map((a, i) => (
						<Button
							{...a}
							key={i + ""}
							onClick={() => {
								a.onClick(
									lookupSelectedRow(selectedRows, data),
									updateDataAtRow
								);
								setSelectedRows([]);
							}}
						>
							{a.label}
						</Button>
					))}
				{!selectedRows.length && onCreate && (
					<Button
						type="primary"
						onClick={onCreate}
						icon={<PlusOutlined />}
					>
						{createButtonLabel}
					</Button>
				)}
				{otherMenu && (
					<Dropdown overlay={otherMenu} placement="bottomRight">
						<Button>เมนูอื่นๆ</Button>
					</Dropdown>
				)}
			</Space>
		</div>
	);
};

const lookupSelectedRow = (selectedRows, data) => {
	const selectedSet = new Set(selectedRows);
	return data.filter((a) => selectedSet.has(a._id));
};

TableMenu.propTypes = {
	selectedRows: PropTypes.array.isRequired,
	setSelectedRows: PropTypes.func.isRequired,
	createButtonLabel: PropTypes.string,
	deleteButtonLabel: PropTypes.string,
	otherMenu: PropTypes.node,
	onCreate: PropTypes.func,
	onDelete: PropTypes.func,
	tableButtons: PropTypes.array.isRequired,
	updateDataAtRow: PropTypes.func.isRequired,
	data: PropTypes.array,
};
TableMenu.defaultProps = {
	createButtonLabel: "สร้าง",
	deleteButtonLabel: "ลบ",
	onCreate: null,
	onDelete: null,
	otherMenu: null,
	data: [],
};

export default TableMenu;
