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
function Signup(props) {
  const history = useHistory();

  const name = useRef();
  const email = useRef();
  const password = useRef();
  const [passVisible, setPassVisible] = useState(false);
  const [file, setFile] = useState();
  const [errorMsg, setErrorMsg] = useState("");
  const [signupButtonDisabled, setSignupButtonDisabled] = useState(false);

  const [fieldError, setFieldError] = useState({
    name: "",
    email: "",
    password: "",
    image: "",
  });

  const validateImage = (file) => {
    if (!file) {
      const myFieldError = { ...fieldError };
      myFieldError["image"] = "Select image";
      setFieldError(myFieldError);
      return;
    }
    const fileSize = file.size / 1024 / 1024;
    const fileType = file.type;

    if (!fileType.includes("image")) {
      const myFieldError = { ...fieldError };
      myFieldError["image"] = "File must be image only";
      setFieldError(myFieldError);
      return;
    }
    if (fileSize > 6) {
      const myFieldError = { ...fieldError };
      myFieldError["image"] = "Image must be smaller than 6MB";
      setFieldError(myFieldError);
      return;
    }

    const myFieldError = { ...fieldError };
    myFieldError["image"] = "";
    setFieldError(myFieldError);

    setFile(file);
  };

  const debounce = (func, time) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(func, time);
  };

  const submission = (e) => {
    e.preventDefault();
    if (
      !name.current.value ||
      !email.current.value ||
      !password.current.value ||
      !file
    ) {
      setErrorMsg("All fields are mandetory");
      return;
    }
    if (fieldError.name || fieldError.email || fieldError.password) {
      setErrorMsg("Invalid fields");
      return;
    }

    setErrorMsg("");
    setSignupButtonDisabled(true);

    const formData = new FormData();

    formData.append("name", name.current.value);
    formData.append("email", email.current.value.toLowerCase());
    formData.append("password", password.current.value);
    formData.append("image", file);

    fetch(`${process.env.REACT_APP_SERVER}/user/signup`, {
      method: "POST",
      body: formData,
    })
      .then(async (res) => {
        setSignupButtonDisabled(false);
        const data = await res.json();
        if (!data.status) {
          setErrorMsg(data.message);
          return;
        }

        const token = jwt.sign(
          {
            email: email.current.value.toLowerCase(),
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
        setSignupButtonDisabled(false);
        setErrorMsg("Error connecting to the server");
      });
  };

  return (
    <form onSubmit={submission} className="semi-transparent signup-form">
      <h1 style={{ justifyContent: "center" }}>Signup</h1>
      <div className="field-form-elem">
        <label>Name</label>
        <input
          ref={name}
          type="text"
          onChange={(e) =>
            debounce(() => {
              const value = e.target.value.trim();
              if (!value) {
                const myFieldError = { ...fieldError };
                myFieldError.name = "Enter value";
                setFieldError(myFieldError);
                return;
              }
              const myFieldError = { ...fieldError };
              myFieldError.name = "";
              setFieldError(myFieldError);
            }, 400)
          }
          placeholder="Enter name"
        />
        <small className="field-error-msg">{fieldError.name}</small>
      </div>
      <div className="field-form-elem">
        <label>Profile Image</label>
        <input
          style={{ width: "330px" }}
          type="file"
          accept=".png , .jpg , .jpeg"
          onChange={(e) => validateImage(e.target.files[0])}
        />
        <small className="field-error-msg">{fieldError.image}</small>
      </div>
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
                const regex = /^(?=.*\d)(?=.*[a-z]).{6,15}$/;
                if (value === "") {
                  const myFieldError = { ...fieldError };
                  myFieldError.password = "Enter Password";
                  setFieldError(myFieldError);
                } else if (regex.test(value)) {
                  const myFieldError = { ...fieldError };
                  myFieldError.password = "";
                  setFieldError(myFieldError);
                } else {
                  const myFieldError = { ...fieldError };
                  myFieldError.password =
                    "Password should have [a-z] && [0-9] with length [6-15]";
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
        disabled={signupButtonDisabled}
        type="submit"
        style={{ fontSize: "1rem" }}
      >
        Sign up
      </Button>
      <p className="signin_footer-text">
        Already a member
        <span
          onClick={() => {
            props.changeForm("signin");
          }}
          style={{ cursor: "pointer", color: "var(--secondary-color)" }}
        >
          {" "}
          Sign in
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

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
