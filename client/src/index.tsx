import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { BrowserRouter } from "react-router-dom";
import { msalConfig } from "./authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
