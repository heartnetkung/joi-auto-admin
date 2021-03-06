import {
	DownloadOutlined,
	UploadOutlined,
	EyeOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import { Menu, Button } from "antd";
import FileUpload from "../shared/file_upload";
import React from 'react';

const OtherMenu = (props) => {
	const { onDownloadExcel, onUploadExcel, onExampleExcel } = props;
	const { downloadExcelLabel, uploadExcelLabel, exampleExcelLabel } = props;

	return (
		<Menu>
			{onDownloadExcel && (
				<Menu.Item key="1">
					<Button
						type="text"
						onClick={onDownloadExcel}
						icon={<DownloadOutlined />}
						block
						style={{ textAlign: "left" }}
					>
						{downloadExcelLabel}
					</Button>
				</Menu.Item>
			)}
			{onUploadExcel && (
				<Menu.Item key="2">
					<FileUpload
						type="text"
						handleFile={onUploadExcel}
						icon={<UploadOutlined />}
						accept=".xlsx"
						block
						style={{ textAlign: "left" }}
					>
						{uploadExcelLabel}
					</FileUpload>
				</Menu.Item>
			)}
			{onExampleExcel && (
				<Menu.Item key="3">
					<Button
						type="text"
						onClick={onExampleExcel}
						icon={<EyeOutlined />}
						block
						style={{ textAlign: "left" }}
					>
						{exampleExcelLabel}
					</Button>
				</Menu.Item>
			)}
		</Menu>
	);
};
OtherMenu.propTypes = {
	onDownloadExcel: PropTypes.func,
	onUploadExcel: PropTypes.func,
	onExampleExcel: PropTypes.func,
	downloadExcelLabel: PropTypes.string,
	uploadExcelLabel: PropTypes.string,
	exampleExcelLabel: PropTypes.string,
};
OtherMenu.defaultProps = {
	onDownloadExcel: null,
	onUploadExcel: null,
	onExampleExcel: null,
	downloadExcelLabel: "ดาวน์โหลด Excel",
	uploadExcelLabel: "อัพโหลด Excel",
	exampleExcelLabel: "ตัวอย่าง Excel อัพโหลด",
};

export default OtherMenu;
