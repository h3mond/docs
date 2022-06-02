import React, { Component } from "react";
// import { Route, Redirect, withRouter } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Routes from "./components/routing/Routes";
import Alerts from "./components/utils/Alerts";

class App extends Component {
  state = {};

  render() {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto">
          <Alerts />
          <Routes />
        </div>
      </div>
    );
  }
}

export default App;
