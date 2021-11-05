import { Table, Row } from "antd";
import { useState, useMemo } from "react";
import _ from "lodash";
import { EditOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import RowAction from "./row_action";
import TableAction from "./table_action";
import { sorter, onFilter, formatColumn } from "./logic";

const TableComp = (props) => {
	const { data, schema, actions, onEdit, paginationSize } = props;
	const { onDelete, onCreate, customization, tableScroll } = props;
	const { loading } = props;

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
				<RowAction
					{...customization}
					actions={actions2}
					record={record}
				/>
			);
			const width = 60 * actions2.length + 30;
			ans2.push({ title: "เมนู", width, render });
		}

		return ans2;
	}, [schema, data, actions, onEdit, customization]);

	const rowSelection = !!onDelete && {
		selectedRowKeys: selectedRows,
		onChange: setSelectedRows,
	};

	return (
		<>
			<div style={{ opacity: loading ? 0.5 : 1 }}>
				<TableAction
					{...customization}
					selectedRows={selectedRows}
					setSelectedRows={setSelectedRows}
					onDelete={onDelete}
					onCreate={onCreate}
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
	customization: PropTypes.object,
	loading: PropTypes.bool,
};

TableComp.defaultProps = {
	actions: [],
	onDelete: null,
	onCreate: null,
	onEdit: null,
	paginationSize: 20,
	tableScroll: { y: 600 },
	customization: {},
	loading: false,
};

export default TableComp;
