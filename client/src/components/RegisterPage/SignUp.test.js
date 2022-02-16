// import { render, screen, Simulate } from "@testing-library/react";
// import ReactTestUtils from "react-dom/test-utils";
// import SignUp from "./SignUp";

// import { Provider } from "react-redux";
// import store from "./../../store";
// import { shallow, mount } from "enzyme";
import axios from "axios";



const userDetails = {
  name: "Machina",
  surname: "X",
  email: "xmachina@xyz.com",
  password1: "password",
  password2: "password",
  role: "user"
};

async function sendReq (user) {
  const headers = {
    "Content-Type": "application/json",
  };
  await axios
    .post(`http://localhost:8080/api/users/signup`, user, headers)
    .then((response) => {
      return true;
    })
    .catch((error) => {
      return false;
    });
};

test('signup', async () => {
  let output = await sendReq(userDetails);
  // await new Promise((r) => setTimeout(r, 4000));
  // expect(output).toEqual(true);
})

// Code for future use (simulating events in user actions).

/*
const wrapper = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

test("signup using missing user name", async () => {
  // const wrapper = mount(wrapper(<SignUp/>));
  render(<SignUp />, { wrapper: wrapper });

  const nameField = screen.getByLabelText("Name");
  ReactTestUtils.Simulate.focus(nameField);
  nameField.value = "qaz";
  ReactTestUtils.Simulate.change(nameField);
  ReactTestUtils.Simulate.keyDown(nameField, {
    key: "Enter",
    keyCode: 13,
    which: 13,
  });

  const surnameField = screen.getByLabelText("Surname");
  ReactTestUtils.Simulate.focus(surnameField);
  surnameField.value = "qaz";
  ReactTestUtils.Simulate.change(surnameField);
  ReactTestUtils.Simulate.keyDown(surnameField, {
    key: "Enter",
    keyCode: 13,
    which: 13,
  });

  const emailField = screen.getByLabelText("Email");
  ReactTestUtils.Simulate.focus(emailField);
  emailField.value = "qaz@qaz.com";
  ReactTestUtils.Simulate.change(emailField);
  ReactTestUtils.Simulate.keyDown(emailField, {
    key: "Enter",
    keyCode: 13,
    which: 13,
  });

  const password1Field = screen.getByPlaceholderText("Enter your Password");
  ReactTestUtils.Simulate.focus(password1Field);
  password1Field.value = "qaz12345";
  ReactTestUtils.Simulate.change(password1Field);
  ReactTestUtils.Simulate.keyDown(password1Field, {
    key: "Enter",
    keyCode: 13,
    which: 13,
  });

  const password2Field = screen.getByPlaceholderText(
    "Enter your Password Again"
  );
  ReactTestUtils.Simulate.focus(password2Field);
  password2Field.value = "qaz12345";
  ReactTestUtils.Simulate.change(password2Field);
  ReactTestUtils.Simulate.keyDown(password2Field, {
    key: "Enter",
    keyCode: 13,
    which: 13,
  });

  const submitButton = screen.getByRole("button", { name: /sign up/i });
  ReactTestUtils.Simulate.click(submitButton);

  //   screen.getByLabelText(/Enter your E-Mail/i).type(userDetails.email);
  //   screen.getByLabelText(/password/i).type(userDetails.password1);
  //   screen.getByLabelText(/confirm your password/i).type(userDetails.password2);
  //   await screen.getByRole("button", { name: /sign up/i }).click();
});
*/
