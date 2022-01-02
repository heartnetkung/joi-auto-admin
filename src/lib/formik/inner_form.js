import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useFormikContext } from "formik";
import Field from "./field";
import FieldArray from "./field_array";
import { calculateSpan } from "./logic";

const InnerForm = (props) => {
	const { formSpec, inline, currentStep } = props;
	const { values } = useFormikContext();

	const formSpec2 = useMemo(() => {
		return calculateSpan(
			formSpec.filter((spec) => {
				const { fieldHide, step } = spec;
				if (typeof fieldHide === "function") {
					if (fieldHide(values)) return false;
				} else if (fieldHide) return false;
				if (currentStep !== -1 && currentStep !== step) return false;
				return true;
			}),
			inline
		);
	}, [formSpec, values, inline, currentStep]);

	return formSpec2.map((props) => {
		if (props.fieldType === "FieldArray")
			return <FieldArray {...props} key={props.name} />;

		const meta = props.meta || {};
		return (
			<Field
				{...props}
				key={props.name}
				meta={
					inline
						? { ...meta, style: { ...meta.style, ...inlineStyle } }
						: meta
				}
			/>
		);
	});
};

const inlineStyle = { width: 150 };

InnerForm.propTypes = {
	formSpec: PropTypes.array.isRequired,
	inline: PropTypes.bool.isRequired,
	currentStep: PropTypes.number.isRequired,
};

export default InnerForm;
