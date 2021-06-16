import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import SearchIcon from "@material-ui/icons/Search";

import Spinner from "../Spinner/Spinner";
import SidebarRow from "./SidebarRow";
import "./Sidebar.css";

function Sidebar(props) {
  const [errorMsg, setErrorMsg] = useState("");
  const [friends, setFriends] = useState();
  const [selectedUser, setSelectedUser] = useState(-1);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER}/conversation/friends/${props.uid}`)
      .then(async (res) => {
        const data = await res.json();
        if (!data.status) {
          setErrorMsg(data.message);
          return;
        }

        if (data.data.length === 0) {
          setFriends(<p>No Friends found</p>);
          return;
        }
        const result = data.data.map((item) => {
          return {
            ...item.memberDetails.find((e) => e.id !== props.uid),
            conversationId: item._id,
          };
        });
        setFriends(result);
      })
      .catch(() => {
        setErrorMsg("Error connecting to Server");
      });
  }, [props.uid]); // eslint-disable-line react-hooks/exhaustive-deps

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
      {!friends ? (
        errorMsg ? (
          <small className="field-error-msg" style={{ fontSize: "1rem" }}>
            {errorMsg}
          </small>
        ) : (
          <Spinner />
        )
      ) : (
        <>
          <div
            className="sidebar_search"
            style={{ margin: "auto auto 20px auto" }}
          >
            <SearchIcon style={{ cursor: "pointer", color: "#afacad" }} />
            <input type="text" placeholder="Search here" />
          </div>
          <div className="sidebar-body custom-scroll">
            {friends.map((item, i) => (
              <SidebarRow
                key={i}
                active={selectedUser === i}
                onClick={() => {
                  props.changeChat({
                    conversationId: item.conversationId,
                    fName: item.name,
                    fImage: item.image,
                  });
                  setSelectedUser(i);
                }}
                // online
                name={item.name}
                message="This is the message"
                image={process.env.REACT_APP_SERVER + "/" + item.image}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    uid: state.id,
  };
};

export default connect(mapStateToProps)(Sidebar);
