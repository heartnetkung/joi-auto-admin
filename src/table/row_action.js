import { Button, Space } from "antd";
import PropTypes from "prop-types";

const ActionComp = (props) => {
	const { actions, record } = props;

	return (
		<Space>
			{actions.map((action, index) => {
				return (
					<Button
						{...action}
						key={index}
						onClick={
							action.onClick
								? (event) => action.onClick(record, event)
								: NOOP
						}
					>
						{action.label}
					</Button>
				);
			})}
		</Space>
	);
};

ActionComp.propTypes = {
	actions: PropTypes.array.isRequired,
	record: PropTypes.any.isRequired,
};

const NOOP = () => {};

export default ActionComp;
