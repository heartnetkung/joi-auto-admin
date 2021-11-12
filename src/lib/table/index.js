import { Table, Row } from "antd";
import { useState, useMemo } from "react";
import { EditOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import RowMenu from "./row_menu";
import TableMenu from "./table_menu";
import { addFilter } from "./logic";
import OtherMenu from "./other_menu";
import { useMaxWidth } from "../shared/hook";
import React from "react";

const TableComp = (props) => {
	const { data, schema, rowButtons, onEdit, paginationSize } = props;
	const { onDelete, onCreate, tableScroll } = props;
	const { loading, onDownloadExcel, onUploadExcel, onExampleExcel } = props;

	const [selectedRows, setSelectedRows] = useState([]);

	const columns = useMemo(() => {
		var ans = schema.columns
			.map(addFilter(data))
			.filter((column) => !column.cellHide);

		var rowButtons2 = [...rowButtons];
		if (onEdit)
			rowButtons2.unshift({ icon: <EditOutlined />, onClick: onEdit });

		if (rowButtons2.length) {
			const render = (text, record) => (
				<RowMenu buttons={rowButtons2} record={record} />
			);
			const width = 60 * rowButtons2.length + 20;
			ans.push({ title: "เมนู", width, render });
		}

		return ans;
	}, [schema, data, rowButtons, onEdit]);

	const rowSelection = !!onDelete && {
		selectedRowKeys: selectedRows,
		onChange: setSelectedRows,
	};

	const smallScreen = useMaxWidth(575);
	const tableScroll2 = smallScreen ? { x: true, y: true } : tableScroll;
	const tableStyle = smallScreen
		? undefined
		: { minWidth: Math.min(columns.length * 130, 800) };

	return (
		<>
			<div style={{ opacity: loading ? 0.5 : 1 }}>
				<TableMenu
					selectedRows={selectedRows}
					setSelectedRows={setSelectedRows}
					onDelete={onDelete}
					onCreate={onCreate}
					otherMenu={
						!onDownloadExcel &&
						!onUploadExcel &&
						!onExampleExcel ? null : (
							<OtherMenu
								onDownloadExcel={onDownloadExcel}
								onUploadExcel={onUploadExcel}
								onExampleExcel={onExampleExcel}
							/>
						)
					}
				/>
			</div>
			<Row>
				<Table
					loading={loading}
					columns={columns}
					dataSource={data}
					pagination={{ defaultPageSize: paginationSize }}
					scroll={tableScroll2}
					rowSelection={rowSelection}
					rowKey="_id"
					style={tableStyle}
				/>
			</Row>
		</>
	);
};

TableComp.propTypes = {
	rowButtons: PropTypes.array,
	onCreate: PropTypes.func,
	onDelete: PropTypes.func,
	onEdit: PropTypes.func,
	schema: PropTypes.object.isRequired,
	paginationSize: PropTypes.number,
	tableScroll: PropTypes.object,
	loading: PropTypes.bool,
	onDownloadExcel: PropTypes.func,
	onUploadExcel: PropTypes.func,
	onExampleExcel: PropTypes.func,
};

TableComp.defaultProps = {
	rowButtons: [],
	onDelete: null,
	onCreate: null,
	onEdit: null,
	paginationSize: 20,
	tableScroll: { y: 600, x: true },
	loading: false,
	onDownloadExcel: null,
	onUploadExcel: null,
	onExampleExcel: null,
};

export default TableComp;
