import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { Modal } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";

import Spinner from "../Spinner/Spinner";
import Button from "../Button/Button";
import SidebarRow from "./SidebarRow";
import "./Sidebar.css";

let debounceTimer;
function Sidebar(props) {
  const email = useRef();

  const [errorMsg, setErrorMsg] = useState("");
  const [friends, setFriends] = useState();
  const [selectedUser, setSelectedUser] = useState(-1);

  const [modalOpen, setModalOpen] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [addButtonLoading, setAddButtonLoading] = useState(false);

  const debounce = (func, time) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(func, time);
  };

  const addFriend = (e) => {
    e.preventDefault();
    if (!email.current.value.trim()) {
      setEmailError("Enter email");
      return;
    }

    if (emailError) return;

    setAddButtonLoading(true);

    fetch(`${process.env.REACT_APP_SERVER}/conversation/add`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: props.email,
        fEmail: email.current.value,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        setAddButtonLoading(false);
        if (!data.status) {
          setEmailError(data.message);
          return;
        }
        const result = [...friends];
        result.push({
          ...data.data.memberDetails.find((e) => e.id !== props.uid),
          conversationId: data.data._id,
        });

        setFriends(result);

        setEmailError("");
        setModalOpen(false);
        e.target.reset();
      })
      .catch(() => {
        setAddButtonLoading(false);
        setEmailError("Can't connect to server. Please retry");
      });
  };

  useEffect(() => {
    if (!props.uid) return;
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
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        BackdropProps={{ invisible: true }}
      >
        <div
          style={{
            padding: "20px",
            // background: "#fff",
            minWidth: "350px",
            width: "fit-content",
            height: "fit-content",
            outline: "none",
            margin: "5px",
            borderRadius: "10px",
          }}
          className="semi-transparent-less overlay"
        >
          <div style={{ textAlign: "end" }}>
            <CancelIcon
              onClick={() => setModalOpen(false)}
              style={{
                color: "var(--secondary-color)",
                cursor: "pointer",
              }}
            />
          </div>

          <form onSubmit={addFriend}>
            <div className="field-form-elem">
              <label>Enter your friend's Email</label>
              <input
                ref={email}
                type="text"
                onChange={(e) =>
                  debounce(() => {
                    const value = e.target.value.trim();
                    const regex =
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                    if (e.target.value.trim() === "") {
                      setEmailError("Enter email");
                    } else if (regex.test(String(value).toLowerCase())) {
                      setEmailError("");
                    } else {
                      setEmailError("Invalid Email");
                    }
                  }, 450)
                }
                placeholder="Enter email"
              />
              <small className="field-error-msg">{emailError}</small>
            </div>
            <Button
              type="submit"
              loading={addButtonLoading}
              style={{ marginLeft: "auto" }}
            >
              Add Friend
            </Button>
          </form>
        </div>
      </Modal>

      <p
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          cursor: "pointer",
          width: "fit-content",
          marginLeft: "auto",
          transform: "translateY(-5px)",
        }}
        onClick={() => setModalOpen(true)}
      >
        Add Friend{" "}
        <AddIcon
          style={{
            color: "var(--secondary-color)",
          }}
        />
      </p>

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
                    friendId: item.id,
                  });
                  setSelectedUser(i);
                }}
                online={props.online.includes(item.id)}
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
    email: state.email,
  };
};

export default connect(mapStateToProps)(Sidebar);
