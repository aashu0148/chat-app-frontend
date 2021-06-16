import React, { forwardRef } from "react";
import { format } from "timeago.js";
import { Avatar } from "@material-ui/core";

const ChatMessage = forwardRef((props, ref) => {
  return (
    <div className={props.own ? "message-right" : "message-left"} ref={ref}>
      {props.own ? (
        <p style={{ whiteSpace: "pre-wrap" }}>
          {props.message}
          <span className="chat-message-time">{format(props.timestamp)}</span>
        </p>
      ) : (
        ""
      )}
      <Avatar
        variant="square"
        style={{ borderRadius: "25%", height: "32px", width: "32px" }}
        src={props.image}
      />
      {props.own ? (
        ""
      ) : (
        <p>
          {props.message}
          <span className="chat-message-time">{format(props.timestamp)}</span>
        </p>
      )}
    </div>
  );
});

export default ChatMessage;
