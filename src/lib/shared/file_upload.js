import { useRef } from "react";
import { Button } from "antd";
import PropTypes from "prop-types";
import _ from "lodash";
import React from 'react';

const FileUploader = (props) => {
	const { handleFile, children, accept } = props;

	const props2 = _.omit(props, ["handleFile", "children"]);
	const hiddenFileInput = useRef(null);
	const handleClick = (event) => hiddenFileInput.current.click();
	const handleChange = (event) => handleFile(event.target.files[0]);

	return (
		<>
			<Button {...props2} onClick={handleClick}>
				{children}
			</Button>
			<input
				accept={accept}
				type="file"
				ref={hiddenFileInput}
				onChange={handleChange}
				style={{ display: "none" }}
			/>
		</>
	);
};
FileUploader.propTypes = {
	handleFile: PropTypes.func.isRequired,
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node,
	]).isRequired,
	accept: PropTypes.string.isRequired /*example: ".xlsx"*/,
};

export default FileUploader;
