import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import openWebSocket from "socket.io-client";
import { Grid } from "@material-ui/core";

import ChatBox from "../ChatBox/ChatBox";
import Sidebar from "../Sidebar/Sidebar";

const socket = openWebSocket.connect(process.env.REACT_APP_SERVER);

function Main(props) {
  const [conversationId, setConversationId] = useState("");
  const [friendName, setFriendName] = useState();
  const [friendImage, setFriendImage] = useState();
  const [friendId, setFriendId] = useState();
  const [online, setOnline] = useState([]);

  const changeChat = (data) => {
    setConversationId(data.conversationId);
    setFriendName(data.fName);
    setFriendImage(data.fImage);
    setFriendId(data.friendId);
  };

  useEffect(() => {
    socket.emit("user-connected", props.uid);

    socket.on("get-online-users", (users) => {
      setOnline(users);
    });

    return () => {
      socket.off("get-online-users", (users) => {});
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Grid
      className="App-body"
      container
      spacing={3}
      style={{ width: "100%", margin: "0", flexWrap: "nowrap" }}
    >
      <Grid item md={3} lg={3}>
        <Sidebar changeChat={changeChat} online={online} />
      </Grid>
      <Grid item md={9} lg={9}>
        <ChatBox
          cid={conversationId}
          online={online}
          fName={friendName}
          fImage={friendImage}
          fId={friendId}
        />
      </Grid>
    </Grid>
  );
}

const mapStateToProps = (state) => {
  return {
    uid: state.id,
  };
};

export default connect(mapStateToProps)(Main);
