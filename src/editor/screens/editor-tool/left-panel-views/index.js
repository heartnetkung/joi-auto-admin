import React from "react";
import PropTypes from "prop-types";
import RenderSetting from "./setting";
import { MENU_FORM } from "../constants";
import * as styles from "./styles";

const LeftPanelView = (props) => {
  const { view } = props;

  if (view === MENU_FORM.setting) {
    return (
      <div style={styles.Wrapper}>
        <RenderSetting />
      </div>
    );
  }
  return (
    <div style={styles.Wrapper}>
      <RenderSetting />
    </div>
  );
};

LeftPanelView.propTypes = {
  view: PropTypes.oneOf([MENU_FORM.form, MENU_FORM.setting]),
};

LeftPanelView.defaultProps = {
  view: MENU_FORM.form,
};

export default LeftPanelView;
