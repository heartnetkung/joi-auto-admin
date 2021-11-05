import PropTypes from "prop-types";
import { Cascader, Form } from "formik-antd";
import districtData from "../../assets/district";
import { useCallback } from "react";
import { getErrorMessage } from "../../joi/error_message";
import Joi from "joi/lib/index";

const Component = (props) => {
	const { name, label, required, meta } = props;
	const validate = useCallback((value) => {
		var schema = Joi.array();
		if (required) schema = schema.required();

		var rawError = schema.validate(value);
		if (!rawError.error || !Array.isArray(rawError.error.details))
			return null;

		for (var errorObj of rawError.error.details)
			return getErrorMessage(errorObj, label);

		return null;
	}, [label, required]);

	return (
		<Form.Item
			label={label}
			required={required}
			name={name}
			validate={validate}
		>
			<Cascader
				options={getDistrict()}
				showSearch={{ filter: provinceFilter }}
				name={name}
				{...meta}
			></Cascader>
		</Form.Item>
	);
};

Component.propTypes = {
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	required: PropTypes.bool.isRequired,
	meta: PropTypes.object.isRequired,
};

const provinceFilter = (inputValue, path) =>
	path.some((option) => option.label.indexOf(inputValue) > -1);

var district = null;
const getDistrict = (a) => {
	if (!district) {
		district = districtData.map((province) => ({
			value: province.l,
			label: province.l,
			children: province.c.map((district) => ({
				value: district.l,
				label: district.l,
			})),
		}));
	}
	return district;
};

export default Component;
