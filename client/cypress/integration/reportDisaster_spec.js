describe("Report Disaster Functionality", () => {

    it("Report Disaster", async () => {

        cy.visit('/');

        cy.findByText("Report Incident").click();

        cy.get('[type="radio"]').check('Fire');

        await cy.findByRole('button', { name: /Submit/i }).click()

            .then((res) => {

                console.log(res);

            });

    });

});