import { Table, Row } from "antd";
import { useState, useMemo } from "react";
import _ from "lodash";
import { EditOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import RowMenu from "./row_menu";
import TableMenu from "./table_menu";
import { sorter, onFilter, formatColumn } from "./logic";
import OtherMenu from "./other_menu";

const TableComp = (props) => {
	const { data, schema, actions, onEdit, paginationSize } = props;
	const { onDelete, onCreate, tableScroll } = props;
	const { loading, onDownloadExcel, onUploadExcel, onExampleExcel } = props;

	const [selectedRows, setSelectedRows] = useState([]);

	const columns = useMemo(() => {
		var ans2 = schema
			.toColumns()
			.map(formatColumn)
			.map((column) => {
				var filters = _.chain(data)
					.map(column.dataIndex.join("."))
					.map(column.render || _.identity)
					.uniq()
					.sortBy()
					.map((a) => ({ text: a, value: a }))
					.value();
				var ans = { ...column };
				ans.sorter = sorter.bind(ans);
				if (filters.length < 50) {
					ans.onFilter = onFilter.bind(ans);
					ans.filters = filters;
				}
				return ans;
			});

		var actions2 = [...actions];
		if (onEdit) actions2.push({ icon: <EditOutlined />, onClick: onEdit });

		if (actions2.length) {
			const render = (text, record) => (
				<RowMenu actions={actions2} record={record} />
			);
			const width = 60 * actions2.length + 30;
			ans2.push({ title: "เมนู", width, render });
		}

		return ans2;
	}, [schema, data, actions, onEdit]);

	const rowSelection = !!onDelete && {
		selectedRowKeys: selectedRows,
		onChange: setSelectedRows,
	};

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
					scroll={tableScroll}
					rowSelection={rowSelection}
					rowKey="_id"
				/>
			</Row>
		</>
	);
};

TableComp.propTypes = {
	actions: PropTypes.array,
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
	actions: [],
	onDelete: null,
	onCreate: null,
	onEdit: null,
	paginationSize: 20,
	tableScroll: { y: 600 },
	loading: false,
	onDownloadExcel: null,
	onUploadExcel: null,
	onExampleExcel: null,
};

export default TableComp;
