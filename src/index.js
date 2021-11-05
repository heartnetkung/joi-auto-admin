import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import App from "./App3";

// strict mode disabled because antd doesn't support it
// https://github.com/ant-design/ant-design/issues/22493
ReactDOM.render(<App />, document.getElementById("root"));
