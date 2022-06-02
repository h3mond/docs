import { AxiosError } from "axios";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { AlertType, setAlert } from "../actions";
import { StoreState } from "../reducers";
import { ActionTypes } from "./../actions/types";

// Normal Dispatch Action from redux require returning an action and not function
// It requires a type property which is not needed with Thunk

const catchAsync = (
  fn: (dispatch: ThunkDispatch<StoreState, void, AnyAction>) => Promise<void>
) => {
  return async (dispatch: ThunkDispatch<StoreState, void, AnyAction>) => {
    await fn(dispatch).catch((err: AxiosError) => {
      console.error(err);
      if (err.response) {
        // Log user out if deactivated --- 401 Unauthorized
        // Log out user if no session exist --- 403  Forbidden
        if (err.response.status === 401 || err.response.status === 403)
          dispatch({ type: ActionTypes.logoutUser });

        // If server down
        if (err.response.status === 500) {
          return dispatch(
            setAlert(
              "Unfortunately there's a problem in our end...",
              AlertType.error
            )
          );
        }

        const errors: any = err.response.data;
        dispatch(setAlert(errors.message, AlertType.error));
      }
    });
  };
};

export default catchAsync;
