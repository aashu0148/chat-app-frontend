import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import jwt from "jsonwebtoken";
import secretKey from "./secret";
import openWebSocket from "socket.io-client";

import Navbar from "./components/Navbar/Navbar";
import Main from "./components/Main/Main";
import MobileMain from "./components/MobileMain/MobileMain";
import Login from "./components/Login/Login";
import MobileLogin from "./components/MobileLogin/MobileLogin";
import Spinner from "./components/Spinner/Spinner";
import "./App.css";

const socket = openWebSocket.connect(process.env.REACT_APP_SERVER);

let viewTimer;
function App(props) {
  const [mobileView, setMobileView] = useState(window.outerWidth < 850);

  const changeView = () => {
    clearTimeout(viewTimer);
    viewTimer = setTimeout(() => {
      setMobileView(window.outerWidth < 850);
    }, 400);
  };

  useEffect(() => {
    props.mobileViewAction(mobileView);
  }, [mobileView]); // eslint-disable-line react-hooks/exhaustive-deps

  const jwtToken = JSON.parse(localStorage.getItem("chat-app")) || "";

  useEffect(() => {
    window.addEventListener("resize", changeView);
    props.setSocketAction(socket);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!jwtToken) {
      props.loadedAction();
    } else {
      jwt.verify(jwtToken, secretKey, (err, data) => {
        if (err) {
          props.loadedAction();
          return;
        }
        fetch(`${process.env.REACT_APP_SERVER}/user/token-signin`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            token: jwtToken,
          }),
        })
          .then(async (res) => {
            const data = await res.json();
            setTimeout(() => {
              props.loadedAction();
            }, 300);

            if (!data.status) {
              return;
            }

            props.loginAction({
              name: data.data.name,
              email: data.data.email,
              id: data.data._id,
              image: data.data.image,
            });
          })
          .catch(() => {
            props.loadedAction();
          });
      });
    }
  }, [jwtToken]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={
        props.mobileView
          ? { width: "100vw", height: "100vh", borderRadius: "2px" }
          : { width: "1120px", margin: "10px", height: "570px" }
      }
      className="App semi-transparent"
    >
      {props.preloading ? (
        <Spinner />
      ) : (
        <Router>
          <Switch>
            <Route path="/login">
              {props.auth ? (
                <Redirect to="/" />
              ) : props.mobileView ? (
                <MobileLogin />
              ) : (
                <Login />
              )}
            </Route>
            <Route path="/">
              {props.auth ? (
                <>
                  <Navbar />
                  {props.mobileView ? <MobileMain /> : <Main />}
                </>
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
          </Switch>
        </Router>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    preloading: state.preloading,
    mobileView: state.mobileView,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    mobileViewAction: (view) =>
      dispatch({ type: "MOBILE_VIEW", mobileView: view }),
    loadedAction: () => dispatch({ type: "LOADED" }),
    loginAction: (data) =>
      dispatch({
        type: "LOGIN",
        name: data.name,
        email: data.email,
        id: data.id,
        image: data.image,
      }),
    setSocketAction: (socket) => dispatch({ type: "SOCKET", socket }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
