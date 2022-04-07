describe("Report incident for searched location", () => {
it("Report incident for searched location", async () => {
    cy.visit('/report');
    cy.findByPlaceholderText("Enter Location").type('Dublin');
    cy.get('.autosuggestElement').contains('Ireland, County Dublin').click();
    // cy.get('.autosuggestElement').contains('Ireland, County Dublin').click();
    cy.get('[type="radio"]').check('Explosion');
    cy.findByText("Submit").click();
    await cy.findByRole('button', { name: /Submit/i }).click()
        .then((res) => {
            console.log(res);
        });
}

);
});