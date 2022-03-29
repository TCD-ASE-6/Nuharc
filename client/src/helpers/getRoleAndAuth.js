import store from "../store";

const getRoleAndAuth = () => {
  const storeUser = store.getState().user;
  // TODO: add get role and auth from store user.
  return { "role": "user", "isAuth": true };
};

export default getRoleAndAuth;