import React from "react";

import Spinner from "../Spinner/Spinner";
import "./Button.css";

function button(props) {
  return (
    <button
      disabled={props.disabled || props.loading}
      type={props.type || "button"}
      style={props.style}
      className={`button ${props.disabled ? "button-disabled" : ""} ${
        props.loading ? "button-loading" : ""
      }`}
    >
      {props.loading ? <Spinner size={35} /> : props.children}
    </button>
  );
}

export default button;
