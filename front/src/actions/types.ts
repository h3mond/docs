import { ResetAlertAction, SetAlertAction } from "./alerts";
import {
  LoginAction,
  LogoutAction,
} from "./auth";

export enum ActionTypes {
  // unique val
  // KEY[0] = 0,
  // KEY[1] = 1
  // Added initializer for redux devtools
  alert = "ALERT",
  resetAlert = "RESET_ALERT",
  loginUser = "LOGIN_USER",
  logoutUser = "LOGOUT_USER",
}

// export type UserActions = ;
export type AuthActions =
  | LoginAction
  | LogoutAction
export type AlertActions = SetAlertAction | ResetAlertAction;
