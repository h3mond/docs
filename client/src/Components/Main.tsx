import { UnauthenticatedTemplate, AuthenticatedTemplate, useIsAuthenticated } from "@azure/msal-react";
import {Redirect} from "react-router-dom";

function Main(props: any) {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated) {
    localStorage.setItem("auth", "msal");
  }

  return (
    <>
      <AuthenticatedTemplate>
        <Redirect to="dashboard" />
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <Redirect to="login" />
      </UnauthenticatedTemplate>
    </>
  );
}

export default Main;

