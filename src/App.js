import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import jwt from "jsonwebtoken";
import secretKey from "./secret";

import Navbar from "./components/Navbar/Navbar";
import Main from "./components/Main/Main";
import Login from "./components/Login/Login";
import Spinner from "./components/Spinner/Spinner";
import "./App.css";

function App(props) {
  const jwtToken = JSON.parse(localStorage.getItem("chat-app")) || "";

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
    <div className="App semi-transparent">
      {props.preloading ? (
        <Spinner />
      ) : (
        <Router>
          <Switch>
            <Route path="/login">
              {props.auth ? <Redirect to="/" /> : <Login />}
            </Route>
            <Route path="/">
              {props.auth ? (
                <>
                  <Navbar />
                  <Main />
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadedAction: () => dispatch({ type: "LOADED" }),
    loginAction: (data) =>
      dispatch({
        type: "LOGIN",
        name: data.name,
        email: data.email,
        id: data._id,
        image: data.image,
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
