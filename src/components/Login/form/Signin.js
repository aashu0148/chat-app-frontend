import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import jwt from "jsonwebtoken";
import secretKey from "../../../secret";
import HideIcon from "@material-ui/icons/VisibilityOffRounded";
import ShowIcon from "@material-ui/icons/VisibilityRounded";

import Button from "../../Button/Button";
import "./form.css";

let debounceTimer;
function Signin(props) {
  const history = useHistory();

  const email = useRef();
  const password = useRef();
  const [passVisible, setPassVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [signinButtonDisabled, setSigninButtonDisabled] = useState(false);

  const [fieldError, setFieldError] = useState({
    email: "",
    password: "",
  });

  const debounce = (func, time) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(func, time);
  };

  const submission = (e) => {
    e.preventDefault();
    if (!email.current.value || !password.current.value) {
      setErrorMsg("All fields are mandetory");
      return;
    }
    if (fieldError.email || fieldError.password) {
      setErrorMsg("Invalid fields");
      return;
    }

    setErrorMsg("");
    setSigninButtonDisabled(true);

    fetch(`${process.env.REACT_APP_SERVER}/user/signin`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: email.current.value,
        password: password.current.value,
      }),
    })
      .then(async (res) => {
        setSigninButtonDisabled(false);
        const data = await res.json();
        if (!data.status) {
          setErrorMsg(data.message);
          return;
        }

        const token = jwt.sign(
          {
            email: email.current.value,
            password: password.current.value,
          },
          secretKey,
          {
            expiresIn: "6d",
          }
        );

        localStorage.setItem("chat-app", JSON.stringify(token));
        props.loginAction(data.data);
        history.push("/");
      })
      .catch((err) => {
        setSigninButtonDisabled(false);
        setErrorMsg("Error connecting to the server");
      });
  };

  return (
    <form onSubmit={submission} className="semi-transparent signin-form">
      <h1 style={{ justifyContent: "center" }}>Signin</h1>

      <div className="field-form-elem">
        <label>Email</label>
        <input
          ref={email}
          type="text"
          onChange={(e) =>
            debounce(() => {
              const value = e.target.value.trim();
              const regex =
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

              if (e.target.value.trim() === "") {
                const myFieldError = { ...fieldError };
                myFieldError.email = "Enter Email";
                setFieldError(myFieldError);
              } else if (regex.test(String(value).toLowerCase())) {
                const myFieldError = { ...fieldError };
                myFieldError.email = "";
                setFieldError(myFieldError);
              } else {
                const myFieldError = { ...fieldError };
                myFieldError.email = "Invalid Email";
                setFieldError(myFieldError);
              }
            }, 400)
          }
          placeholder="Enter email"
        />
        <small className="field-error-msg">{fieldError.email}</small>
      </div>
      <div className="field-form-elem">
        <label>Password</label>
        <div
          style={{
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            borderRadius: "5px",
            boxShadow: "-1px 2px 5px rgb(0 0 0 / 10%)",
          }}
        >
          <input
            ref={password}
            className="pass-input"
            style={{ flex: "1" }}
            type={passVisible ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e) =>
              debounce(() => {
                const value = e.target.value.trim();
                if (value === "") {
                  const myFieldError = { ...fieldError };
                  myFieldError.password = "Enter Password";
                  setFieldError(myFieldError);
                } else if (value.length > 5 && value.length < 16) {
                  const myFieldError = { ...fieldError };
                  myFieldError.password = "";
                  setFieldError(myFieldError);
                } else {
                  const myFieldError = { ...fieldError };
                  myFieldError.password = "Password should have length [6-15]";
                  setFieldError(myFieldError);
                }
              }, 500)
            }
          />
          {passVisible ? (
            <ShowIcon
              onClick={() => setPassVisible(!passVisible)}
              style={{ margin: "0 4px", cursor: "pointer" }}
            />
          ) : (
            <HideIcon
              onClick={() => setPassVisible(!passVisible)}
              style={{ margin: "0 4px", cursor: "pointer" }}
            />
          )}
        </div>
        <small className="field-error-msg">{fieldError.password}</small>
      </div>

      <div>
        <small className="field-error-msg">{errorMsg}</small>
      </div>
      <Button
        disabled={signinButtonDisabled}
        type="submit"
        style={{ fontSize: "1rem" }}
      >
        Sign in
      </Button>
      <p className="signin_footer-text">
        New here? &nbsp;
        <span
          onClick={() => {
            props.changeForm("signup");
          }}
          style={{ cursor: "pointer", color: "var(--secondary-color)" }}
        >
          Sign up
        </span>
      </p>
    </form>
  );
}

const mapStateToProps = (state) => {
  return {};
};
const mapDispatchToProps = (dispatch) => {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
