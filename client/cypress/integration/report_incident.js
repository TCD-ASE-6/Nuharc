describe("Report incident for current location and searched location", () => {
    it("Report incident for current location and searched location", async () => {
        cy.visit('/report');
        cy.findByText("Current Location").click;
        cy.get('[type="radio"]').check('Explosion');
        await cy.findByRole('button', { name: /Submit/i }).click()
            .then((res) => {
                console.log(res);
            });
    }
    
    );
    it("Report incident for current location and searched location", async () => {
        cy.visit('/report');
        cy.findByPlaceholderText("Enter Location").type('Dublin');
        cy.get('.autosuggestElement').contains('Ireland, County Dublin').click();
        // cy.get('.autosuggestElement').contains('Ireland, County Dublin').click();
        cy.get('[type="radio"]').check('Explosion');
        await cy.findByRole('button', { name: /Submit/i }).click()
            .then((res) => {
                console.log(res);
            });
    }
    
    );
});
