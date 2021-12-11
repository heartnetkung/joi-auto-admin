/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { Row, Button } from "antd";
import { useWindowSize } from "./hooks";
import { MENU_FORM } from "../constants";
import * as styles from "../styles";
import * as innerStyles from "./styles";

const MIN_WIDTH = 400;
const OTHER_ELEM_SIZE = 52;
const INNER_ELEM_SIZE = 72;

const PanelView = (props) => {
  const {
    leftView,
    rightView,
    rightViewStyle,
    menu,
    bottomBar,
    currentView,
    validateSchema,
  } = props;
  const splitPanelRef = useRef();
  const leftPanelRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [separatorXPosition, setSeparatorXPosition] = useState();
  const [leftPanelWidth, setLeftPanelWidth] = useState();
  const [windowHeight] = useWindowSize();
  const [showError, setShowError] = useState(false);

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

  useEffect(() => {
    if (validateSchema?.isValidate && showError) {
      setShowError(false);
    }
  }, [showError, validateSchema]);

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

  const getElemSize = () => {
    const defaultSize = OTHER_ELEM_SIZE + INNER_ELEM_SIZE;
    if (currentView === MENU_FORM.form) {
      return defaultSize + 40 + 60;
    }
    return defaultSize;
  };

  return (
    <div ref={splitPanelRef} style={styles.panelContainer}>
      <div
        ref={leftPanelRef}
        style={{
          ...styles.leftPanelContainer,
          width: leftPanelWidth || "50%",
          ...(windowHeight && {
            height: windowHeight - OTHER_ELEM_SIZE,
          }),
        }}
      >
        <div style={{ height: 40 }}>{menu}</div>
        {currentView === MENU_FORM.form && (
          <Row
            style={{
              alignItems: "center",
              margin: "0.5rem 1rem 1rem 1rem",
              height: 32,
            }}
          >
            {validateSchema?.isValidate && (
              <CheckCircleTwoTone
                twoToneColor="#52c41a"
                style={{ fontSize: 24 }}
              />
            )}
            {!validateSchema?.isValidate && (
              <CloseCircleTwoTone
                twoToneColor="#eb2f96"
                style={{ fontSize: 24 }}
              />
            )}
            <span style={{ paddingLeft: "0.5rem" }}>Validate Schema</span>
            {!validateSchema?.isValidate && (
              <Button
                style={{ marginLeft: 16 }}
                type="primary"
                danger
                onClick={() => setShowError(!showError)}
              >
                {showError ? "HIDE ERROR" : "SHOW ERROR"}
              </Button>
            )}
          </Row>
        )}
        <div
          style={{
            overflow: "auto",
            height: "100%",
            ...(windowHeight && {
              maxHeight: windowHeight - getElemSize(),
            }),
          }}
        >
          {leftView}
        </div>
        {currentView === MENU_FORM.form && (
          <div style={{ height: 40, paddingTop: 8 }}>{bottomBar}</div>
        )}
      </div>
      <div style={styles.resizableContainer} onMouseDown={onEventMouseDown} />
      <div
        style={{
          ...(leftPanelRef.current && {
            height: windowHeight - OTHER_ELEM_SIZE,
          }),
          ...(rightViewStyle && rightViewStyle),
          ...innerStyles.rightPanel,
        }}
      >
        <div>
          {!showError && rightView}
          {showError && (
            <>
              <h2 style={{ color: "white" }}>SCHEMA ERROR</h2>
              <span style={{ color: "white", fontSize: 20 }}>
                {validateSchema?.message}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

PanelView.propTypes = {
  currentView: PropTypes.oneOf([MENU_FORM.form, MENU_FORM.setting]).isRequired,
  menu: PropTypes.any,
  bottomBar: PropTypes.any,
  leftView: PropTypes.any.isRequired,
  rightView: PropTypes.any.isRequired,
  rightViewStyle: PropTypes.object,
  validateSchema: PropTypes.object.isRequired,
};

PanelView.defaultProps = {
  rightViewStyle: null,
  menu: null,
};

export default PanelView;
