describe("Log in Functionality", () => {
    it("Log in", async () => {
          cy.visit('/login');
          cy.findByPlaceholderText("Enter your Email").type('non_user@tcd.com');  
          cy.findByLabelText(/enter your password/i).type('password');
          await cy.findByRole('button', { name: /Login/i }).click()
              .then((res) => {
                  console.log(res);
              });
      });
  });