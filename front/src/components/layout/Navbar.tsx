import React, { Component } from "react";
import { connect } from "react-redux";
import { getLogout } from "../../actions";
import { StoreState } from "../../reducers";
import { privRoutesArr, pubRoutesArr } from "../routing/Routes";

interface Props extends StoreState {
  getLogout: () => Promise<void>;
}

class Navbar extends Component<Props> {
  render() {
    // const publicRoute = pubRoutesArr.filter((route) => route.nav !== false);
    // const privateRoute = privRoutesArr.filter((route) => route.nav !== false);

    /**
     *
             {!isAuthenticated
          ? publicRoute.map((route) => (
            <li key={route.name}>
              <Link to={route.path}>{route.name}</Link>
            </li>
            ))
          : privateRoute.map((route) => (
            <li key={route.name}>
              <Link to={route.path}>{route.name}</Link>
            </li>
            ))}
        {isAuthenticated && (
          <li>
            <Link to={"/login"} onClick={this.props.getLogout}>
              Logout
            </Link>
          </li>
        )}
     */

    const { isAuthenticated } = this.props.auth;
    return (
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            <a className="navbar-item">Home</a>

            <a className="navbar-item">Documentation</a>

            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">More</a>

              <div className="navbar-dropdown">
                <a className="navbar-item">About</a>
                <a className="navbar-item">Jobs</a>
                <a className="navbar-item">Contact</a>
                <hr className="navbar-divider" />
                <a className="navbar-item">Report an issue</a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state: StoreState) => ({
  auth: state.auth,
  users: state.users,
  alerts: state.alerts,
});

export default connect(mapStateToProps, { getLogout })(Navbar);
