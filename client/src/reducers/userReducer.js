import {
  SIGNUP_USER,
  LOGIN_USER
} from './../actions/types';

const initialState = {
  user: null
};

export default function (state = initialState, actions) {
  switch (actions.type) {
    case SIGNUP_USER:
      return {
        ...state,
        user: actions.payload
      };
    case LOGIN_USER:
      return {
        ...state,
        user: actions.payload
      };
    default:
      return state;
  }
}