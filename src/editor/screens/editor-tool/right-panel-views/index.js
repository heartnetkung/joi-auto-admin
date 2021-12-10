import React from "react";
import PropTypes from "prop-types";
import RenderCodeBlocks from "./code-blocks";
import { MENU } from "../constants";
import { App as TransView } from "../../../logic";
import { renderTemplate } from "../../../logic/template";

const RightPanelView = (props) => {
  const { view, editors, settings } = props;

  if (view === MENU.code) {
    const codeText = renderTemplate(editors, settings);
    return <RenderCodeBlocks text={codeText} />;
  }

  return <TransView editors={editors} settings={settings} />;
};

RightPanelView.propTypes = {
  view: PropTypes.oneOf([MENU.ui, MENU.code]),
  editors: PropTypes.array,
  settings: PropTypes.object,
};

RightPanelView.defaultProps = {
  view: MENU.ui,
};

export default RightPanelView;
