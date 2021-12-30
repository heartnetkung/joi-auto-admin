import { Form, SubmitButton } from "formik-antd";
import { Formik } from "formik";
import PropTypes from "prop-types";
import { Row, Col, Divider, Steps } from "antd";
import { useSteps } from "./logic";
import React from "react";
import SubmitLine from "./submit_line";
import _ from "lodash";
import InnerForm from "./inner_form";
import { usePersistFn } from "../shared/hook";

const { Step } = Steps;

const CombinedForm = (props) => {
	const { onSubmit, inline, initialValues, steps } = props;
	const { resetButtonLabel, submitButtonLabel, schema } = props;
	const { nextStep, prevStep, currentStep } = useSteps(steps);

	const onSubmit2 = usePersistFn(async (postData, actions) => {
		var names = schema.formSpec.map((a) => a.name);
		var ans = _.pick(
			postData,
			names.filter((a) => !/^\$|\.\$/.test(a))
		);
		await onSubmit(ans, actions, postData);
	});

	const formProp = inline
		? {}
		: { labelCol: { span: 4 }, wrapperCol: { span: 18 }, colon: true };

	return (
		<Formik
			initialValues={initialValues || schema.toDefaultValues()}
			onSubmit={onSubmit2}
		>
			{() => (
				<Form {...formProp}>
					{steps.length ? (
						<Row style={{ marginBottom: 40, marginTop: 20 }}>
							<Col offset={2} span={20}>
								<Steps size="small" current={currentStep}>
									{steps.map((a) => (
										<Step key={a} title={a} />
									))}
								</Steps>
							</Col>
						</Row>
					) : null}

					<Row
						gutter={inline ? 20 : 8}
						justify={inline ? "center" : undefined}
					>
						<InnerForm
							formSpec={schema.formSpec}
							currentStep={currentStep}
							inline={inline}
						/>
						{inline && (
							<Col span={3}>
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
						<SubmitLine
							steps={steps}
							currentStep={currentStep}
							prevStep={prevStep}
							nextStep={nextStep}
							submitButtonLabel={submitButtonLabel}
							resetButtonLabel={resetButtonLabel}
						/>
					)}
				</Form>
			)}
		</Formik>
	);
};

CombinedForm.propTypes = {
	initialValues: PropTypes.any,
	onSubmit: PropTypes.func.isRequired,
	schema: PropTypes.object,
	inline: PropTypes.bool,
	steps: PropTypes.array,
};

CombinedForm.defaultProps = {
	initialValues: null,
	schema: null,
	inline: false,
	steps: [],
};

export default CombinedForm;
