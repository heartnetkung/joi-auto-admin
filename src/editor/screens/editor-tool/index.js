import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Typography } from "antd";
import MenuView from "./views/menu";
import MenuFormView from "./views/menu-form";
import RightPanelView from "./right-panel-views";
import LeftPanelView from "./left-panel-views";
import { MENU, MENU_FORM } from "./constants";
import * as styles from "./styles";

const MIN_WIDTH = 200;

const EditorScreen = () => {
  const splitPanelRef = useRef();
  const leftPanelRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [separatorXPosition, setSeparatorXPosition] = useState();
  const [leftPanelWidth, setLeftPanelWidth] = useState();
  const [currentMenuState, setCurrentMenuState] = useState({
    current: MENU.form,
  });
  const [currentMenuFormState, setCurrentMenuFormState] = useState({
    current: MENU_FORM.form,
  });

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  });

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
          <MenuFormView
            currentMenu={currentMenuFormState}
            setCurrentMenu={setCurrentMenuFormState}
          />
          <LeftPanelView view={currentMenuFormState.current} />
        </div>
        <div style={styles.resizableContainer} onMouseDown={onEventMouseDown} />
        <div style={styles.rightPanelContainer}>
          <RightPanelView view={currentMenuState.current} />
        </div>
      </div>
    </div>
  );
};

EditorScreen.propTypes = {};

export default EditorScreen;
