const panelColor = "rgb(35,39,46)";

export const LayoutContainer = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100vh",
  minWidth: 800,
};

export const panelContainer = {
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  height: "100%",
};

export const resizableContainer = {
  height: "100%",
  width: 5,
  cursor: "col-resize",
};

export const leftPanelContainer = {
  height: "100%",
  backgroundColor: panelColor,
  padding: "1rem",
};

export const rightPanelContainer = {
  flex: 1,
  backgroundColor: panelColor,
  padding: "2rem 1rem",
};
