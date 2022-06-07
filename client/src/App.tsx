import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { Route, Switch } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";
import MsalRoute from "./Auth/MsalRoute";
import PrivateRoute from "./Auth/PrivateRoute";
import RestrictedRoute from "./Auth/RestrictedRoute";
import AddPage from "./Components/Add";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Main from "./Components/Main";
import SignUp from "./Components/SignUp";
import Dashboard from "./Student/student/pages/Dashboard";
import Profile from "./Student/student/pages/Profile";
import Show from "./Student/student/pages/Show";
import Verify from "./Student/student/pages/Verify";

function App() {
  const { accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  return (
    <div className="container pt-3">
      <Switch>
        <Route exact path="/" component={Main} />
        <Route exact path="/verify" component={Verify} />
        <MsalRoute exact path="/dashboard" component={Dashboard} />
        <MsalRoute exact path="/profile" component={Profile} />
        <MsalRoute exact path="/show/:documentId" component={Show} />
        <PrivateRoute exact path="/home" component={Home} />
        <PrivateRoute exact path="/add" component={AddPage} />
        <RestrictedRoute exact path="/login" component={Login} />
        <Route exact path="/register" component={SignUp} />
      </Switch>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        theme="colored"
        limit={1}
        transition={Flip}
      />
    </div>
  );
}

export default App;
