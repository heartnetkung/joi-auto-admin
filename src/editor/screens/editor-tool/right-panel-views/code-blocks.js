import React, { useState } from "react";
import PropTypes from "prop-types";
import { CopyBlock, dracula } from "react-code-blocks";

const RenderCodeBlocks = (props) => {
  const { text } = props;
  const [language] = useState("jsx");
  if (!props) {
    return null;
  }

  return <CopyBlock text={text} language={language} theme={dracula} />;
};

RenderCodeBlocks.propTypes = {
  text: PropTypes.string,
};

export default RenderCodeBlocks;
