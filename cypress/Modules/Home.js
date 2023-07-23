import 'cypress-xpath'
class Home {
    workOrderModule(moduleText, navigatedScreenText) {
        // cy.get(':nth-child(1) > a > h2').should('exist').should('have.text', 'Work Orders')
        // cy.get(':nth-child(1) > a > h2').should('be.visible').should('have.text', 'Work Orders')
        // cy.contains('h2', moduleText)
        // cy.get('div.hm-work-image').find('h2').should('exist');
        // cy.get('div.hm-work-image > a > h2').should('have.text', 'Work Orders')
        // cy.get('div.hm-work-image > a > h2').should('be.visible')
        // cy.get('div.hm-work-image > a > h2')
        //     .invoke('text')
        //     .should('equal', 'Work Orders')
        // cy.get('div.hm-work-image > a > h2')
        //     .debug()
        //     .should('have.text', 'Work Orders');
        // cy.get('div.hm-work-image')
        //     .find('a')
        //     .find('h2')
        //     .should('have.text', 'Work Orders');
        cy.xpath("//h2[contains(text(),'Work Orders')]").should('be.visible').should('have.text', moduleText);
        cy.get('a[href="/workorder/overview"').click();
        this.headerTextValidation(navigatedScreenText);

    }
    activitiesModule(moduleText, navigatedScreenText) {
        cy.get(':nth-child(2) > a > h2').should('be.visible').should('have.text', moduleText);
        cy.get('a[href="/activities/calendar"').click();
        this.headerTextValidation(navigatedScreenText);
    }
    sitesModule(moduleText, navigatedScreenText) {
        cy.xpath("//h2[contains(text(),'Sites')]").should('be.visible').should('have.text', moduleText);
        // cy.xpath('//a[@href="/sites/index"]').eq(0).click();
        cy.get('a[href="/sites/index"]').eq(3).click();
        this.headerTextValidation(navigatedScreenText);
    }
    usersModule(moduleText, navigatedScreenText) {
        cy.xpath("//h2[contains(text(),'Users')]").should('be.visible').should('have.text', moduleText);
        cy.xpath('//a[@href="/users/index"]').click();
        this.headerTextValidation(navigatedScreenText);
    }
    vendorsModule(moduleText, navigatedScreenText) {
        cy.xpath("//h2[contains(text(),'Vendors')]").should('be.visible').should('have.text', moduleText);
        cy.get('a[href="/vendor/index"]').click();
        this.headerTextValidation(navigatedScreenText);
    }
    assetsModule(moduleText, navigatedScreenText) {
        cy.xpath("//h2[contains(text(),'Assets')]").should('be.visible').should('have.text', moduleText);
        cy.get(':nth-child(6) > a > h2').click();
        this.headerTextValidation(navigatedScreenText);
    }
    inventoryModule(moduleText, navigatedScreenText) {
        cy.xpath("//h2[contains(text(),'Inventory')]").should('be.visible').should('have.text', moduleText);
        cy.get('a[href="/inventory/index"]').eq(1).click();
        this.headerTextValidation(navigatedScreenText);
    }
    logoutOption(text) {
        cy.get('span[class="m-tec-name"]')
            .trigger('mouseover')
            .xpath("//div[@class='dropdown-content2']/ul/li[2]")
            .should('have.text', text);
    }
    headerTextValidation(navigatedScreenText) {
        cy.get('h1').should("have.text", navigatedScreenText);
    }
    backToHome() {
        // cy.get('a[href="/myhome"]').click();
        cy.go(-1);
    }
}
export default Home;