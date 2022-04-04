describe("Current Location Functionality", () => {
    it("get current location", async () => {
        cy.visit('/');
        cy.findByText("Find Current Location").click();
        await cy.findByRole('button', { name: /Find Current Location/i }).click()
            .then((res) => {
                console.log(res);
            });
    });
});