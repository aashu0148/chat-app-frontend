import React from "react";
import { Avatar } from "@material-ui/core";

function SidebarRow(props) {
  return (
    <div
      onClick={props.onClick}
      className="sidebar-row"
      style={{ backgroundColor: props.active ? "#fff" : "" }}
    >
      <Avatar
        variant="square"
        style={{ borderRadius: "25%", height: "32px", width: "32px" }}
        src={props.image}
      />
      <div style={{ margin: "0 5px", flex: "10", textAlign: "start" }}>
        <p style={{ margin: "0", textTransform: "capitalize" }}>
          {props.name
            ? props.name.length > 22
              ? props.name.substr(0, 22) + "..."
              : props.name
            : "-"}
        </p>

        <small
          style={{
            whiteSpace: "nowrap",
          }}
        >
          {props.message
            ? props.message.length > 27
              ? props.message.substr(0, 27) + "..."
              : props.message
            : "_"}
        </small>
      </div>
      <div
        style={{
          margin: "4px",
          backgroundColor: props.online ? "#37f40b" : "gray",
          borderRadius: "50%",
          height: "10px",
          width: "10px",
        }}
      />
    </div>
  );
}

export default SidebarRow;
