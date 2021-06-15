import React from "react";
import { Avatar, Divider } from "@material-ui/core";
import AttachIcon from "@material-ui/icons/AttachFileRounded";

import Button from "../Button/Button";
import ChatMessage from "./ChatMessage";
import "./ChatBox.css";

function ChatBox(props) {
  return (
    <div
      className="chat-box semi-transparent"
      style={{ borderRadius: "10px", padding: "10px" }}
    >
      <div
        style={{ display: "flex", alignItems: "center", paddingBottom: "10px" }}
      >
        <Avatar
          variant="square"
          style={{ borderRadius: "10px", height: "56px", width: "48px" }}
          src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzV8fHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=400&q=60"
        />
        <div style={{ margin: "0 15px" }}>
          <h4>Alissa cartheny</h4>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                margin: "4px",
                backgroundColor: props.online ? "#37f40b" : "gray",
                borderRadius: "50%",
                height: "10px",
                width: "10px",
              }}
            />
            <span>{props.online ? "Online" : "Offline"}</span>
          </div>
        </div>
      </div>
      <Divider />

      <div
        className="custom-scroll chat-box_body"
        style={{ padding: "10px 0", flex: "100" }}
      >
        <ChatMessage
          image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzV8fHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=400&q=60"
          message="Hi! there how are you?"
        />
        <ChatMessage
          image="https://cdn.pixabay.com/photo/2016/03/08/23/45/girl-1245085__340.jpg"
          message=" Ya I'm perfectly fine what about you? It's been a while since we
        met."
          sender
        />
        <ChatMessage
          image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzV8fHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=400&q=60"
          message="I'm also doing good. Currently chilling out at rooftop. hjv yu weyu
          hjv cuwdv cbcv uydg czx yg giuy sdtzufu dsggvef fxhzcfwgfjhvcnb
          zviuygogsjgcv hsvog wgf jwevf ywgfhgsdvcjg sfyuwf I'm also doing
          good. Currently chilling out at rooftop. hjv yu weyu hjv cuwdv cbcv
          uydg czx yg giuy sdtzufu dsggvef fxhzcfwgfjhvcnb zviuygogsjgcv hsvog
          wgf jwevf ywgfhgsdvcjg sfyuwf I'm also doing good. Currently
          chilling out at rooftop. hjv yu weyu hjv cuwdv cbcv uydg czx yg giuy
          sdtzufu dsggvef fxhzcfwgfjhvcnb zviuygogsjgcv hsvog wgf jwevf
          ywgfhgsdvcjg sfyuwf I'm also doing good. Currently chilling out at
          rooftop. hjv yu weyu hjv cuwdv cbcv uydg czx yg giuy sdtzufu dsggvef
          fxhzcfwgfjhvcnb zviuygogsjgcv hsvog wgf jwevf ywgfhgsdvcjg sfyuwf
          I'm also doing "
        />
        <ChatMessage
          image="https://cdn.pixabay.com/photo/2016/03/08/23/45/girl-1245085__340.jpg"
          message=" Ya I'm perfectly fine what about you? It's been a while since we
        met."
          sender
        />
        <ChatMessage
          image="https://cdn.pixabay.com/photo/2016/03/08/23/45/girl-1245085__340.jpg"
          message="bhasdqwdb qhw ikq ciu ciuV CT E3GY GFF GA  ACD A C H CK JWE "
          sender
        />

        <ChatMessage
          image="https://cdn.pixabay.com/photo/2016/03/08/23/45/girl-1245085__340.jpg"
          message="asd asd hduoid biuqddqw d qjkwd iq wduia dut."
          sender
        />
      </div>

      <Divider />
      <div
        style={{ paddingTop: "10px", display: "flex", alignItems: "center" }}
      >
        <AttachIcon style={{ margin: "0 5px" }} />
        <input
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
        <Button style={{ margin: "0 10px" }}>Send</Button>
      </div>
    </div>
  );
}

export default ChatBox;
