/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Typography } from "antd";
import _ from 'lodash'
import MenuView from "./views/menu";
import MenuFormView from "./views/menu-form";
import RightPanelView from "./right-panel-views";
import LeftPanelView from "./left-panel-views";
import { MENU, MENU_FORM } from "./constants";
import { rowField } from "./left-panel-views/data-field";
import * as styles from "./styles";
import * as logic from "./logic";

const MIN_WIDTH = 400;
const DELAY_TIMER = 500;
const IS_DISABLE_RESIZE_PANEL = true;

const EditorScreen = () => {
  const splitPanelRef = useRef();
  const leftPanelRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [separatorXPosition, setSeparatorXPosition] = useState();
  const [leftPanelWidth, setLeftPanelWidth] = useState();
  const [currentMenuState, setCurrentMenuState] = useState({
    current: MENU.ui,
  });
  const [currentMenuFormState, setCurrentMenuFormState] = useState({
    current: MENU_FORM.setting,
  });
  const [formState, setFormState] = useState([
    { ...rowField },
    { ...rowField },
    { ...rowField },
  ]);
  const [settingState, setSettingState] = useState({ name: "example-tb-name", querySchema: {}, steps: [] });
  const [tableSettingProps, setTableSettingProps] = useState();
  const [schemaProps, setSchemaProps] = useState();

  useEffect(() => {
    if (!IS_DISABLE_RESIZE_PANEL) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("touchmove", onTouchMove);
      document.addEventListener("mouseup", onMouseUp);

      return () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("touchmove", onTouchMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
    }
  }, [IS_DISABLE_RESIZE_PANEL]);

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
    const setting = logic.cleanTableSettingBeforeTrans(settingState)
    setTableSettingProps(setting)
  }

  const onFormSchemaChange = () => {
    const schema = logic.cleanFormBeforeTrans(formState, settingState?.steps)
    setSchemaProps(schema)
  }

  const debounceTableTrans = _.debounce(onSettingChange, DELAY_TIMER)
  const debounceSchemaTrans = _.debounce(onFormSchemaChange, DELAY_TIMER)

  const onEventMouseDown = (event) => {
    if (!event) {
      return;
    }
    setSeparatorXPosition(event.clientX);
    if (!isDragging) {
      setIsDragging(true);
    }
    if (!leftPanelWidth && leftPanelRef.current) {
      setLeftPanelWidth(leftPanelRef.current.clientWidth);
    }
  };

  const onMouseMove = (e) => {
    if (isDragging) {
      e.preventDefault();
    }
    onMove(e.clientX);
  };

  const onTouchMove = (e) => {
    if (!e) {
      return;
    }
    onMove(e.touches[0].clientX);
  };

  const onMouseUp = () => {
    setSeparatorXPosition(undefined);
    setIsDragging(false);
  };

  const onMove = (clientX) => {
    if (!clientX) {
      return;
    }
    if (isDragging && leftPanelWidth && separatorXPosition) {
      const newLeftWidth = leftPanelWidth + clientX - separatorXPosition;
      setSeparatorXPosition(clientX);
      if (newLeftWidth < MIN_WIDTH) {
        setLeftPanelWidth(MIN_WIDTH);
        return;
      }
      if (splitPanelRef.current) {
        const splitPaneWidth = splitPanelRef.current.clientWidth;
        if (newLeftWidth > splitPaneWidth - MIN_WIDTH) {
          setLeftPanelWidth(splitPaneWidth - MIN_WIDTH);
          return;
        }
      }
      setLeftPanelWidth(newLeftWidth);
    }
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
      <div ref={splitPanelRef} style={styles.panelContainer}>
        <div
          ref={leftPanelRef}
          style={{
            ...styles.leftPanelContainer,
            width: leftPanelWidth || "50%",
          }}
        >
          <div style={styles.LeftContent}>
            <MenuFormView
              currentMenu={currentMenuFormState}
              setCurrentMenu={setCurrentMenuFormState}
            />
            <LeftPanelView
              view={currentMenuFormState.current}
              formState={formState}
              setFormState={setFormState}
              settingState={settingState}
              setSettingState={setSettingState}
            />
          </div>
        </div>
        <div style={styles.resizableContainer} onMouseDown={onEventMouseDown} />
        <div style={styles.rightPanelContainer}>
          <RightPanelView view={currentMenuState.current} settings={tableSettingProps} editors={schemaProps || formState} />
        </div>
      </div>
    </div>
  );
};

EditorScreen.propTypes = {};

export default EditorScreen;
