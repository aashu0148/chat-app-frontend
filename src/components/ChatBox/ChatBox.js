import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Avatar, Divider } from "@material-ui/core";
import AttachIcon from "@material-ui/icons/AttachFileRounded";
import CancelIcon from "@material-ui/icons/Cancel";

import Button from "../Button/Button";
import ChatMessage from "./ChatMessage";
import Spinner from "../Spinner/Spinner";
import "./ChatBox.css";

function ChatBox(props) {
  const input = useRef();
  const messageRef = useRef(null);

  const [headerOpen, setHeaderOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [messages, setMessages] = useState();
  const [arrivalMessage, setArrivalMessage] = useState();

  useEffect(() => {
    setMessages("");
    if (props.cid) {
      setHeaderOpen(false);
      fetch(`${process.env.REACT_APP_SERVER}/message/${props.cid}`)
        .then(async (res) => {
          const data = await res.json();
          if (!data.status) {
            setErrorMsg(data.message);
            return;
          }
          setErrorMsg("");
          setMessages(data.data.messages);
          messageRef?.current?.scrollIntoView();
        })
        .catch(() => {
          setErrorMsg("Error connecting to server");
        });
    }
  }, [props.cid]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.current.value.trim()) {
      return;
    }

    props.socket.emit("sendMessage", {
      conversationId: props.cid,
      senderId: props.uid,
      text: input.current.value,
    });

    e.target.reset();
  };

  useEffect(() => {
    if (!messages) return;
    const myMessages = [...messages];
    myMessages.push(arrivalMessage);
    setMessages(myMessages);
    setTimeout(
      () => messageRef?.current?.scrollIntoView({ behavior: "smooth" }),
      0
    );
  }, [arrivalMessage]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    props.socket.on("getMessage", (message) => {
      setArrivalMessage({
        text: message.text,
        senderId: message.senderId,
        timestamp: message.timestamp,
      });
    });

    return () => {
      props.socket.off("getMessage", (message) => {});
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="chat-box semi-transparent"
      style={{ borderRadius: "10px", padding: "10px" }}
    >
      {props.cid ? (
        errorMsg ? (
          <small className="field-error-msg" style={{ fontSize: "1rem" }}>
            {errorMsg}
          </small>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingBottom: "10px",
                transition: "200ms",
              }}
              className={headerOpen ? "expanded-header" : ""}
            >
              <Avatar
                variant="square"
                style={{
                  borderRadius: "10px",
                  height: "56px",
                  width: "48px",
                  cursor: "pointer",
                  transition: "200ms",
                }}
                src={process.env.REACT_APP_SERVER + "/" + props.friend.image}
                onClick={() => setHeaderOpen(!headerOpen)}
              />
              <div
                className={headerOpen ? "expanded-header-content" : ""}
                style={{ margin: "0 15px", cursor: "pointer" }}
                onClick={() => (headerOpen ? "" : setHeaderOpen(true))}
              >
                {headerOpen ? (
                  <>
                    <div style={{ width: "100%", textAlign: "end" }}>
                      <CancelIcon
                        onClick={(e) => {
                          e.stopPropagation();
                          setHeaderOpen(false);
                        }}
                        style={{
                          color: "#fff",
                          fontSize: "2.5rem",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                    <h3
                      style={{
                        textTransform: "capitalize",
                        color: "var(--primary-color)",
                      }}
                    >
                      {props.friend.name}
                    </h3>
                    <h4>{props.friend.email}</h4>
                  </>
                ) : (
                  <h4 style={{ textTransform: "capitalize" }}>
                    {props.friend.name}
                  </h4>
                )}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      margin: "4px",
                      backgroundColor: props.online.includes(props.friend.id)
                        ? "#37f40b"
                        : "gray",
                      borderRadius: "50%",
                      height: "10px",
                      width: "10px",
                    }}
                  />
                  <span>
                    {props.online.includes(props.friend.id)
                      ? "Online"
                      : "Offline"}
                  </span>
                </div>
              </div>
            </div>
            <Divider />

            <div
              className="custom-scroll chat-box_body"
              style={{ padding: "10px 0", flex: "1" }}
            >
              {!messages ? (
                <Spinner />
              ) : messages.length > 0 ? (
                messages.map((message, i) => (
                  <ChatMessage
                    ref={messageRef}
                    key={i + message.senderId}
                    image={
                      message.senderId === props.uid
                        ? process.env.REACT_APP_SERVER + "/" + props.image
                        : process.env.REACT_APP_SERVER +
                          "/" +
                          props.friend.image
                    }
                    message={message.text}
                    own={message.senderId === props.uid}
                    timestamp={message.timestamp}
                  />
                ))
              ) : (
                ""
              )}
            </div>

            <Divider />
            <form
              onSubmit={sendMessage}
              style={{
                paddingTop: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <AttachIcon style={{ margin: "0 5px" }} />
              <input
                ref={input}
                type="text"
                style={{
                  background: "#fff",
                  padding: "10px 20px",
                  borderRadius: "15px",
                  minWidth: "200px",
                  border: "none",
                  outline: "none",
                  flex: "30",
                }}
                placeholder="Enter message"
              />
              <Button type="submit" style={{ margin: "0 10px" }}>
                Send
              </Button>
            </form>
          </>
        )
      ) : (
        ""
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    image: state.image,
    name: state.name,
    uid: state.id,
    socket: state.socket,
  };
};

export default connect(mapStateToProps)(ChatBox);
