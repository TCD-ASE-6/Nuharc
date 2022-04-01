import axios from "axios";
import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

function LoginPage() {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  const loginUser = (e) => {
    e.preventDefault();
    const user = {
      email: email,
      password: password,
    };
    loginUserAndStoreInCookie(user);
  };

  const loginUserAndStoreInCookie = async (user) => {
    axios.post(`/api/users/login`, user).then((response) => {
      const userDetails = response.json();
      // TODO: set global cookies for user details to be checked in everypage
      // userDetails.
    });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // this.setState({ [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // this.setState({ [e.target.name]: e.target.value });
  };

  return (
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
  );
}

export default LoginPage;
