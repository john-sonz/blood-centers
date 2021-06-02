import * as React from "react";

import { App } from "./App";
import { ColorModeScript } from "@chakra-ui/react";
import ReactDOM from "react-dom";
import axios from "axios";

axios.defaults.baseURL = `${window.location.origin}`;
axios.defaults.headers.common["Content-Type"] = "application/json";

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
