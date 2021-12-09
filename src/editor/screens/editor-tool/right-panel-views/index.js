/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import RenderCodeBlocks from "./code-blocks";
import { MENU } from "../constants";
import { DUMMY_JSX } from "../example/dummy-code";
import { App as TransView, validateEditor } from '../../../logic'

const RightPanelView = (props) => {
  const { view, editors, settings } = props;
  const [isEditorError, setIsEditorError] = useState(false)

  useEffect(() => {
    console.log(editors, 'editor')
    const isError = validateEditor(editors);
    console.log(isError, 'error')
  }, [editors])

  if (view === MENU.code) {
    return <RenderCodeBlocks text={DUMMY_JSX} />;
  }

  return <div>
    <TransView editors={!isEditorError ? editors : undefined} settings={settings} />
  </div>;
};

RightPanelView.propTypes = {
  view: PropTypes.oneOf([MENU.form, MENU.table, MENU.code, MENU.setting]),
  editors: PropTypes.array,
  settings: PropTypes.object,
};

RightPanelView.defaultProps = {
  view: "form",
};

export default RightPanelView;
