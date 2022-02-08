describe("Log in Functionality", () => {
    it("Log in", async () => {
        cy.visit('/');
        cy.findByText("Account").click();
        cy.findByText("Log in").click();
        cy.findByPlaceholderText("Enter your Email").type('non_user@tcd.com');
        cy.findByPlaceholderText("Enter your password").type('password');
        await cy.findByRole('button', { name: /Login/i }).click()
            .then((res) => {
                console.log(res);
            });
    });
});