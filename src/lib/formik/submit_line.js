import React from "react";
import { SubmitButton, ResetButton } from "formik-antd";
import { useFormikContext, setNestedObjectValues } from "formik";
import PropTypes from "prop-types";
import { Space, Button } from "antd";

const SubmitLine = (props) => {
	const { steps, currentStep, prevStep, nextStep } = props;
	const { submitButtonLabel, resetButtonLabel } = props;

	const context = useFormikContext();
	const submitStyle =
		steps.length - 1 <= currentStep ? undefined : { display: "none" };

	const next = async () => {
		const errors = await context.validateForm();
		if (Object.keys(errors).length === 0) nextStep();
		else context.setTouched(setNestedObjectValues(errors, true));
	};

	return (
		<center style={steps.length ? { marginTop: 10 } : null}>
			<Space>
				{steps.length && currentStep ? (
					<Button onClick={prevStep}>ย้อนกลับ</Button>
				) : null}
				{steps.length && steps.length - 1 > currentStep ? (
					<Button type="primary" onClick={next}>
						ถ้ดไป
					</Button>
				) : null}
				{!steps.length ? (
					<ResetButton>{resetButtonLabel}</ResetButton>
				) : null}
				<SubmitButton type="primary" style={submitStyle}>
					{submitButtonLabel}
				</SubmitButton>
			</Space>
		</center>
	);
};

SubmitLine.propTypes = {
	currentStep: PropTypes.number.isRequired,
	prevStep: PropTypes.func.isRequired,
	nextStep: PropTypes.func.isRequired,
	steps: PropTypes.array.isRequired,
	resetButtonLabel: PropTypes.string,
	submitButtonLabel: PropTypes.string,
};

SubmitLine.defaultProps = {
	resetButtonLabel: "ล้างค่า",
	submitButtonLabel: "ยืนยัน",
};

export default SubmitLine;
