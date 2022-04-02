describe("Set Incident Active and show route", () => {
    it("Set Incident Active and show route", async () => {
        cy.visit('/update-incident');
        cy.get('.btn').each(( item, index, list) => {
            // Returns the elements from the cy.get command
            // console.log(list);
            if(index == 0){
                list[index].click();
            }
        });
        cy.findByRole('button', { name: /Show Route/i }).click();
        await cy.findByRole('button', { name: /Show Route/i }).click()
            .then((res) => {
                console.log(res);
            });
    }
    );
});