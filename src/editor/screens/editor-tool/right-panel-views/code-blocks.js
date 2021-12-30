import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { CopyBlock, dracula } from "react-code-blocks";

const RenderCodeBlocks = (props) => {
  const { text } = props;

  //hack: remove unwanted style from child node
  const container = useRef(null);
  useEffect(() => {
    if (!container.current) return;
    var span = container.current.querySelector(":scope>div>span");
    if (span) span.style.padding = null;
  }, [container]);

  return (
    <div ref={container}>
      <CopyBlock text={text} language="jsx" theme={dracula} />
    </div>
  );
};

RenderCodeBlocks.propTypes = {
  text: PropTypes.string.isRequired,
};

export default RenderCodeBlocks;
