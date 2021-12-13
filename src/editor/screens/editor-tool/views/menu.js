import React from "react";
import PropTypes from "prop-types";
import { Menu } from "antd";
import { MENU } from "../constants";

const MenuView = (props) => {
  const { currentMenu, setCurrentMenu } = props;

  const onEventClick = (e) => {
    setCurrentMenu({ current: e.key });
  };

  return (
    <Menu
      onClick={onEventClick}
      selectedKeys={[currentMenu.current]}
      mode="horizontal"
      style={{ float: "right", flexDirection: 'row-reverse', minWidth: 150 }}
    >
      <Menu.Item key={MENU.code}>{MENU.code}</Menu.Item>
      <Menu.Item key={MENU.ui}>{MENU.ui}</Menu.Item>
    </Menu>
  );
};

MenuView.propTypes = {
  currentMenu: PropTypes.object.isRequired,
  setCurrentMenu: PropTypes.func.isRequired,
};

export default MenuView;
