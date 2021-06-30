import React, { useState } from "react";
import { Grid } from "@material-ui/core";

import Signin from "../Login/form/Signin";
import Signup from "../Login/form/Signup";

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
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        style={{ textAlign: "center" }}
      >
        {form}
      </Grid>
    </Grid>
  );
}

export default Login;
