import { Typography } from "antd";
import PropTypes from "prop-types";
import React from "react";

const { Title, Paragraph } = Typography;

const Header = (props) => {
	const { title, description, small, icon } = props;
	const { headerContainerStyle, titleStyle, descriptionStyle } = props;

	return (
		<div style={headerContainerStyle}>
			<Title level={small ? 3 : 2} style={titleStyle}>
				{icon} {title}
			</Title>
			{description && (
				<Paragraph style={descriptionStyle}>{description}</Paragraph>
			)}
		</div>
	);
};

Header.propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
	headerContainerStyle: PropTypes.object,
	small: PropTypes.bool,
	icon: PropTypes.node,
};

Header.defaultProps = {
	title: "",
	description: "",
	headerContainerStyle: { marginBottom: 20, textAlign: "center" },
	titleStyle: {},
	descriptionStyle: { textAlign: "left" },
	small: false,
	icon: null,
};

export default Header;
