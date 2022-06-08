import { FC } from "react";
import { Link } from "react-router-dom";
import { SignOutButton } from "../Student/student/buttons/SignOutButton";
const logo = require("../aitu-logo.png");

interface Props {
  history: any;
}

const Navbar: FC<Props> = (props) => {
  const isMsal = localStorage.getItem("auth") === "msal";
  const logout = () => {
    localStorage.clear();
    props.history.push("/login");
  };

  const toggleBurger = () => {
    let burgerIcon = document.getElementById("burger");
    let dropMenu = document.getElementById("teamList");
    let navbarBasicExample = document.getElementById("navbarBasicExample");
    burgerIcon?.classList.toggle("is-active");
    dropMenu?.classList.toggle("is-active");
    navbarBasicExample?.classList.toggle("is-active");
  };

  return (
    <nav className="bd-navbar navbar pb-6" role="navigation" aria-label="main navigation">
      <div className="navbar-brand mr-3">
        <a className="navbar-item" style={{ padding: 0 }} href="/">
          <strong>AITU</strong>
        </a>

        <a
          role="button"
          className="navbar-burger"
          id="burger"
          onClick={toggleBurger}
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <a className="navbar-item">
            <Link to="verify" className="navbar-item">Verify</Link>
          </a>
          {isMsal ? (
            <>
              <a className="navbar-item">
                <Link to="profile" className="navbar-item">Profile</Link>
              </a>
            </>
          ) : (
            <>
              <a className="navbar-item">
                <Link to="add" className="navbar-item">
                  Add document
                </Link>
              </a>
            </>
          )}
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              {isMsal ? (
                <>
                  <SignOutButton />
                </>
              ) : (
                <a className="button is-light" onClick={logout}>
                  Log out
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
