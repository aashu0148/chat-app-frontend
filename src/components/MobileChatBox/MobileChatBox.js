import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Avatar, Divider } from "@material-ui/core";
import AttachIcon from "@material-ui/icons/AttachFileRounded";
import CancelIcon from "@material-ui/icons/Cancel";
import BackIcon from "@material-ui/icons/KeyboardBackspace";

import Button from "../Button/Button";
import ChatMessage from "../ChatBox/ChatMessage";
import Spinner from "../Spinner/Spinner";

function MobileChatBox(props) {
  const history = useHistory();
  const input = useRef();
  const messageRef = useRef(null);

  const [headerOpen, setHeaderOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [messages, setMessages] = useState();
  const [arrivalMessage, setArrivalMessage] = useState();

  useEffect(() => {
    setMessages("");
    if (!props.cid) {
      history.goBack();
      return;
    }
    setHeaderOpen(false);
    fetch(`${process.env.REACT_APP_SERVER}/message/${props.cid}`)
      .then(async (res) => {
        const data = await res.json();
        if (!data.status) {
          setErrorMsg(data.message);
          return;
        }
        setErrorMsg("");

        const myMessages = data.data.messages;

        const index = props.messages.findIndex(
          (e) => e.conversationId === props.cid
        );

        if (index > -1) {
          myMessages.push(...props.messages[index].messages);
        }

        setMessages(myMessages);
        messageRef?.current?.scrollIntoView();
      })
      .catch(() => {
        setErrorMsg("Error connecting to server");
      });
  }, [props.cid]); // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.current.value.trim()) {
      return;
    }

    props.socket.emit("sendMessage", {
      conversationId: props.cid,
      senderId: props.uid,
      friendId: props.friend.id,
      text: input.current.value,
    });

    const myMessages = [...messages];
    myMessages.push({
      senderId: props.uid,
      text: input.current.value,
      timestamp: Date.now(),
    });
    setMessages(myMessages);
    setTimeout(
      () => messageRef?.current?.scrollIntoView({ behavior: "smooth" }),
      0
    );

    input.current.value = "";
    input.current.focus();
  };

  useEffect(() => {
    if (!messages) return;

    props.storeMessageAction({
      conversationId: arrivalMessage.conversationId,
      message: {
        text: arrivalMessage.text,
        senderId: arrivalMessage.senderId,
        timestamp: arrivalMessage.timestamp,
      },
    });

    if (
      arrivalMessage.senderId === props.uid ||
      arrivalMessage.senderId !== props.friend.id
    )
      return;

    const myMessages = [...messages];
    myMessages.push({
      text: arrivalMessage.text,
      senderId: arrivalMessage.senderId,
      timestamp: arrivalMessage.timestamp,
    });
    setMessages(myMessages);
    setTimeout(
      () => messageRef?.current?.scrollIntoView({ behavior: "smooth" }),
      0
    );
  }, [arrivalMessage]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    props.socket.on("getMessage", (message) => {
      setArrivalMessage(message);
    });
    
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="chat-box semi-transparent" style={{ padding: "10px" }}>
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
                flexDirection: headerOpen ? "column" : "row",
              }}
              className={headerOpen ? "expanded-header" : ""}
            >
              {headerOpen ? (
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
              ) : (
                <div style={{ margin: "0 10px" }}>
                  <BackIcon onClick={() => history.goBack()} />
                </div>
              )}

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
    messages: state.messages,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    storeMessageAction: (data) =>
      dispatch({
        type: "STORE_MESSAGE",
        message: data.message,
        conversationId: data.conversationId,
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileChatBox);
