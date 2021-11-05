import { Button, Space, Dropdown, Menu } from "antd";
import {
	DeleteOutlined,
	PlusOutlined,
	DownloadOutlined,
	UploadOutlined,
	EyeOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import { useCallback } from "react";

const TableAction = (props) => {
	const { deleteButtonLabel, createButtonLabel, selectedRows } = props;
	const { onCreate, onDelete, setSelectedRows } = props;

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
				{!selectedRows.length && onCreate && (
					<Button
						type="primary"
						onClick={onCreate}
						icon={<PlusOutlined />}
					>
						{createButtonLabel}
					</Button>
				)}
				<Dropdown overlay={<MyMenu />} placement="bottomRight">
					<Button>เมนูอื่นๆ</Button>
				</Dropdown>
			</Space>
		</div>
	);
};

TableAction.propTypes = {
	selectedRows: PropTypes.array.isRequired,
	setSelectedRows: PropTypes.func.isRequired,
	createButtonLabel: PropTypes.string,
	deleteButtonLabel: PropTypes.string,
	onCreate: PropTypes.func,
	onDelete: PropTypes.func,
};
TableAction.defaultProps = {
	createButtonLabel: "สร้าง",
	deleteButtonLabel: "ลบ",
	onCreate: null,
	onDelete: null,
};

const MyMenu = (props) => {
	return (
		<Menu>
			<Menu.Item>
				<Space>
					<DownloadOutlined />
					<a
						target="_blank"
						href="https://www.antgroup.com"
						rel="noreferrer"
					>
						ดาวน์โหลด Excel
					</a>
				</Space>
			</Menu.Item>
			<Menu.Item>
				<Space>
					<UploadOutlined />
					<a
						target="_blank"
						href="https://www.aliyun.com"
						rel="noreferrer"
					>
						อัพโหลด Excel
					</a>
				</Space>
			</Menu.Item>
			<Menu.Item>
				<Space>
					<EyeOutlined />
					<a
						target="_blank"
						href="https://www.aliyun.com"
						rel="noreferrer"
					>
						ตัวอย่าง Excel อัพโหลด
					</a>
				</Space>
			</Menu.Item>
		</Menu>
	);
};

export default TableAction;
