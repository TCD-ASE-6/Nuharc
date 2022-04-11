import React, { useState } from "react";
import { signupUser } from "../../actions/userActions";
import Role from "../../helpers/role";
import { useNavigate } from "react-router-dom";
import {
  Globalstyle,
  StyleForm,
  StyleFormedWrapper,
  StyledButton,
  StyledInput,
} from "../styled-component/FormStyle";

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
    <>
      <Globalstyle />
      <StyleFormedWrapper>
        <StyleForm onSubmit={submitHandler}>
          <div>
            <label htmlFor="userName">Name</label>
            <StyledInput
              type="text"
            name="name"
            id="userName"
            onChange={nameChangeHandler}
            value={enteredName}
            placeholder="Enter your Name"
            />
          </div>
          <div>
            <label htmlFor="userSurname">Surname</label>
            <StyledInput
              type="text"
            name="surname"
            id="userSurname"
            onChange={surnameChangeHandler}
            value={enteredSurname}
            placeholder="Enter your Surname"
            />
          </div>
          <div>
            <label htmlFor="userEMail">Email</label>
            <StyledInput
              type="email"
            name="email"
            id="userEMail"
            onChange={emailChangeHandler}
            value={enteredEmail}
            placeholder="Enter your Email"
            />
          </div>
          <div>
            <label htmlFor="userPassword1">Password</label>
            <StyledInput
              type="password"
            name="password1"
            id="userPassword1"
            onChange={password1ChangeHandler}
            value={enteredPassword1}
            placeholder="Enter your Password"
            />
          </div>
          <div>
            <label htmlFor="userPassword2">Confirm Pasword</label>
            <StyledInput
              type="password"
            name="password2"
            id="userPassword2"
            onChange={password2ChangeHandler}
            value={enteredPassword2}
            placeholder="Enter your Password Again"
            />
          </div>
          <div>
            <StyledButton type="submit">Register</StyledButton>
          </div>
        </StyleForm>
      </StyleFormedWrapper>
    </>
  );
}
