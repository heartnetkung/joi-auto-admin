/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import RenderCodeBlocks from "./code-blocks";
import { MENU } from "../constants";
import { App as TransView, validateEditor, makeJoiObj } from '../../../logic'
import { renderTemplate } from '../../../logic/template'

const RightPanelView = (props) => {
  const { view, editors, settings } = props;

  useEffect(() => {
    validateEditor(editors);
    // console.log(isError, 'error')
  }, [editors])

  if (view === MENU.code) {
    const codeText = renderTemplate(editors, settings);
    return <RenderCodeBlocks text={codeText} />;
  }

  return <div style={{ maxWidth: '50vw', overflow: 'auto' }}>
    <TransView editors={editors} settings={settings} />
  </div>;
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
