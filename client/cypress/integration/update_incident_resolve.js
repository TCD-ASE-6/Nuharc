describe("Resolve incident", () => {
    it("Resolve incident", async () => {
        cy.visit('/update-incident');
        cy.get('.btn').each(( item, index, list) => {
            // Returns the elements from the cy.get command
            // console.log(list);
            if(index == 1){
                list[index].click();
            }
        });
    }
    );
});