import { useIsAuthenticated } from "@azure/msal-react";
import axios from "axios";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { Redirect, RouteComponentProps } from "react-router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { API_HOST } from "../consts";
import { SignInButton } from "../Student/student/buttons/SignInButton";

type SomeComponentProps = RouteComponentProps;
const Login: FC<SomeComponentProps> = ({ history }): JSX.Element => {
  const isAuthenticated = useIsAuthenticated();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const login = (data: any) => {
    let params = {
      email: data.email,
      password: data.password,
    };
    axios
      .post(API_HOST + "/api/account/login", params)
      .then(function (response) {
        localStorage.setItem("auth", response.data.jwt);
        history.push("/home");
      })

      .catch(function (error) {
        toast.error(error.data?.message || "Oops... something went wrong");
      });
  };

  if (localStorage.getItem("auth") === "msal") {
    return (
      <>
        <Redirect to="dashboard"></Redirect>
      </>
    );
  }

  if (isAuthenticated) {
    localStorage.setItem("auth", "msal");
    return (
      <>
        <Redirect to="dashboard"></Redirect>
      </>
    );
  }

  return (
    <>
      <div className="columns pt-6">
        <div className="column is-half is-offset-one-quarter">
          <div className="card">
            <div className="card-content">
              <h3 className="title is-size-3 has-text-weight-light has-text-centered">
                Login
              </h3>
              <form autoComplete="off" onSubmit={handleSubmit(login)}>
                <div className="field">
                  <label className="label">Email</label>
                  <div className="control">
                    <input
                      type="email"
                      className="input"
                      placeholder="Email"
                      id="exampleFormControlInput1"
                      {...register("email", { required: "Email is required!" })}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-danger" style={{ fontSize: 14 }}>
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="field">
                  <label className="label">Password</label>
                  <div className="control">
                    <input
                      type="password"
                      className="input"
                      id="exampleFormControlInput2"
                      placeholder="Password"
                      {...register("password", {
                        required: "Password is required!",
                      })}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-danger" style={{ fontSize: 14 }}>
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="field">
                  <div className="control">
                    <button className="button is-primary" type="submit">
                      Login
                    </button>
                  </div>
                </div>
              </form>
              <hr />
              <div className="is-align-items-center">
                <SignInButton></SignInButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
