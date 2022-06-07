import { Redirect, Route } from "react-router-dom";

const MsalRoute = (props: any) => {

  const token = localStorage.getItem("auth");

  if (token === "msal") {
    return <Route {...props} />;
  }

  if (token != null) {
    <Redirect to="/home" />;
  }

  return <Redirect to="/login" />;
};

export default MsalRoute;
