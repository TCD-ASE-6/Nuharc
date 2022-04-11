describe("Calculate route", () => {
    it("Calculate route", async () => {
        cy.visit('/');
        cy.findByPlaceholderText("Enter Location").type('Dublin');
        cy.wait(500);
        // cy.get('ul').closest('strong').click();
        cy.get('.autosuggestElement').contains('Ireland, County Dublin').click();
        // cy.get('.autosuggestElement').contains('Ireland, County Dublin').click();
        cy.findByText('Calculate Route').click();
        await cy.findByRole('button', { name: /Calculate Route/i }).click()
            .then((res) => {
                console.log(res);
            });
    });
});