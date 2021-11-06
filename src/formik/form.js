import { Form, SubmitButton, ResetButton } from "formik-antd";
import { Formik } from "formik";
import PropTypes from "prop-types";
import { Space } from "antd";
import Field from "./field";

const CombinedForm = (props) => {
	const { initialValues, canReset, onSubmit } = props;
	const { resetButtonLabel, submitButtonLabel, schema } = props;

	return (
		<Formik initialValues={initialValues} onSubmit={onSubmit}>
			{() => (
				<Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
					{schema.formSpec.map((a, i) => (
						<Field key={a.name} {...a} isFirst={i === 0} />
					))}
					<center>
						<Space>
							{canReset && (
								<ResetButton>{resetButtonLabel}</ResetButton>
							)}
							<SubmitButton type="primary">
								{submitButtonLabel}
							</SubmitButton>
						</Space>
					</center>
				</Form>
			)}
		</Formik>
	);
};

CombinedForm.propTypes = {
	initialValues: PropTypes.any,
	canReset: PropTypes.bool,
	onSubmit: PropTypes.func.isRequired,
	resetButtonLabel: PropTypes.string,
	submitButtonLabel: PropTypes.string,
	schema: PropTypes.object,
};

CombinedForm.defaultProps = {
	initialValues: null,
	canReset: true,
	resetButtonLabel: "ล้างค่า",
	submitButtonLabel: "ยืนยัน",
	schema: null,
};

export default CombinedForm;
