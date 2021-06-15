import React from "react";
import SearchIcon from "@material-ui/icons/Search";

import "./Sidebar.css";
import SidebarRow from "./SidebarRow";

function Sidebar() {
  return (
    <div
      className="semi-transparent"
      style={{
        borderRadius: "10px",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div className="sidebar_search" style={{ margin: "auto auto 20px auto" }}>
        <SearchIcon style={{ cursor: "pointer", color: "#afacad" }} />
        <input type="text" placeholder="Search here" />
      </div>
      <div className="sidebar-body custom-scroll">
        <SidebarRow
          active
          name="Algelina carthush jh jh jh jh jh jh jh  iu"
          message="This is the message"
          online
          image="https://cdn.pixabay.com/photo/2015/09/02/12/39/woman-918583__340.jpg"
        />
        <SidebarRow
          name="Algelina carthus"
          message="This is the last message in the chat"
        />
        <SidebarRow
          name="Algelina carthus"
          message="This is the last message in the chat"
          online
          image="https://cdn.pixabay.com/photo/2014/10/06/17/30/child-476507__340.jpg"
        />
        <SidebarRow
          name="Algelina carthush jh jh jh jh jh jh jh  iu"
          message="This is the message"
          online
          image="https://cdn.pixabay.com/photo/2015/09/02/12/39/woman-918583__340.jpg"
        />
        <SidebarRow
          name="Algelina carthus"
          message="This is the last message in the chat"
        />
        <SidebarRow
          name="Algelina carthus"
          message="This is the last message in the chat"
          online
          image="https://cdn.pixabay.com/photo/2014/10/06/17/30/child-476507__340.jpg"
        />
        <SidebarRow
          name="Algelina carthush jh jh jh jh jh jh jh  iu"
          message="This is the message"
          online
          image="https://cdn.pixabay.com/photo/2015/09/02/12/39/woman-918583__340.jpg"
        />
      </div>
    </div>
  );
}

export default Sidebar;
