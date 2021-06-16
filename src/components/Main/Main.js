import React, { useState } from "react";
import { Grid } from "@material-ui/core";

import ChatBox from "../ChatBox/ChatBox";
import Sidebar from "../Sidebar/Sidebar";

function Main() {
  const [conversationId, setConversationId] = useState("");
  const [friendName, setFriendName] = useState();
  const [friendImage, setFriendImage] = useState();

  const changeChat = (data) => {
    setConversationId(data.conversationId);
    setFriendName(data.fName);
    setFriendImage(data.fImage);
  };

  return (
    <Grid
      className="App-body"
      container
      spacing={3}
      style={{ width: "100%", margin: "0", flexWrap: "nowrap" }}
    >
      <Grid item md={3} lg={3}>
        <Sidebar changeChat={changeChat} />
      </Grid>
      <Grid item md={9} lg={9}>
        <ChatBox cid={conversationId} fName={friendName} fImage={friendImage} />
      </Grid>
    </Grid>
  );
}

export default Main;
