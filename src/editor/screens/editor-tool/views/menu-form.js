import React from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import { MENU_FORM } from "../constants";
import * as styles from "./styles";

const MenuFormView = (props) => {
  const { currentMenu, setCurrentMenu, onClearForm } = props;

  const onEventClick = (type) => {
    setCurrentMenu({ current: type });
  };

  return (
    <div style={styles.rowMenu}>
      <Button
        type="primary"
        ghost={currentMenu?.current !== MENU_FORM.form}
        block
        onClick={() => onEventClick(MENU_FORM.form)}
      >
        {MENU_FORM.form}
      </Button>
      <Button
        type="primary"
        ghost={currentMenu?.current !== MENU_FORM.setting}
        block
        style={styles.button}
        onClick={() => onEventClick(MENU_FORM.setting)}
      >
        {MENU_FORM.setting}
      </Button>
      <Button type="dashed" danger onClick={onClearForm}>
        Reset
      </Button>
    </div>
  );
};

MenuFormView.propTypes = {
  currentMenu: PropTypes.object.isRequired,
  setCurrentMenu: PropTypes.func.isRequired,
  onClearForm: PropTypes.func.isRequired,
};

export default MenuFormView;
