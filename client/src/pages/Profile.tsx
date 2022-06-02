import { UnauthenticatedTemplate, AuthenticatedTemplate } from "@azure/msal-react";
import {Navigate} from "react-router-dom";

function Profile(props: any) {

  return (
    <>
      <AuthenticatedTemplate>
        <Navigate to="documents" />
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <h5 className="card-title">Please sign-in.</h5>
      </UnauthenticatedTemplate>
    </>
  );
}

export default Profile;

