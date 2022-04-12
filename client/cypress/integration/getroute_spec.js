describe("Calculate Route Functionality", () => {
    it("get route", async () => {
        cy.visit('/');
        cy.wait(1000);
        cy.findByPlaceholderText("Enter Location").type('Trinity');
        cy.get('.autosuggestElement').contains('Ireland, Dublin, Trinity Street').click();
        // cy.get('.autosuggestElement').contains('Ireland, County Dublin').click();
        
        await cy.findByRole('button', { name: /Calculate Route/i }).click()
            .then((res) => {
                console.log(res);
            });
    });
});