import { Button, Space } from "antd";
import PropTypes from "prop-types";
import React from 'react';

const RowMenu = (props) => {
	const { buttons, record } = props;

	return (
		<Space>
			{buttons.map((action, index) => {
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

RowMenu.propTypes = {
	buttons: PropTypes.array.isRequired,
	record: PropTypes.any.isRequired,
};

const NOOP = () => {};

export default RowMenu;
