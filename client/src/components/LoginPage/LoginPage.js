import axios from "axios";
import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import API_URL from "../../environment";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const [didLoginFail, setDidLoginFail] = useState(false);

  // this hook deals with setting a global cookie for user details
  // contains all information about logged in user like jwt token, email, role, etc.
  const [cookies, setCookie] = useCookies(["userDetails"]);

  const navigate = useNavigate();

  // create a user object and pass it to the login and store user cookie function
  const loginUser = (e) => {
    e.preventDefault();
    const user = {
      email: email,
      password: password,
    };
    loginUserAndStoreInCookie(user);
  };

  // function to login user and store the cookie.
  const loginUserAndStoreInCookie = async (user) => {
    axios
      .post(`${API_URL}/api/users/login`, user)
      .then((response) => {
        // const userDetails = response.json();
        // store global user details in a cookie
        setCookie("userDetails", JSON.stringify(response.data), { path: "/" });
        setHasLoggedIn(true);
        setDidLoginFail(false);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((err) => {
        setDidLoginFail(true);
      });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <>
      <Form>
        <FormGroup>
          <Label for="userEMail">Email</Label>
          <Input
            type="email"
            name="email"
            id="userEMail"
            onChange={(e) => handleEmailChange(e)}
            placeholder="Enter your Email"
          />
        </FormGroup>
        <FormGroup>
          <Label for="userPassword">Password</Label>
          <Input
            type="password"
            name="password"
            id="userPassword"
            onChange={(e) => handlePasswordChange(e)}
            placeholder="Enter your password"
          />
        </FormGroup>
        <Button onClick={(e) => loginUser(e)}>Login</Button>
      </Form>

      {hasLoggedIn && (
        <h4 style={{ color: "green", textAlign: "center" }}>
          Login Successful.
        </h4>
      )}
      {didLoginFail && (
        <h4 style={{ color: "red", textAlign: "center" }}>
          Login Failed.
        </h4>
      )}
    </>
  );
}

export default LoginPage;
