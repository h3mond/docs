import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import Button from '@mui/material/Button';

export const SignInButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch(e => {
      console.log(e);
    });
  }

  return (
    <Button color="inherit" onClick={() => handleLogin()}>Sign In</Button>
  )
}

