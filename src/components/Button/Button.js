import React from "react";

import "./Button.css";

function button(props) {
  return (
    <button
      disabled={props.disabled}
      type={props.type || "button"}
      style={props.style}
      className={`button ${props.disabled ? "button-disabled" : ""}`}
    >
      {props.children}
    </button>
  );
}

export default button;
