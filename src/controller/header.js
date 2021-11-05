import { Typography } from "antd";
import PropTypes from "prop-types";

const { Title, Paragraph } = Typography;

const Header = (props) => {
	const { title, description, name, small } = props;
	const { headerContainerStyle, titleStyle, descriptionStyle } = props;
	const title2 = title || `ข้อมูล${name}`;

	return (
		<div style={headerContainerStyle}>
			<Title level={small ? 3 : 2} style={titleStyle}>
				{title2}
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
};

Header.defaultProps = {
	title: "",
	description: "",
	name: "",
	headerContainerStyle: { marginBottom: 20, textAlign: "center" },
	titleStyle: {},
	descriptionStyle: { textAlign: "left" },
	small: false,
};

export default Header;
