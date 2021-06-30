import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";

import ChatBox from "../ChatBox/ChatBox";
import Sidebar from "../Sidebar/Sidebar";

function Main(props) {
  const [conversationId, setConversationId] = useState("");
  const [friend, setFriend] = useState();
  const [online, setOnline] = useState([]);

  const changeChat = (data) => {
    setConversationId(data.conversationId);
    const myFriend = {
      id: data.fId,
      email: data.fEmail,
      name: data.fName,
      image: data.fImage,
    };
    setFriend(myFriend);
  };

  useEffect(() => {
    props.socket.emit("user-connected", props.uid);

    props.socket.on("get-online-users", (users) => {
      setOnline(users);
    });

    return () => {
      props.socket.off("get-online-users", (users) => {});
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Grid
      className="App-body"
      container
      spacing={3}
      style={{ margin: "0", flexWrap: "nowrap", width: "100%" }}
    >
      <Grid item md={3} lg={3}>
        <Sidebar changeChat={changeChat} online={online} />
      </Grid>
      <Grid item md={9} lg={9}>
        <ChatBox cid={conversationId} online={online} friend={friend} />
      </Grid>
    </Grid>
  );
}

const mapStateToProps = (state) => {
  return {
    uid: state.id,
    socket: state.socket,
  };
};

export default connect(mapStateToProps)(Main);
