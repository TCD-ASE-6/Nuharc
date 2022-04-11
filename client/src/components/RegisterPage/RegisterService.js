import React, { useState } from "react";
import { signupUser } from "../../actions/userActions";
import Role from "../../helpers/role";
import { useNavigate } from "react-router-dom";
import styled, { createGlobalStyle, css } from "styled-components";

const Globalstyle = createGlobalStyle`
html {
  height: 100%;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background: linear-gradient(to bottom, #49c49d, #e1eec3);
  height: 100%;
  margin: 0;
  color: #555;
}
`;

const SharedStyle = css`
  background-color: #eee;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #ddd;
  margin: 10px 0 20px 0;
  padding: 20px;
  box-sizing: border-box;
`;

const StyleFormedWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 0 20px;
`;

const StyleForm = styled.form`
  width: 100%;
  max-width: 700px;
  padding: 40px;
  background-color: #fff;
  border-radius: 10px;
  box-sizing: border-box;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);
`;

const StyledInput = styled.input`
  display: block;
  width: 100%;
  ${SharedStyle}
`;

const StyledButton = styled.button`
  display: block;
  background-color: #f7797d;
  color: #fff;
  font-size: 0.9rem;
  border: 0;
  border-radius: 5px;
  height: 40px;
  padding: 0 20px;
  cursor: pointer;
  box-sizing: border-box;
  :hover {
    background-color: red;
  }
`;

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
