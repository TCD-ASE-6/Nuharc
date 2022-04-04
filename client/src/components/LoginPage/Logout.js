import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const [cookies, setCookie, removeCookie] = useCookies(["userDetails"]);
  const navigate = useNavigate();

  useEffect(() => {
    //remove cookie and redirect to home
    removeCookie("userDetails", { path: "/" });
    navigate("/");
  }, []);

  return <></>;
}
