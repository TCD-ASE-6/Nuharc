import React from "react";
import { Route, Navigate } from "react-router-dom";
import getRoleAndAuth from "./getRoleAndAuth";

// TODO: add other route functionality based on roles.
function PrivateRoute(Component) {
  const authDetails = getRoleAndAuth(); // roleAndAuth() returns object from store with role and isAuth()
  const auth = authDetails.isAuth;
  // TODO: add role auth here
  return auth ? <Component /> : <Navigate to="/" />;
  
//   const ele = authDetails.isAuth === true ? element : <Navigate to="/" />;
//   return <Route path={path} element={ele} />;
}

export default PrivateRoute;
