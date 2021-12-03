import React from "react";
import PropTypes from "prop-types";
import RenderSetting from "./setting";
import RenderFormFields from "./form-fields";
import { MENU_FORM } from "../constants";
import * as styles from "./styles";
import _ from "lodash";

const LeftPanelView = (props) => {
  const { view } = props;
  const otherProps = _.omit({ ...(props && props) }, ["view"]) || {};

  if (view === MENU_FORM.setting) {
    return (
      <div style={styles.Wrapper}>
        <RenderSetting {...otherProps} />
      </div>
    );
  }
  return (
    <div style={styles.Wrapper}>
      <RenderFormFields {...otherProps} />
    </div>
  );
};

LeftPanelView.propTypes = {
  view: PropTypes.oneOf([MENU_FORM.form, MENU_FORM.setting]),
  formState: PropTypes.array.isRequired,
  setFormState: PropTypes.func.isRequired,
  settingState: PropTypes.object.isRequired,
  setSettingState: PropTypes.func.isRequired,
};

LeftPanelView.defaultProps = {
  view: MENU_FORM.form,
};

export default LeftPanelView;
