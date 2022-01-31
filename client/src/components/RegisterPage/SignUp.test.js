// import { render, screen } from "@testing-library/react";
// import SignUp from "./SignUp";

// import { Provider } from "react-redux";
// import { TestStore as store } from "./../../testStore";

// const wrapper = ({ children }) => {
//   return <Provider store={store}>{children}</Provider>;
// };

// const userDetails = {
//   name: "Machina",
//   surname: "X",
//   email: "xmachina@xyz.com",
//   password1: "password",
//   password2: "password",
// };

// test("signup using missing user name", async () => {
//   render(<SignUp />, { wrapper: wrapper });
//   screen.getByLabelText("Name").type("");
// 	screen.getByRole('textbox', { name: "surname" }).type(userDetails.surname);
// 	screen.getByLabelText(/Enter your E-Mail/i).type(userDetails.email);
// 	screen.getByLabelText(/password/i).type(userDetails.password1);
// 	screen.getByLabelText(/confirm your password/i).type(userDetails.password2);

// 	await screen.getByRole('button', { name: /sign up/i }).click();
// });
