import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./lib/index.css";
// import App from "./App3";
// import App from "./App4";
// import App from "./App5";
// import App from "./App6";
// import App from "./App7";
// import App from "./App8";
// import App from "./App4";
// import App from "./App9";
// import App from "./App20";
// import App from "./App21";
import React from "react";
import App from "./editor";

// strict mode disabled because antd doesn't support it
// https://github.com/ant-design/ant-design/issues/22493
ReactDOM.render(<App />, document.getElementById("root"));
