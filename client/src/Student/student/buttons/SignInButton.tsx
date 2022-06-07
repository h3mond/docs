import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../../authConfig";

export const SignInButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance
      .loginRedirect(loginRequest)
      .then((resp) => {
        console.log("Resp", resp);
      })
      .catch((e) => {
        console.error("Error", e);
      });
  };

  return (
    <>
      <button className="bsk-btn bsk-btn-default" onClick={handleLogin}>
        <object
          type="image/svg+xml"
          data="https://s3-eu-west-1.amazonaws.com/cdn-testing.web.bas.ac.uk/scratch/bas-style-kit/ms-pictogram/ms-pictogram.svg"
          className="x-icon"
        ></object>
        Sign in with Microsoft
      </button>
    </>
  );
};
