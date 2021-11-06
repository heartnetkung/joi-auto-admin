import PropTypes from "prop-types";
import { Modal } from "antd";
import Form from "../formik/form";
import Header from "./header";

const EditModal = (props) => {
	const { visible, onClose, isEdit, schema, initialValue, onSubmit } = props;
	const { createHeader, editHeader } = props;

	//need to unmount in order for initialValue and autoFocus to work
	if (!visible) return null;

	return (
		<Modal
			centered
			visible={visible}
			width={800}
			footer={null}
			onCancel={onClose}
			maskClosable={false}
		>
			<Header title={isEdit ? editHeader : createHeader} small />
			<Form
				schema={schema}
				initialValues={initialValue}
				onSubmit={onSubmit}
			/>
		</Modal>
	);
};

EditModal.propTypes = {
	isEdit: PropTypes.bool.isRequired,
	visible: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	schema: PropTypes.object.isRequired,
	initialValue: PropTypes.object.isRequired,
	editHeader: PropTypes.string,
	createHeader: PropTypes.string,
};

EditModal.defaultProps = {
	createHeader: "เพิ่มข้อมูลใหม่",
	editHeader: "แก้ไขข้อมูล",
};

export default EditModal;
