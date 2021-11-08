import { Form, SubmitButton, ResetButton } from "formik-antd";
import { Formik } from "formik";
import PropTypes from "prop-types";
import { Space, Row, Col, Divider } from "antd";
import Field from "./field";
import { calculateSpan } from "./logic";

const CombinedForm = (props) => {
	const { onSubmit, inline, initialValues } = props;
	const { resetButtonLabel, submitButtonLabel, schema } = props;
	const formSpec = calculateSpan(schema.formSpec, inline);

	return (
		<Formik
			initialValues={initialValues || schema.toDefaultValues()}
			onSubmit={onSubmit}
		>
			{() => (
				<Form
					labelCol={{ span: 4 }}
					wrapperCol={{ span: 18 }}
					colon={!inline}
				>
					<Row gutter={8} justify={inline ? "center" : undefined}>
						{formSpec.map((a, i) => (
							<Col
								key={a.name}
								span={a.colSpan || 24}
								offset={a.offset}
							>
								<Field {...a} isFirst={i === 0} />
							</Col>
						))}
						{inline && (
							<Col span={4}>
								<SubmitButton
									type="primary"
									style={{ marginBottom: 24 }}
								>
									{submitButtonLabel}
								</SubmitButton>
							</Col>
						)}
					</Row>
					{inline && <Divider style={{ marginTop: 10 }} />}
					{!inline && (
						<center>
							<Space>
								<ResetButton>{resetButtonLabel}</ResetButton>
								<SubmitButton type="primary">
									{submitButtonLabel}
								</SubmitButton>
							</Space>
						</center>
					)}
				</Form>
			)}
		</Formik>
	);
};

CombinedForm.propTypes = {
	initialValues: PropTypes.any,
	onSubmit: PropTypes.func.isRequired,
	resetButtonLabel: PropTypes.string,
	submitButtonLabel: PropTypes.string,
	schema: PropTypes.object,
	inline: PropTypes.bool,
};

CombinedForm.defaultProps = {
	initialValues: null,
	resetButtonLabel: "ล้างค่า",
	submitButtonLabel: "ยืนยัน",
	schema: null,
	inline: false,
};

export default CombinedForm;
