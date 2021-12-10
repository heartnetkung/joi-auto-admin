/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import { useWindowSize } from "./hooks";
import * as styles from "../styles";
import * as innerStyles from "./styles";

const MIN_WIDTH = 400;
const OTHER_ELEM_SIZE = 52;

const PanelView = (props) => {
  const { leftView, rightView, rightViewStyle } = props;
  const splitPanelRef = useRef();
  const leftPanelRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [separatorXPosition, setSeparatorXPosition] = useState();
  const [leftPanelWidth, setLeftPanelWidth] = useState();
  const [windowHeight] = useWindowSize();
  const [renderText] = useState(() => Array.from(Array(100).keys()));

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

  console.log(windowHeight, "x");

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
        <div
          style={{
            overflow: "auto",
            height: "100%",
            ...(windowHeight && {
              maxHeight: windowHeight - OTHER_ELEM_SIZE - 32,
            }),
          }}
        >
          {leftView}
        </div>
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
        <div>{rightView}</div>
      </div>
    </div>
  );
};

PanelView.propTypes = {
  leftView: PropTypes.any.isRequired,
  rightView: PropTypes.any.isRequired,
  rightViewStyle: PropTypes.object,
};

PanelView.defaultProps = {
  rightViewStyle: null,
};

export default PanelView;
