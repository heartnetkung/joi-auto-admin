import _ from "lodash";
import { useState } from "react";
import { setNestedObjectValues } from "formik";
//TODO maybe code split this
import thAddress from "../assets/th-address";

export const calculateSpan = (formSpec, isInline) => {
	if (isInline) return formSpec.map((a) => ({ ...a, colSpan: 6 }));

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

const filter = function (inputValue, path) {
	return path.some(
		(option) =>
			option[this._labelField]
				.toLowerCase()
				.indexOf(inputValue.toLowerCase()) > -1
	);
};

const lookupOptionsEnum = (cascader) => {
	if (cascader.options === "th-address")
		return {
			...cascader,
			options: thAddress,
			fieldNames: { label: "l", value: "l", children: "c" },
		};
	return cascader;
};

export const handleCascader = (formSpec) => {
	var ans = [];
	var allCascader = {};
	var allSpecs = _.keyBy(formSpec, "label");

	for (var spec of formSpec) {
		ans.push(spec);

		var { cascader } = spec.meta;
		if (!cascader) continue;

		if (!allCascader[cascader.label]) {
			cascader = lookupOptionsEnum(cascader);
			var newCascader = (allCascader[cascader.label] = {
				fieldType: "Cascader",
				_labelField: cascader.fieldNames?.label || "label",
				meta: { ...cascader, showSearch: {} },
				name: cascader.label,
				label: cascader.label,
				targets: [spec, ...cascader.compLabels.map((a) => allSpecs[a])],
				required: !!cascader.required,
				validate: _.noop,
			});
			newCascader.meta.showSearch.filter = filter.bind(newCascader);
			ans.push(newCascader);
		}
	}

	var allTargets = _.chain(allCascader)
		.map("targets")
		.flatten()
		.keyBy("label")
		.value();
	ans = ans.filter((a) => !allTargets[a.label]);

	var cascaderHook = (data) => {
		var result = { ...data };
		for (var label in data) {
			if (!allCascader[label]) continue;

			var { targets } = allCascader[label];
			for (var i = 0, ii = targets.length; i < ii; i++)
				_.set(result, targets[i].name, data[label][i]);
			delete result[label];
		}
		return result;
	};

	return { formSpec: ans, cascaderHook };
};

export const useSteps = (steps) => {
	const [currentStep, setStep] = useState(0);
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
