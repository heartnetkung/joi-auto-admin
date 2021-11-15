import PropTypes from "prop-types";
import React from "react";
import EditModal from "./edit_modal";
import { useState } from "react";
import ReactDOM from "react-dom";
import Joi from "joi/lib/index";
import { JoiWrapper } from "../joi/joi_wrapper";
import { alert } from "./util";

export const openFormModal = (props) => {
	if (!props.schema) throw new Error("schema required");
	const div = document.createElement("div");

	const onClose = () => {
		const unmountResult = ReactDOM.unmountComponentAtNode(div);
		if (unmountResult && div.parentNode) div.parentNode.removeChild(div);
	};

	document.body.appendChild(div);
	const props2 = { ...props, onClose, schema: new JoiWrapper(props.schema) };
	setTimeout(() => ReactDOM.render(<FormModal {...props2} />, div));
};

const FormModal = (props) => {
	const { onClose, schema, title, onSubmit, steps } = props;
	const [error, setError] = useState(null);

	const onSubmit2 = async (data, actions) => {
		setError(null);
		try {
			data = Joi.attempt(data, schema.joiObj);
			await onSubmit(data);
			alert.success("แก้ไขข้อมูลเรียบร้อย");
			onClose();
		} catch (e) {
			setError(e);
			actions.setSubmitting(false);
		}
	};

	return (
		<EditModal
			isEdit={false}
			visible={true}
			onClose={onClose}
			schema={schema}
			steps={steps}
			createHeader={title}
			error={error}
			onSubmit={onSubmit2}
		/>
	);
};

FormModal.propTypes = {
	onClose: PropTypes.func.isRequired,
	schema: PropTypes.object.isRequired,
	onSubmit: PropTypes.func.isRequired,
	title: PropTypes.string,
	steps: PropTypes.array,
};

FormModal.defaultProps = {
	steps: [],
	title: null,
};
