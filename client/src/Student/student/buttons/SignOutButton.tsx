import { useMsal } from "@azure/msal-react";

export const SignOutButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    localStorage.clear();
    instance.logoutRedirect({
      postLogoutRedirectUri: "/",
    })
    .catch(err => {
      console.error('Error', err);
    })
  };

  return (
    <button className="button is-light" onClick={handleLogin}>
      Sign Out
    </button>
  );
};
