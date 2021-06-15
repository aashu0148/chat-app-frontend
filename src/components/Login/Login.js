import React, { useState } from "react";
import { Grid } from "@material-ui/core";

import Signin from "./form/Signin";
import Signup from "./form/Signup";
import loginSvg from "../../assets/login.svg";

function Login() {
  const changeForm = (form) => {
    switch (form) {
      case "signin":
        setForm(<Signin changeForm={changeForm} />);
        break;
      case "signup":
        setForm(<Signup changeForm={changeForm} />);
        break;
      default:
        setForm(<Signin changeForm={changeForm} />);
        break;
    }
  };

  const [form, setForm] = useState(<Signin changeForm={changeForm} />);

  return (
    <Grid
      container
      spacing={2}
      style={{ width: "100%", margin: "0", flex: "1" }}
      justify="center"
      alignItems="center"
    >
      <Grid item xs={6} sm={6} md={6} lg={6} style={{ textAlign: "center" }}>
        <img
          src={loginSvg}
          alt="login SVG"
          style={{ width: "70%", margin: "0 auto" }}
        />
      </Grid>
      <Grid item xs={6} sm={6} md={6} lg={6} style={{ textAlign: "center" }}>
        {form}
      </Grid>
    </Grid>
  );
}

export default Login;
