import { Typography } from "antd";
import PropTypes from "prop-types";

const { Title, Paragraph } = Typography;

const Header = (props) => {
	const { title, description, name, small, icon } = props;
	const { headerContainerStyle, titleStyle, descriptionStyle } = props;

	const name2 = name.length && /[a-z]/i.test(name[0]) ? " " + name : name;
	const title2 = title || `ข้อมูล${name2}`;

	return (
		<div style={headerContainerStyle}>
			<Title level={small ? 3 : 2} style={titleStyle}>
				{icon} {title2}
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
	name: PropTypes.string,
	headerContainerStyle: PropTypes.object,
	small: PropTypes.bool,
	icon: PropTypes.node,
};

Header.defaultProps = {
	title: "",
	description: "",
	name: "",
	headerContainerStyle: { marginBottom: 20, textAlign: "center" },
	titleStyle: {},
	descriptionStyle: { textAlign: "left" },
	small: false,
	icon: null,
};

export default Header;
