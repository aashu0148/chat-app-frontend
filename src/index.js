import React from "react";
import ReactDOM from "react-dom";
import { composeWithDevTools } from "redux-devtools-extension";
import { createStore } from "redux";
import { Provider } from "react-redux";

import App from "./App";
import reducer from "./store/reducer";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={createStore(reducer, composeWithDevTools())}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
