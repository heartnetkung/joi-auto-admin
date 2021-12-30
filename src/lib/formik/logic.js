import { useState } from "react";
import { setNestedObjectValues } from "formik";

export const calculateSpan = (formSpec, isInline) => {
	if (isInline) return formSpec.map((a) => ({ ...a, colSpan: -1 }));

	var ans = [];
	var isPreviousLeft = false;
	for (var i = 0, ii = formSpec.length; i < ii; i++) {
		var current = formSpec[i];
		if (!current.twoColumn) {
			ans.push(current);
			isPreviousLeft = false;
		} else if (isPreviousLeft === false) {
			//left
			var hasNext = formSpec[i + 1]?.twoColumn;
			ans.push({
				...current,
				colSpan: hasNext ? 12 : 24,
				labelCol: hasNext ? { span: 8 } : { span: 4 },
				wrapperCol: hasNext ? { span: 14 } : { span: 7 },
			});
			isPreviousLeft = true;
		} else {
			//right
			ans.push({
				...current,
				colSpan: 12,
				labelCol: { span: 5 },
				wrapperCol: { span: 15 },
				className: "right-column-label",
			});
			isPreviousLeft = false;
		}
	}
	return ans;
};

export const useSteps = (steps) => {
	const [currentStep, setStep] = useState(steps.length ? 0 : -1);
	const nextStep = () =>
		currentStep < steps.length - 1 && setStep(currentStep + 1);
	const prevStep = () => currentStep > 0 && setStep(currentStep - 1);
	return { nextStep, prevStep, currentStep };
};

export const touchAll = async (context) => {
	const errors = await context.validateForm();
	if (Object.keys(errors).length === 0) return true;
	else context.setTouched(setNestedObjectValues(errors, true));
};

export const touchFirstSubmit = (context, ref) => {
	const { executed } = ref.current;
	if (!context.submitCount || executed) return;
	if (context.isValid || context.isSubmitting) return;

	ref.current.executed = true;
	setTimeout(() =>
		context.setTouched(setNestedObjectValues(context.errors, true))
	);
};
