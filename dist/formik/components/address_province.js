import _extends from "@babel/runtime/helpers/extends";
import PropTypes from "prop-types";
import { Cascader, Form } from "formik-antd";
import districtData from "../../assets/district";

var Component = function Component(props) {
  var name = props.name,
      validate = props.validate,
      label = props.label,
      required = props.required,
      meta = props.meta;
  return /*#__PURE__*/React.createElement(Form.Item, {
    label: label,
    required: required,
    name: name,
    validate: validate
  }, /*#__PURE__*/React.createElement(Cascader, _extends({
    options: getProvince(),
    showSearch: {
      filter: provinceFilter
    },
    name: name
  }, meta)));
};

Component.propTypes = {
  name: PropTypes.string.isRequired,
  validate: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  meta: PropTypes.object.isRequired
};

var provinceFilter = function provinceFilter(inputValue, path) {
  return path.some(function (option) {
    return option.label.indexOf(inputValue) > -1;
  });
};

var province = null;

var getProvince = function getProvince(a) {
  if (!province) province = districtData.map(function (province) {
    return {
      value: province.l,
      label: province.l
    };
  });
  return province;
};

export default Component;