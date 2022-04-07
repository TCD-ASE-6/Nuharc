describe("Report incident for direct submit", () => {
it("Report incident direct submit", async () => {
    cy.visit('/report');
    cy.findByText("Submit").click();
    await cy.findByRole('button', { name: /Submit/i }).click()
        .then((res) => {
            console.log(res);
        });
}

);
it("Report incident direct submit with radio check", async () => {
    cy.visit('/report');
    cy.get('[type="radio"]').check('CarAccident');
    cy.findByText("Submit").click();
    await cy.findByRole('button', { name: /Submit/i }).click()
        .then((res) => {
            console.log(res);
        });
}

);
});