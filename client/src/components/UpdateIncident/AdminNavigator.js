import React, { useEffect, useState } from "react";
import Map3 from "../Map/Map3";
import { useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";

function AdminNavigator(props) {
  const location = useLocation();

  // get cookies
  const [cookies, setCookie, removeCookie] = useCookies(["userDetails"]);
  const [role, setRole] = useState(null);

  // set role on component mount
  useEffect(() => {
    getRole();
  }, []);

  // get user role to resolve incident
  const getRole = () => {
    // get user details cookie.
    const userDetails = cookies["userDetails"];
    // get role.
    if (userDetails != null) {
      setRole(userDetails.user.role);
    }
  };

  return (
    <Map3
      lat={location.state.longitude}
      lng={location.state.latitude}
      isFixedRoute={true}
      incident={location.state.incident}
      role={role}
    ></Map3>
  );
}

export default AdminNavigator;
