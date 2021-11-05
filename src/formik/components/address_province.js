import PropTypes from "prop-types";
import { Cascader, Form } from "formik-antd";
import districtData from "../../assets/district";

const Component = (props) => {
	const { name, validate, label, required, meta } = props;
	return (
		<Form.Item
			label={label}
			required={required}
			name={name}
			validate={validate}
		>
			<Cascader
				options={getProvince()}
				showSearch={{ filter: provinceFilter }}
				name={name}
				{...meta}
			></Cascader>
		</Form.Item>
	);
};

Component.propTypes = {
	name: PropTypes.string.isRequired,
	validate: PropTypes.func.isRequired,
	label: PropTypes.string.isRequired,
	required: PropTypes.bool.isRequired,
	meta: PropTypes.object.isRequired,
};

const provinceFilter = (inputValue, path) =>
	path.some((option) => option.label.indexOf(inputValue) > -1);

var province = null;
const getProvince = (a) => {
	if (!province)
		province = districtData.map((province) => ({
			value: province.l,
			label: province.l,
		}));
	return province;
};

export default Component;
