import React from "react";
import { Avatar } from "@material-ui/core";

function ChatMessage(props) {
  return (
    <div className={props.sender ? "message-right" : "message-left"}>
      {props.sender ? <p>{props.message}</p> : ""}
      <Avatar
        variant="square"
        style={{ borderRadius: "25%", height: "32px", width: "32px" }}
        src={props.image}
      />
      {props.sender ? "" : <p>{props.message}</p>}
    </div>
  );
}

export default ChatMessage;
