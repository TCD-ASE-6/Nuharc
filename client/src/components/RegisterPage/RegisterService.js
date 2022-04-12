import React, { useState } from "react";
import Role from "../../helpers/role";
import {
  Globalstyle,
  StyleForm,
  StyleFormedWrapper,
  StyledButton,
  StyledInput,
} from "../styled-component/FormStyle";
import axios from "axios";
import API_URL from "../../environment";

export default function RegisterService() {
  const [enteredName, setEnteredName] = useState("");
  const [enteredSurname, setEnteredSurname] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword1, setEnteredPassword1] = useState("");
  const [enteredPassword2, setEnteredPassword2] = useState("");
  const [hasSignedIn, setHasSignedIn] = useState(false);
  const [error, setIsError] = useState(false);

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
      password1: enteredPassword1,
      password2: enteredPassword2,
      role: Role.EmergencyStaff,
    };
    signUpUser(signUpData);
  };

  const signUpUser = async (user) => {
    axios.post(`${API_URL}/api/users/signup`, user)
      .then(res => {
        if(res.status===200) {
          setHasSignedIn(true);
        }
      })
      .catch((err)=>{
        setIsError(true)
        console.log(err);
      })
  }

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
          <div>
            {hasSignedIn && (
              <h4 style={{ color: "green", textAlign: "center" }}>
                  User Created!.
              </h4>
            )}
            {error && (
              <h4 style={{ color: "red", textAlign: "center" }}>
                  Failed!.
              </h4>
            )}
          </div>
        </StyleForm>
      </StyleFormedWrapper>
    </>
  );
}
