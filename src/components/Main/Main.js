import React from "react";
import { Grid } from "@material-ui/core";

import ChatBox from "../ChatBox/ChatBox";
import Sidebar from "../Sidebar/Sidebar";

function Main() {
  return (
    <Grid
      className="App-body"
      container
      spacing={3}
      style={{ width: "100%", margin: "0", flexWrap: "nowrap" }}
    >
      <Grid item md={3} lg={3}>
        <Sidebar />
      </Grid>
      <Grid item md={9} lg={9}>
        <ChatBox />
      </Grid>
    </Grid>
  );
}

export default Main;
