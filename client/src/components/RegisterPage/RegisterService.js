import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input, Container } from "reactstrap";
import { signupUser } from "../../actions/userActions";
import Role from "../../helpers/role";
import { useNavigate } from "react-router-dom";

export default function RegisterService() {
  const navigate = useNavigate();
  const [enteredName, setEnteredName] = useState("");
  const [enteredSurname, setEnteredSurname] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword1, setEnteredPassword1] = useState("");
  const [enteredPassword2, setEnteredPassword2] = useState("");

  const nameChangeHandler = (event) => {
    setEnteredName(event.target.value);
  };
  const surnameChangeHandler = (event) => {
    setEnteredSurname(event.target.value);
  };
  const emailChangeHandler = (event) => {
    setEnteredEmail(event.target.value);
  };
  const password1ChangeHandler = (event) => {
    setEnteredPassword1(event.target.value);
  };
  const password2ChangeHandler = (event) => {
    setEnteredPassword2(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const signUpData = {
      name: enteredName,
      surname: enteredSurname,
      email: enteredEmail,
      password: enteredPassword1,
      confirmPassword: enteredPassword2,
      role: Role.Admin,
    };
    signupUser(signUpData);
    navigate("/login");
  };

  return (
    <Container>
      <Form onSubmit={submitHandler}>
        <FormGroup>
          <Label for="userName">Name</Label>
          <Input
            type="text"
            name="name"
            id="userName"
            onChange={nameChangeHandler}
            value={enteredName}
            placeholder="Enter your Name"
          />
        </FormGroup>
        <FormGroup>
          <Label for="userSurname">Surname</Label>
          <Input
            type="text"
            name="surname"
            id="userSurname"
            onChange={surnameChangeHandler}
            value={enteredSurname}
            placeholder="Enter your Surname"
          />
        </FormGroup>
        <FormGroup>
          <Label for="userEMail">Email</Label>
          <Input
            type="email"
            name="email"
            id="userEMail"
            onChange={emailChangeHandler}
            value={enteredEmail}
            placeholder="Enter your Email"
          />
        </FormGroup>
        <FormGroup>
          <Label for="userPassword1">Enter your Password</Label>
          <Input
            type="password"
            name="password1"
            id="userPassword1"
            onChange={password1ChangeHandler}
            value={enteredPassword1}
            placeholder="Enter your Password"
          />
        </FormGroup>
        <FormGroup>
          <Label for="userPassword2">Confirm your Password</Label>
          <Input
            type="password"
            name="password2"
            id="userPassword2"
            onChange={password2ChangeHandler}
            value={enteredPassword2}
            placeholder="Enter your Password Again"
          />
        </FormGroup>
        <Button type="Submit">Sign Up</Button>
      </Form>
    </Container>
  );
}
