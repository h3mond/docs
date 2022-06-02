import axios from "axios";
import catchAsync from "../utils/catchAsync";
import { ActionTypes } from "./types";

export interface LoginAction {
  type: ActionTypes.loginUser;
  payload: {
    jwt: string
  };
}
export interface LogoutAction {
  type: ActionTypes.logoutUser;
}

export const postLogin = (email: string, password: string) =>
  catchAsync(async (dispatch) => {
    const res = await axios.post<{ jwt: string }>(
      "/api/account/login",
      {
        email,
        password,
      }
    );

    localStorage.setItem("token", res.data.jwt);

    dispatch<LoginAction>({
      type: ActionTypes.loginUser,
      payload: res.data,
    });

    // dispatch(
    //   setAlert(
    //     `${res.data.firstName} successfully logged in`,
    //     AlertType.success
    //   )
    // );
  });

export const getLogout = () =>
  catchAsync(async (dispatch) => {
    await axios.get("/api/auth/logout");
    localStorage.removeItem("token");
    dispatch<LogoutAction>({ type: ActionTypes.logoutUser });
  });
