import React, { useState } from "react";
import PropTypes from "prop-types";
import { CopyBlock, dracula } from "react-code-blocks";

const RenderCodeBlocks = (props) => {
  const { text } = props;
  const [language] = useState("jsx");
  if (!props) {
    return null;
  }

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        maxWidth: "50vw",
        overflow: "auto",
      }}
    >
      <CopyBlock text={text} language={language} theme={dracula} />
    </div>
  );
};

RenderCodeBlocks.propTypes = {
  text: PropTypes.string,
};

export default RenderCodeBlocks;
