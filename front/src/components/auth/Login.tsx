import React, { Component } from "react";
import { connect } from "react-redux";
import { RouterProps } from "react-router";
import { postLogin } from "../../actions";
import { StoreState } from "../../reducers";
import Spinner from "../utils/Spinner/Spinner";

interface Props extends StoreState, RouterProps {
  postLogin: (email: string, password: string) => Promise<void>;
}
interface State {
  email: string;
  password: string;
  loading: boolean;
  pathname: string;
}

class Login extends Component<Props, State> {
  state = {
    email: "",
    password: "",
    loading: false,
    pathname: this.props.history.location.pathname,
  };

  handleChange = (e: { target: HTMLInputElement }) => {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = this.state;
    // Set loading to true which adds spinner
    this.setState({ loading: true });

    // Login user
    this.props.postLogin(email, password).then(() => {
      // Refresh form if authentication fails
      // isAuthenticated is only updated after updating the store's state
      // This callback is called straight after the action which is before the latter
      if (this.props.history.location.pathname === this.state.pathname)
        this.setState({ email: "", password: "", loading: false });
    });
  };

  render() {
    return (
      <div className="columns">
        <div className="column is-half is-offset-one-quarter">
          <h1 className="title">Login page</h1>
          {this.state.loading ? (
            <Spinner />
          ) : (
            <>
              <form onSubmit={this.handleSubmit}>
                <div className="field">
                  <label className="label">Email</label>
                  <div className="control">
                    <input
                      type="email"
                      name="email"
                      className="input"
                      value={this.state.email}
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Password</label>
                  <div className="control">
                    <input
                      type="password"
                      name="password"
                      className="input"
                      value={this.state.password}
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <div className="control">
                    <button className="button">Login</button>
                  </div>
                </div>
              </form>
              <hr />
              <p className="text center">Continue with Microsoft</p>
            </>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: StoreState) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { postLogin })(Login);
