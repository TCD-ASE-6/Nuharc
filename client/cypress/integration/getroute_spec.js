describe("Calculate Route Functionality", () => {
    it("get route", async () => {
        cy.visit('/');
        cy.findByPlaceholderText("Enter Destination").type('Dublin');
        // cy.get('ul').closest('strong').click();
        cy.get('.autosuggestElement').contains('Ireland, County Dublin').click();
        cy.get('.autosuggestElement').contains('Ireland, County Dublin').click();
        
        await cy.findByRole('button', { name: /Calculate Route/i }).click()
            .then((res) => {
                console.log(res);
            });
    });
});