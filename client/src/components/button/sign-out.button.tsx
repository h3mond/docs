import { useMsal } from "@azure/msal-react";
import Button from "@mui/material/Button";

export const SignOutButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: "/",
    });
  };

  return <Button color="inherit" onClick={() => handleLogin()}>Sign Out</Button>;
};
