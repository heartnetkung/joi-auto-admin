import { Button, Space } from "antd";
import PropTypes from "prop-types";
import React from "react";

const RowMenu = (props) => {
	const { buttons, record, updateDataAtRow } = props;

	return (
		<Space>
			{buttons.map((action, index) => {
				return (
					<Button
						{...action}
						key={index}
						onClick={
							action.onClick
								? () => action.onClick(record, updateDataAtRow)
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
	updateDataAtRow: PropTypes.func,
};

RowMenu.defaultProps = {
	updateDataAtRow: null,
};

const NOOP = () => {};

export default RowMenu;
