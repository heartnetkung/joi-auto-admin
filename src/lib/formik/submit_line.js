import React from "react";
import { SubmitButton, ResetButton } from "formik-antd";
import { useFormikContext } from "formik";
import PropTypes from "prop-types";
import { Space, Button } from "antd";
import { useRef } from "react";
import { touchAll, touchFirstSubmit } from "./logic";

const SubmitLine = (props) => {
	const { steps, currentStep, prevStep, nextStep } = props;
	const { submitButtonLabel, resetButtonLabel } = props;

	const context = useFormikContext();
	const touch = useRef({ executed: false });
	const submitStyle =
		steps.length - 1 <= currentStep ? undefined : { display: "none" };

	const next = async () => {
		const success = await touchAll(context);
		if (success) nextStep();
	};

	touchFirstSubmit(context, touch);

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
				<SubmitButton
					type="primary"
					style={submitStyle}
					disabled={false}
				>
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
