import React, { useState } from "react";
import Role from "../../helpers/role";
import { useNavigate } from "react-router-dom";
import {
  Globalstyle,
  StyleForm,
  StyleFormedWrapper,
  StyledButton,
  StyledInput,
} from "../styled-component/FormStyle";
import axios from "axios";
import API_URL from "../../environment";

const Signup2 = (props) => {
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
      password1: enteredPassword1,
      password2: enteredPassword2,
      role: Role.User,
    };
    signUpUser(signUpData);
  };

  const signUpUser = async (user) => {
    axios.post(`${API_URL}/api/users/signup`, user)
      .then(res => {
        console.log(res);
        console.log(res.data);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch((err)=>{
        console.log(err);
      })
  }

  return (
    <>
      <Globalstyle />
      <StyleFormedWrapper>
        <StyleForm>
          <div>
            <label htmlFor="name">Name</label>
            <StyledInput
              type="text"
              name="name"
              onChange={nameChangeHandler}
              value={enteredName}
              placeholder="Enter Name"
            />
          </div>
          <div>
            <label htmlFor="surname">Surname</label>
            <StyledInput
              type="text"
              name="surname"
              onChange={surnameChangeHandler}
              value={enteredSurname}
              placeholder="Enter Surname"
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <StyledInput
              type="email"
              name="email"
              onChange={emailChangeHandler}
              value={enteredEmail}
              placeholder="Enter Email"
            />
          </div>
          <div>
            <label htmlFor="password1">Password</label>
            <StyledInput
              type="password"
              name="password1"
              onChange={password1ChangeHandler}
              value={enteredPassword1}
              placeholder="Enter Password"
            />
          </div>
          <div>
            <label htmlFor="password2">Confirm Pasword</label>
            <StyledInput
              type="password"
              name="password2"
              onChange={password2ChangeHandler}
              value={enteredPassword2}
              placeholder="Confirm Password"
            />
          </div>
          <div>
            <StyledButton type="submit" onClick={submitHandler}>Sign Up</StyledButton>
          </div>
        </StyleForm>
      </StyleFormedWrapper>
    </>
  );
};

export default Signup2;
