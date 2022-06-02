import React, { Component } from "react";
import { Switch } from "react-router-dom";
import { connect } from "react-redux";
import { StoreState } from "../../reducers";
import PrivateRoute from "./PrivateRoute";
import Home from "../pages/Home";
import Login from "../auth/Login";
import Dashboard from "../pages/Dashboard";
import PublicRoute from "./PublicRoute";
import Template from "../pages/Template";
import Documents from "../pages/Documents";
import {useMsal, useIsAuthenticated} from "@azure/msal-react";

interface Props extends StoreState {}

export const pubRoutesArr = [
  { name: "Home", path: "/", component: Home, nav: true }, // had to add nav:true for typescript to recognise nav property
  { name: "Login", path: "/login", component: Login },
  { name: "Templates", path: "/templates", component: Template },
  { name: "Documents", path: "/documents", component: Documents }
];

export const privRoutesArr = [
  { name: "Dashboard", path: "/dashboard", component: Dashboard },
];

class Routes extends Component<Props> {
  render() {
    const { accounts } = useMsal();
    const isAuthenticated = useIsAuthenticated();

    return (
      <Switch>
        {pubRoutesArr.map(route => (
          <PublicRoute
            key={route.name}
            // isAuthenticated={this.props.auth.isAuthenticated}
            isAuthenticated={isAuthenticated}
            exact
            path={route.path}
            component={route.component}
          />
        ))}

    {privRoutesArr.map(route => (
      <PrivateRoute
        key={route.name}
        // isAuthenticated={this.props.auth.isAuthenticated}
        isAuthenticated={isAuthenticated}
        exact
        path={route.path}
        component={route.component}
      />
    ))}
  </Switch>
    );
  }
}

const mapStateToProps = (state: StoreState) => ({
  auth: state.auth,
  users: state.users,
  alerts: state.alerts
});

export default connect(mapStateToProps)(Routes);
