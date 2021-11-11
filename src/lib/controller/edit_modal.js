import PropTypes from "prop-types";
import { Modal, Alert } from "antd";
import Form from "../formik/form";
import Header from "./header";
import React from "react";

const EditModal = (props) => {
	const { visible, onClose, isEdit, schema, onSubmit, steps } = props;
	const { createHeader, editHeader, error, initialValue } = props;

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
			{error && (
				<Alert
					message={error.message || error}
					type="error"
					showIcon
					style={{ margin: 30, marginBottom: 20, marginTop: -10 }}
				/>
			)}
			<Form
				initialValues={initialValue}
				schema={schema}
				onSubmit={onSubmit}
				steps={steps}
			/>
		</Modal>
	);
};

EditModal.propTypes = {
	isEdit: PropTypes.bool.isRequired,
	visible: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	schema: PropTypes.object.isRequired,
	steps: PropTypes.array.isRequired,
	editHeader: PropTypes.string,
	createHeader: PropTypes.string,
	error: PropTypes.instanceOf(Error),
	initialValue: PropTypes.object,
};

EditModal.defaultProps = {
	createHeader: "เพิ่มข้อมูลใหม่",
	editHeader: "แก้ไขข้อมูล",
	error: null,
	initialValue: undefined,
};

export default EditModal;
