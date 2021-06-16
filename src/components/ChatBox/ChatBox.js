import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import openWebSocket from "socket.io-client";
import { Avatar, Divider } from "@material-ui/core";
import AttachIcon from "@material-ui/icons/AttachFileRounded";

import Button from "../Button/Button";
import ChatMessage from "./ChatMessage";
import Spinner from "../Spinner/Spinner";
import "./ChatBox.css";

const socket = openWebSocket.connect(process.env.REACT_APP_SERVER);

function ChatBox(props) {
  const input = useRef();
  const messageRef = useRef(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [messages, setMessages] = useState();
  const [arrivalMessage, setArrivalMessage] = useState();

  useEffect(() => {
    setMessages("");
    if (props.cid) {
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

    socket.emit("sendMessage", {
      conversationId: props.cid,
      senderId: props.uid,
      text: input.current.value,
    });

    e.target.reset();

    // fetch(`${process.env.REACT_APP_SERVER}/message/add`, {
    //   method: "POST",
    //   headers: {
    //     "content-type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     cid: props.cid,
    //     senderId: props.uid,
    //     message: input.current.value,
    //   }),
    // })
    //   .then(async (res) => {
    //     const data = await res.json();
    //     if (!data.status) {
    //       setMessages(messages.slice(0, -1));
    //     }
    //   })
    //   .catch(() => setMessages(messages.slice(0, -1)));
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
    socket.on("getMessage", (message) => {
      setArrivalMessage({
        text: message.text,
        senderId: message.senderId,
        timestamp: message.timestamp,
      });
    });

    return () => {
      socket.off("getMessage", (message) => {});
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
              }}
            >
              <Avatar
                variant="square"
                style={{ borderRadius: "10px", height: "56px", width: "48px" }}
                src={process.env.REACT_APP_SERVER + "/" + props.fImage}
              />
              <div style={{ margin: "0 15px" }}>
                <h4 style={{ textTransform: "capitalize" }}>{props.fName}</h4>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      margin: "4px",
                      backgroundColor: props.online.includes(props.fId)
                        ? "#37f40b"
                        : "gray",
                      borderRadius: "50%",
                      height: "10px",
                      width: "10px",
                    }}
                  />
                  <span>
                    {props.online.includes(props.fId) ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            </div>
            <Divider />

            <div
              className="custom-scroll chat-box_body"
              style={{ padding: "10px 0", flex: "100" }}
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
                        : process.env.REACT_APP_SERVER + "/" + props.fImage
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
  };
};

export default connect(mapStateToProps)(ChatBox);
