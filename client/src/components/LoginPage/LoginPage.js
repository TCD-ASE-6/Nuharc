import axios from "axios";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import styled, { createGlobalStyle, css } from 'styled-components';

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
font-size: .9rem;
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
      .post(`/api/users/login`, user)
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
    <Globalstyle />
    <StyleFormedWrapper>
      <StyleForm>
      <div>
            <label htmlFor="userEmail">Email</label>
            <StyledInput
              type="email"
              name="email"
              id="userEmail"
              onChange={(e) => handleEmailChange(e)}
              placeholder="Enter your Email"
              value={email}
            />
            </div>
            <div>
            <label htmlFor="userPassword">Email</label>
            <StyledInput
              type="password"
              name="password"
              id="userPassword"
              onChange={(e) => handlePasswordChange(e)}
              placeholder="Enter your password"
              value={password}
            />
            </div>
            <div>
        <StyledButton onClick={(e) => loginUser(e)}>Login</StyledButton>
        </div>
        <div>

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
      </div>
      </StyleForm>
      </StyleFormedWrapper>
    </>
  );
}

export default LoginPage;