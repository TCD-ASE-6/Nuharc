import React from "react";
import Map3 from "../Map/Map3";
import { useLocation } from "react-router-dom";

function AdminNavigator(props) {
  const location = useLocation();
  return (
    <Map3
      lat={location.state.longitude}
      lng={location.state.latitude}
      isFixedRoute={true}
      incident={location.state.incident}
    ></Map3>
  );
}

export default AdminNavigator;
