describe("Report incident for current location", () => {
    it("Report incident for current location (Explosion)", async () => {
        cy.visit('/report');
        cy.findByText("Current Location").click;
        cy.get('[type="radio"]').check('Explosion');
        cy.findByText("Submit").click();
        await cy.findByRole('button', { name: /Submit/i }).click()
            .then((res) => {
                console.log(res);
            });
    }
    
    );
    it("Report incident for current location (Fire)", async () => {
        cy.visit('/report');
        cy.findByText("Current Location").click;
        cy.get('[type="radio"]').check('Fire');
        cy.findByText("Submit").click();
        await cy.findByRole('button', { name: /Submit/i }).click()
            .then((res) => {
                console.log(res);
            });
    });
    it("Report incident for current location (Car Accident)", async () => {
        cy.visit('/report');
        cy.findByText("Current Location").click;
        cy.get('[type="radio"]').check('CarAccident');
        cy.findByText("Submit").click();
        await cy.findByRole('button', { name: /Submit/i }).click()
            .then((res) => {
                console.log(res);
            });
    }
    
    );
   
});
