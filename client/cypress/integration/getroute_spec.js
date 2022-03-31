describe("Log in Functionality", () => {
    it("Log in", async () => {
        cy.visit('/');
        cy.findByPlaceholderText("Enter Destination").type('Dublin');
        // cy.get('ul').closest('strong').click();
        cy.get('.autosuggestElement').contains('Ireland, County Dublin').click();
        cy.get('.autosuggestElement').contains('Ireland, County Dublin').click();
        cy.findByText('Calculate Route').click();
        await cy.findByRole('button', { name: /Calculate Route/i }).click()
            .then((res) => {
                console.log(res);
            });
    });
});