import React from "react";

import "./Spinner.css";

function Spinner(props) {
  return (
    <div
      style={{
        minHeight: props.size ? `${props.size}px` : "",
        minWidth: props.size ? `${props.size}px` : "",
      }}
      className="wrapper"
    >
      <div
        style={{
          height: props.size ? `${(66 * props.size) / 100}px` : "",
          width: props.size ? `${(66 * props.size) / 100}px` : "",
        }}
        className="loader-circle"
      ></div>
    </div>
  );
}

export default Spinner;
