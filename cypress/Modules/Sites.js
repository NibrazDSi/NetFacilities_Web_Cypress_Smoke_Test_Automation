import 'cypress-xpath'
import { faker } from '@faker-js/faker';
class Sites {
    columnsVerify() {
        cy.xpath("//a[@class='k-link']").then(($links) => {
            cy.wrap($links[0]).invoke('text').should('equal', 'NAME');
            cy.wrap($links[1]).invoke('text').should('equal', 'ID');
            cy.wrap($links[2]).invoke('text').should('equal', 'SITE ADMIN');
            cy.wrap($links[3]).invoke('text').should('equal', 'TENANT PORTAL');
            cy.wrap($links[4]).invoke('text').should('equal', 'CITY');
            cy.wrap($links[5]).invoke('text').should('equal', 'STATE / PROVINCE');
            cy.wrap($links[6]).invoke('text').should('equal', 'ADDRESS');
            cy.wrap($links[7]).invoke('text').should('equal', 'ZIP');
            cy.wrap($links[8]).invoke('text').should('equal', 'SUB-SITES');
            cy.wrap($links[9]).invoke('text').should('equal', 'DISTRICT');
            cy.wrap($links[10]).invoke('text').should('equal', 'REGION');
        });
    }
    filtersVerify() {
        cy.get('label').then(($links) => {
            cy.wrap($links[0]).invoke('text').should('contain', 'VIEW');
            cy.wrap($links[1]).invoke('text').should('contain', 'SITE ADMIN');
            cy.wrap($links[2]).invoke('text').should('contain', 'DISTRICT');
            cy.wrap($links[3]).invoke('text').should('contain', 'REGION');
        });
    }
    filterUsingDistrictAndRegion() {
        cy.get('#btnReset').click();
        cy.get('#district').select('20820').invoke('text').should('contain', 'Mountain Time _Default');
        cy.get('#region').select('19615').invoke('text').should('contain', 'Mountain Time');
        cy.wait(2000);
        // Validating that the filtered district and Region is showing in specific row and column(District and Region)
        cy.xpath("//tbody[@role='rowgroup']//tr").then((rows) => {
            const rowLength = rows.length;
            for (let i = 0; i < rowLength; i++) {
                cy.get(rows[i]).find('td[data-colid="6"]').find('a')
                    .contains('Mountain Time _Default');
                cy.get(rows[i]).find('td[data-colid="7"]').find('a')
                    .contains('Mountain Time');
            }
        });
    }
    static siteName = faker.address.direction() + " " + faker.address.county() + " Property " + faker.random.numeric(2);
    static siteId;
    createNewSite() {
        cy.get('a[href="/sites/newsite"]').eq(1).click();
        let siteID = "Site_" + faker.random.numeric(4);
        // siteName=faker.address.county()+" Property";
        let address = faker.address.streetAddress(true);
        let city = faker.address.city();
        let state = faker.address.state();
        let zip = faker.address.zipCode('#####');
        cy.get('#txtSiteNo').type(siteID);
        cy.get('#txtSiteName').type(Sites.siteName);
        cy.get('#txtAddress1').type(address);
        cy.get('#txtCity').type(city);
        cy.get('#txtState').type(state);
        cy.get('#txtZip').type(zip);
        cy.get('#ddlTimeZone').select("2");
        cy.get('#ddlRegion').select("16244");
        cy.get('#ddlDistrict').select("17170");
        cy.get('#ddlSiteAdmin').select("243328");
        cy.get('#btnSave').click();
        cy.wait(1000);
        cy.url({ timeout: 11000 }).should('include', 'https://mvc.netfacilities.com/sites/editsite/').then((url) => {
            Sites.siteId = url.split("/").pop();
            cy.log("Site ID:", Sites.siteId);
            this.saveSiteDataToJson(Sites.siteName, Sites.siteId);
        });
        
    }
    // Function to save data to a JSON file in the fixtures folder
    saveSiteDataToJson(siteName, Id) {
        const siteData = {
            Sites: {
                siteName: siteName,
                siteId: Id,
            },
        };

        cy.saveDataToJson(siteData);
    }
    searchSite() {
        cy.visit("/sites/index");
        cy.get('#btnReset').click();
        cy.get('#txtKeyword').type(Sites.siteName);
        cy.wait(1000);
        cy.get("#btnSearch").click();
        cy.wait(1000);
        //validating the name of the site in the column(name) of the site list.
        cy.get('td[data-colid="2"]').find('a')
            .contains(Sites.siteName);
    }
    editSite() {
        cy.get(':nth-child(1) > .k-button').click();
        let newSitename = Sites.siteName + " Test";
        cy.get('#txtSiteName').clear().type(newSitename);
        cy.get('.k-formatted-value').type(faker.random.numeric(6));
        cy.get('#btnSave').click();
        cy.wait(1200);
        //Validation of the edited site name
        cy.get('#txtSiteName').should('have.value', newSitename);
        // cy.get('#btnDelete').click();
    }
    addNewSubsite() {
        cy.intercept("POST","/Bldg/Search").as("subsiteFieldLoad");
        cy.get('#chkMultiSite').click();
        cy.wait("@subsiteFieldLoad");
        cy.wait(500);
        cy.get("#btnNewSiteBldg").click();
        this.subsite();
        cy.xpath('//a[@role="button"]').eq(0).click();
    }
    // editSubsite(){
    //     cy.xpath('//a[@role="button"]').eq(2).click();
    //     cy.wait(2000);
    //     this.subsite();
    //     cy.xpath('//a[@role="button"]').eq(0).click();
    //     cy.wait(1000);
    //     cy.xpath('//a[@role="button"]').eq(3).click();
    // }
    subsite() {
        let subsiteName = faker.address.buildingNumber() + " " + faker.address.streetName();
        cy.wait(1000);
        cy.get('[name="BldgName"]').clear().type(subsiteName);
        cy.wait(1000);
        let street = faker.address.streetAddress();
        cy.get('[name=Address]').clear().type(street);
    }
    addNewArea() {
        cy.xpath('//span[@class="k-link"]').eq(1).click();
        cy.get('#btnNewSiteArea').click();
        let areaName = faker.address.street();
        cy.wait(5000);
        cy.get('#btnNewSiteArea').click();
        cy.get('[data-container-for="Suite"] > .k-input').type(areaName);
        // cy.intercept();
        // cy.route('**').as('apiRequests') // intercepting and aliasing all API requests
        cy.xpath('//input[@name="Suite"]').clear().type(areaName);
        // cy.wait('@apiRequests') //Waiting for all API requests to complete.
        cy.xpath('//a[text()="Update"]').click()
    }
    deleteSite() {
        cy.wait(2000);
        cy.get('#btnDelete').click();
        cy.wait(1500);
        //Verifying that after deleting the site, it is navigated to site list page.
        cy.url().should('equal', 'https://mvc.netfacilities.com/sites/index');

    }

}
export default Sites;