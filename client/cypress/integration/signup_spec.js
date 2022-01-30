
describe("Signup Functionality", () => {
  it("Signup New User", async () => {
		cy.visit('/');
		cy.findByPlaceholderText("Enter your Username").type('Machina');
		cy.findByPlaceholderText("Enter your Surname").type('X');
		cy.findByPlaceholderText("Enter your E-Mail").type('xmachina@xyz.com');
		cy.findByLabelText(/enter your password/i).type('password');
		cy.findByLabelText(/confirm your password/i).type('password');

		await cy.findByRole('button', { name: /sign up/i }).click()
			.then((res) => {
				console.log(res);
			});
	});
});
