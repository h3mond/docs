import { ActionTypes, AuthActions, IUser } from "../actions";
export interface AuthState {
  currentUser: IUser | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
};

export const authReducer = (state = initialState, action: AuthActions) => {
  switch (action.type) {
    case ActionTypes.loginUser:
    default:
      return state;
  }
};
