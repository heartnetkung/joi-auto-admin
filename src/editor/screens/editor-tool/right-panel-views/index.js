import React from "react";
import PropTypes from "prop-types";
import RenderCodeBlocks from "./code-blocks";
import { MENU } from "../constants";
import { DUMMY_JSX } from "../example/dummy-code";

const RightPanelView = (props) => {
  const { view } = props;
  if (view === MENU.code) {
    return <RenderCodeBlocks text={DUMMY_JSX} />;
  }
  return <div>d</div>;
};

RightPanelView.propTypes = {
  view: PropTypes.oneOf([MENU.form, MENU.table, MENU.code, MENU.setting]),
};

RightPanelView.defaultProps = {
  view: "form",
};

export default RightPanelView;
