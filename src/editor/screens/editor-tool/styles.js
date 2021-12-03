const panelColor = "rgb(35,39,46)";

export const LayoutContainer = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100vh",
  minWidth: 800,
};

export const panelContainer = {
  flex: 1,
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
};

export const resizableContainer = {
  height: "100%",
  width: 5,
  cursor: "col-resize",
};

export const leftPanelContainer = {
  backgroundColor: "white",
  padding: "1rem",
  marginLeft: 6,
  marginBottom: 6,
  borderRadius: 8,
  border: `1px solid ${panelColor}`,
};

export const rightPanelContainer = {
  flex: 1,
  borderRadius: 8,
  marginRight: 6,
  marginBottom: 6,
  backgroundColor: panelColor,
  padding: "2rem 1rem",
};

export const LeftContent = {
  height: "100%",
};
