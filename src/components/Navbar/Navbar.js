import React from "react";
import { connect } from "react-redux";
import { Grid, Avatar } from "@material-ui/core";
import ExitIcon from "@material-ui/icons/ExitToAppRounded";

import "./Navbar.css";

function Navbar(props) {
  return (
    <Grid
      container
      className="navbar"
      spacing={3}
      style={{ width: "100%", margin: "0" }}
      alignItems="center"
    >
      <Grid item xs={3} sm={3} md={3} lg={3}>
        <h1 style={{ color: "var(--primary-color)" }}>Taki</h1>
      </Grid>
      <Grid
        item
        xs={9}
        sm={9}
        md={9}
        lg={9}
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <p>Welcome {props.name}</p>
        <Avatar
          style={{ height: "32px", width: "32px" }}
          src={`${process.env.REACT_APP_SERVER}/${props.image}`}
        />
        <ExitIcon
          style={{
            color: "var(--secondary-color)",
            cursor: "pointer",
            marginLeft: "15px",
          }}
          onClick={props.logoutAction}
        />
      </Grid>
    </Grid>
  );
}

const mapStateToProps = (state) => {
  return {
    name: state.name,
    image: state.image,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    logoutAction: () => dispatch({ type: "LOGOUT" }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
