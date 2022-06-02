import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const msalInstance = new PublicClientApplication(msalConfig);

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MsalProvider instance={msalInstance}>
        <ThemeProvider theme={darkTheme}>
          <App />
        </ThemeProvider>
      </MsalProvider>
    </BrowserRouter>
  </React.StrictMode>
);
