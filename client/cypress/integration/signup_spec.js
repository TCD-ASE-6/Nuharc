
describe("Signup Functionality", () => {
  it("Signup New User", async () => {
		cy.visit('/');
		cy.findByText("Account").click();
		cy.findByText("Sign up").click();
		cy.findByPlaceholderText("Enter Name").type('Trinity');
		cy.findByPlaceholderText("Enter Surname").type('College');
		cy.findByPlaceholderText("Enter Email").type(`non_user_${Date.now()}@tcd.com`);
		cy.findByPlaceholderText('Enter Password').type('password');
		cy.findByPlaceholderText('Confirm Password').type('password');

		await cy.findByRole('button', { name: /Sign Up/i }).click()
			.then((res) => {
				console.log(res);
			});
	});
});
