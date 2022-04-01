describe("Current Location Functionality", () => {
    it("Log in", async () => {
        cy.visit('/');
               
        await cy.findByRole('button', { name: /Find Current Location/i }).click()
            .then((res) => {
                console.log(res);
            });
    });
});