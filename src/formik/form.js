import { Form, SubmitButton, ResetButton } from "formik-antd";
import { Formik } from "formik";
import PropTypes from "prop-types";
import { Space, Row, Col } from "antd";
import Field from "./field";
import { calculateSpan } from "./logic";

const CombinedForm = (props) => {
	const { initialValues, canReset, onSubmit } = props;
	const { resetButtonLabel, submitButtonLabel, schema } = props;

	const formSpec = calculateSpan(schema.formSpec);

	return (
		<Formik initialValues={initialValues} onSubmit={onSubmit}>
			{() => (
				<Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
					<Row>
						{formSpec.map((a, i) => (
							<Col key={a.name} span={a.colSpan || 24}>
								<Field {...a} isFirst={i === 0} />
							</Col>
						))}
					</Row>
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
