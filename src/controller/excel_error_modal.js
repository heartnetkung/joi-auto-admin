import PropTypes from "prop-types";
import { Modal, Table } from "antd";
import Header from "./header";
import { ExclamationCircleFilled } from "@ant-design/icons";

const COLUMNS = [
	{ title: "บรรทัด", dataIndex: "line", width: 100 },
	{ title: "คอลัมน์", dataIndex: "label", width: 100 },
	{ title: "ปัญหาที่พบ", dataIndex: "message" },
].map((a) => ({ ...a, key: a.dataIndex }));

const ExcelErrorModal = (props) => {
	const { visible, onClose, errors, title } = props;

	const dataSource = errors.map((a, i) => ({ ...a, key: i }));

	return (
		<Modal
			centered
			visible={visible}
			width={600}
			footer={null}
			onCancel={onClose}
		>
			<Header title={title} icon={<ExclamationCircleFilled style={{color:'#faad14'}} />} small />
			<Table
				columns={COLUMNS}
				dataSource={dataSource}
				tableScroll={{ y: 600 }}
				pagination={false}
				size="small"
			/>
		</Modal>
	);
};

ExcelErrorModal.propTypes = {
	visible: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	errors: PropTypes.array,
	title: PropTypes.string,
};
ExcelErrorModal.defaultProps = {
	errors: [],
	title: "อัพโหลดไม่สำเร็จ",
};

export default ExcelErrorModal;
