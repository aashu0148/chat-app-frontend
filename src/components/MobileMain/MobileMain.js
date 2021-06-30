import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";

import MobileChatBox from "../MobileChatBox/MobileChatBox";
import Sidebar from "../Sidebar/Sidebar";

function MobileMain(props) {
  const history = useHistory();

  const [conversationId, setConversationId] = useState("");
  const [friend, setFriend] = useState();
  const [online, setOnline] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const changeChat = (data) => {
    history.push("chatbox");
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
    history.listen((location, action) => {
      if (location.pathname.includes("chatbox")) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    });

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
      spacing={sidebarOpen ? 3 : 0}
      style={{ margin: "0", flexWrap: "nowrap", width: "100%" }}
    >
      <Grid item xs={12} sm={12}>
        {sidebarOpen ? (
          <Sidebar changeChat={changeChat} online={online} />
        ) : (
          <MobileChatBox cid={conversationId} online={online} friend={friend} />
        )}
      </Grid>
      {/* <Grid item md={9} lg={9} style={{ width: "100%" }}>
      </Grid> */}
    </Grid>
  );
}

const mapStateToProps = (state) => {
  return {
    uid: state.id,
    socket: state.socket,
  };
};

export default connect(mapStateToProps)(MobileMain);
