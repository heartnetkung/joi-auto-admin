import { Typography } from "antd";
import PropTypes from "prop-types";
import React from 'react';
var Title = Typography.Title,
    Paragraph = Typography.Paragraph;

var Header = function Header(props) {
  var title = props.title,
      description = props.description,
      name = props.name,
      small = props.small,
      icon = props.icon;
  var headerContainerStyle = props.headerContainerStyle,
      titleStyle = props.titleStyle,
      descriptionStyle = props.descriptionStyle;
  var name2 = name.length && /[a-z]/i.test(name[0]) ? " " + name : name;
  var title2 = title || "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25" + name2;
  return /*#__PURE__*/React.createElement("div", {
    style: headerContainerStyle
  }, /*#__PURE__*/React.createElement(Title, {
    level: small ? 3 : 2,
    style: titleStyle
  }, icon, " ", title2), description && /*#__PURE__*/React.createElement(Paragraph, {
    style: descriptionStyle
  }, description));
};

Header.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  name: PropTypes.string,
  headerContainerStyle: PropTypes.object,
  small: PropTypes.bool,
  icon: PropTypes.node
};
Header.defaultProps = {
  title: "",
  description: "",
  name: "",
  headerContainerStyle: {
    marginBottom: 20,
    textAlign: "center"
  },
  titleStyle: {},
  descriptionStyle: {
    textAlign: "left"
  },
  small: false,
  icon: null
};
export default Header;