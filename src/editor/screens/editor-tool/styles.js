const panelColor = "rgb(35,39,46)";
const panelColor2 = "#dfe6e9";

export const LayoutContainer = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
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
  position: "relative",
};

export const rightPanelContainer = {
  backgroundColor: panelColor,
};

export const rightPanelContainer2 = {
  backgroundColor: panelColor2,
};

export const LeftContent = {
  height: "100%",
};

export const brandingText = {
  marginLeft: "1rem",
  top: 6,
  display: "inline",
  position: "relative",
};

export const githubStar = {
  marginLeft: 20,
  marginTop: 3,
  verticalAlign: "middle",
};

export const githubText = { top: 2, position: "relative" };
