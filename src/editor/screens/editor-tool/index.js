/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Row, Col, Typography, Button } from "antd";
import _ from "lodash";
import { PlusOutlined } from "@ant-design/icons";
import MenuView from "./views/menu";
import MenuFormView from "./views/menu-form";
import RightPanelView from "./right-panel-views";
import LeftPanelView from "./left-panel-views";
import PanelContainerView from "./views/panel";
import { MENU, MENU_FORM } from "./constants";
import {
  getInitRowField,
  getInitRowQuerySchema,
  getSingleRow,
} from "./left-panel-views/data-field";

import * as styles from "./styles";
import * as logic from "./logic";

const DELAY_TIMER = 500;

const EditorScreen = () => {
  const [currentMenuState, setCurrentMenuState] = useState({
    current: MENU.ui,
  });
  const [currentMenuFormState, setCurrentMenuFormState] = useState({
    current: MENU_FORM.form,
  });
  const [formState, setFormState] = useState(() => getInitRowField());
  const [settingState, setSettingState] = useState(() => ({
    name: "example-tb-name",
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    querySchema: {
      query: false,
      schema: [...getInitRowQuerySchema()],
    },
    steps: [],
  }));
  const [tableSettingProps, setTableSettingProps] = useState();
  const [schemaProps, setSchemaProps] = useState();
  const [schemaValidateState, setSchemaValidateState] = useState({
    isValidate: true,
    message: "",
  });

  useEffect(() => {
    if (_.get(settingState, "name")) {
      debounceTableTrans();
    }
  }, [settingState]);

  useEffect(() => {
    if (_.get(formState, "[0]")) {
      debounceSchemaTrans();
    }
  }, [formState]);

  const onSettingChange = () => {
    const setting = logic.cleanTableSettingBeforeTrans(settingState);
    setTableSettingProps(setting);
  };

  const onFormSchemaChange = () => {
    const schema = logic.cleanFormBeforeTrans(formState, settingState?.steps);
    setSchemaProps(schema);
    const [isValidate, message] = logic.validateSchema(schema);
    setSchemaValidateState({ isValidate, message });
  };

  const onAddField = () => {
    if (!Array.isArray(formState)) {
      return;
    }
    const newForm = [...formState];
    newForm.push({ ...getSingleRow(settingState?.steps) });
    setFormState(newForm);
  };

  const debounceTableTrans = _.debounce(onSettingChange, DELAY_TIMER);
  const debounceSchemaTrans = _.debounce(onFormSchemaChange, DELAY_TIMER);

  const onEventResetForm = () => {
    setSettingState({
      name: "example-tb-name",
      canCreate: true,
      canUpdate: true,
      canDelete: true,
      querySchema: {
        query: false,
        schema: [...getInitRowQuerySchema()],
      },
      steps: [],
    });
    setFormState(() => getInitRowField());
  };

  return (
    <div style={styles.LayoutContainer}>
      <Row>
        <Col flex="1">
          <Typography.Title
            level={3}
            style={{ position: "absolute", left: "1rem", top: 6 }}
          >
            joi-auto-admin Generator
          </Typography.Title>
        </Col>
        <Col flex="1">
          <MenuView
            currentMenu={currentMenuState}
            setCurrentMenu={setCurrentMenuState}
          />
        </Col>
      </Row>
      <PanelContainerView
        validateSchema={schemaValidateState}
        currentView={currentMenuFormState.current}
        menu={
          <MenuFormView
            currentMenu={currentMenuFormState}
            setCurrentMenu={setCurrentMenuFormState}
            onClearForm={onEventResetForm}
          />
        }
        bottomBar={
          <Button
            block
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAddField}
          >
            Add Field
          </Button>
        }
        leftView={
          <>
            <LeftPanelView
              view={currentMenuFormState.current}
              formState={formState}
              setFormState={setFormState}
              settingState={settingState}
              setSettingState={setSettingState}
            />
          </>
        }
        rightView={
          <RightPanelView
            view={currentMenuState.current}
            settings={tableSettingProps}
            editors={schemaProps || formState}
          />
        }
        rightViewStyle={
          currentMenuState.current === MENU.ui
            ? styles.rightPanelContainer2
            : styles.rightPanelContainer
        }
      />
    </div>
  );
};

EditorScreen.propTypes = {};

export default EditorScreen;
