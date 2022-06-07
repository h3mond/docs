import React from "react";
import { Redirect, Route } from "react-router-dom";

const PrivateRoute = (props:any) => {
  // const isAuth  = false

  const token = localStorage.getItem("auth");

  return <>{token && token !== "msal" ? <Route {...props} /> : <Redirect to="/login" />}</>;
};

export default PrivateRoute;
