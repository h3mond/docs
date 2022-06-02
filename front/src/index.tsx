import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { msalConfig } from "./authConfig";
import store from "./store";

const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </Router>
  </Provider>,
  document.getElementById("root")
);
