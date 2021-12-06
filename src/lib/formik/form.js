import { Form, SubmitButton } from "formik-antd";
import { Formik } from "formik";
import PropTypes from "prop-types";
import { Row, Col, Divider, Steps } from "antd";
import { handleCascader, useSteps } from "./logic";
import React, { useMemo } from "react";
import SubmitLine from "./submit_line";
import { useMaxWidth } from "../shared/hook";
import _ from "lodash";
import InnerForm from "./inner-form";

const { Step } = Steps;

const CombinedForm = (props) => {
	const { onSubmit, inline, initialValues, steps } = props;
	const { resetButtonLabel, submitButtonLabel, schema } = props;
	const isSmall = useMaxWidth(575);

	const { formSpec, onSubmit2 } = useMemo(() => {
		const { formSpec, cascaderHook } = handleCascader(
			schema.formSpec,
			isSmall
		);
		const onSubmitHooks = [cascaderHook].concat(
			formSpec.map((a) => a?.meta?.onSubmitHook).filter((a) => !!a)
		);
		const onSubmit2 = async (postData, actions) => {
			postData = _.cloneDeep(postData);
			for (var hook of onSubmitHooks) postData = hook(postData);
			var names = schema.formSpec.map((a) => a.name);
			var ans = _.pick(
				postData,
				names.filter((a) => !/^\$|\.\$/.test(a))
			);
			names
				.filter((a) => /^\$|\.\$/.test(a))
				.forEach((a) => _.unset(postData, a));
			await onSubmit(ans, actions, postData);
		};
		return { formSpec, onSubmit2 };
	}, [schema, onSubmit, isSmall]);

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

					<Row gutter={8} justify={inline ? "center" : undefined}>
						<InnerForm
							formSpec={formSpec}
							currentStep={currentStep}
							inline={inline}
						/>
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
