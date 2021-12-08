import React from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import { MENU_FORM } from "../constants";
import * as styles from "./styles";

const MenuFormView = (props) => {
  const { currentMenu, setCurrentMenu } = props;

  const onEventClick = (type) => {
    setCurrentMenu({ current: type });
  };

  return (
    <div style={styles.rowMenu}>
      <Button
        type="primary"
        ghost={currentMenu?.current !== MENU_FORM.setting}
        block
        onClick={() => onEventClick(MENU_FORM.setting)}
      >
        {MENU_FORM.setting}
      </Button>
      <Button
        type="primary"
        ghost={currentMenu?.current !== MENU_FORM.form}
        block
        style={styles.button}
        onClick={() => onEventClick(MENU_FORM.form)}
      >
        {MENU_FORM.form}
      </Button>

    </div>
  );
};

MenuFormView.propTypes = {
  currentMenu: PropTypes.object.isRequired,
  setCurrentMenu: PropTypes.func.isRequired,
};

export default MenuFormView;
