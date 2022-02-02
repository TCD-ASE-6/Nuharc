
describe("Signup Functionality", () => {
  it("Signup New User", async () => {
		cy.visit('/');
		cy.findByText("Account").click();
		cy.findByText("Sign up").click();
		cy.findByPlaceholderText("Enter your Name").type('Trinity');
		cy.findByPlaceholderText("Enter your Surname").type('College');
		cy.findByPlaceholderText("Enter your Email").type('non_user@tcd.com');
		cy.findByLabelText(/enter your password/i).type('password');
		cy.findByLabelText(/confirm your password/i).type('password');

		await cy.findByRole('button', { name: /Sign Up/i }).click()
			.then((res) => {
				console.log(res);
			});
	});
});
