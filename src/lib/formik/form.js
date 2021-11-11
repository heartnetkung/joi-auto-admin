import { Form, SubmitButton, ResetButton } from "formik-antd";
import { Formik } from "formik";
import PropTypes from "prop-types";
import { Space, Row, Col, Divider, Steps, Button } from "antd";
import Field from "./field";
import { calculateSpan, handleCascader, useSteps } from "./logic";
import { useMemo } from "react";
import React from "react";

const { Step } = Steps;

const CombinedForm = (props) => {
	const { onSubmit, inline, initialValues, steps } = props;
	const { resetButtonLabel, submitButtonLabel, schema } = props;

	const { formSpec, onSubmit2 } = useMemo(() => {
		const formSpec2 = calculateSpan(schema.formSpec, inline);
		const { formSpec, cascaderHook } = handleCascader(formSpec2);
		const onSubmitHooks = formSpec
			.map((a) => a?.meta?.onSubmitHook)
			.filter((a) => !!a)
			.concat(cascaderHook);
		const onSubmit2 = (postData, actions) => {
			for (var hook of onSubmitHooks) postData = hook(postData);
			onSubmit(postData, actions);
		};
		return { formSpec, onSubmit2 };
	}, [schema, inline, onSubmit]);

	const { nextStep, prevStep, currentStep } = useSteps(steps);

	return (
		<Formik
			initialValues={initialValues || schema.toDefaultValues()}
			onSubmit={onSubmit2}
		>
			{() => (
				<Form
					labelCol={{ span: 4 }}
					wrapperCol={{ span: 18 }}
					colon={!inline}
				>
					{steps.length ? (
						<Row style={{ marginBottom: 40 }}>
							<Col offset={2} span={20}>
								<Steps size="small" current={currentStep}>
									{steps.map((a) => (
										<Step key={a} title={a} />
									))}
								</Steps>
							</Col>
						</Row>
					) : null}

					<Row gutter={8} justify={inline ? "center" : undefined}>
						{formSpec.map((a, i) => (
							<Field
								{...a}
								key={a.name}
								currentStep={currentStep}
							/>
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
						<center style={steps.length ? { marginTop: 10 } : null}>
							<Space>
								{steps.length && currentStep ? (
									<Button onClick={prevStep}>ย้อนกลับ</Button>
								) : null}
								{steps.length &&
								steps.length - 1 > currentStep ? (
									<Button type="primary" onClick={nextStep}>
										ถ้ดไป
									</Button>
								) : null}
								{!steps.length ? (
									<ResetButton>
										{resetButtonLabel}
									</ResetButton>
								) : null}
								{steps.length - 1 <= currentStep ? (
									<SubmitButton type="primary">
										{submitButtonLabel}
									</SubmitButton>
								) : null}
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
	steps: PropTypes.array,
};

CombinedForm.defaultProps = {
	initialValues: null,
	resetButtonLabel: "ล้างค่า",
	submitButtonLabel: "ยืนยัน",
	schema: null,
	inline: false,
	steps: [],
};

export default CombinedForm;
