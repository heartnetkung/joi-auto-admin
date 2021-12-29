import React from "react";
import PropTypes from "prop-types";
import { CopyBlock, dracula } from "react-code-blocks";

const RenderCodeBlocks = (props) => {
  const { text } = props;
  return <CopyBlock text={text} language="jsx" theme={dracula} />;
};

RenderCodeBlocks.propTypes = {
  text: PropTypes.string.isRequired,
};

export default RenderCodeBlocks;
