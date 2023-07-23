import 'cypress-xpath';
import { faker } from '@faker-js/faker';
import Users from "./Users";
class Vendors {
    columnsVerify() {
        cy.xpath("//a[@class='k-link']").then(($links) => {
            cy.wrap($links[0]).invoke('text').should('equal', 'ID');
            cy.wrap($links[1]).invoke('text').should('equal', 'PREFERRED');
            cy.wrap($links[2]).invoke('text').should('equal', 'VENDOR NAME');
            cy.wrap($links[3]).invoke('text').should('equal', 'ADDRESS2');
            cy.wrap($links[4]).invoke('text').should('equal', 'CITY');
            cy.wrap($links[5]).invoke('text').should('equal', 'STATE / PROVINCE');
            cy.wrap($links[6]).invoke('text').should('equal', 'ZIP');
            cy.wrap($links[7]).invoke('text').should('equal', 'PRIMARY CONTACT');
            cy.wrap($links[8]).invoke('text').should('equal', 'MAIN PHONE');
            cy.wrap($links[9]).invoke('text').should('equal', 'EMAIL');
            cy.wrap($links[10]).invoke('text').should('equal', 'ACCESS');
            cy.wrap($links[11]).invoke('text').should('equal', 'SITE COUNT');
            cy.wrap($links[12]).invoke('text').should('equal', 'ADDRESS1');
            cy.wrap($links[13]).invoke('text').should('equal', 'INDUSTRY');
        });
    }
    //Need to make this function dynamic.
    filtersVerify() {
        cy.get('label').then(($links) => {
            cy.wrap($links[0]).invoke('text').should('contain', 'VIEW');
            cy.wrap($links[1]).invoke('text').should('contain', 'SITE');
            cy.wrap($links[2]).invoke('text').should('contain', 'VENDOR TYPE');
            cy.wrap($links[3]).invoke('text').should('contain', 'SERVICE TYPE');
            cy.wrap($links[4]).invoke('text').should('contain', 'INDUSTRY TYPE');

        });
    }

    static vendorName = faker.name.fullName();
    static primaryContactName= faker.name.firstName()+" "+faker.name.lastName();
    static primaryEmail = (Vendors.primaryContactName.split(" ")[0] + "." + Vendors.primaryContactName.split(" ")[1] + "@nf.com").toLowerCase();
    // static password = "Tdksk23kdiKsel";
    static vendorId;
    static vendorIdFromUrl;
    createNewVendor() {
        //generating id of the vendor as current date (MM.DD.YY)
        const currentDate = new Date();
        const year = currentDate.getFullYear().toString().slice(-2).padStart(2, '0'); // [year = last 2 digits of the current year]
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // [month = current month (with leading zero)]
        const day = currentDate.getDate().toString().padStart(2, '0'); // [day = current day of the month (with leading zero)]
        const randomNum = Math.floor(Math.random() * 10000);
        Vendors.vendorId = `${month}.${day}.${year}-${randomNum}`;
        cy.log("Vendor ID:", Vendors.vendorId);
        // let company = faker.company.name();
        let address = faker.address.streetAddress(true);
        let mobile = faker.phone.number();
        let city = faker.address.city();
        let state = faker.address.state();
        let zip = faker.address.zipCode('#####');
        let randomEmail = faker.internet.email()
        cy.get('a[href="/vendor/index"]').click();
        cy.get('a[href="/vendor/newvendor"]').click();
        cy.get('#txtNumber').clear().type(Vendors.vendorId);
        cy.get('#txtName').clear().type(Vendors.vendorName);
        cy.get('#ddlVendorType').select("3").invoke("text").should('contain', "Service and Supplies");
        cy.get('#txtWebsite').clear().type("https://www.dsinnovators.com/");
        // if no industry option is present , create an industry from the pop up and then select it or if already present choose from the dropdown.
        cy.get("#ddlIndustry").find("option").then(($options) => {
            if ($options.length == 1) {
                cy.get("#btnIndustry").click();
                //wait for the pop up to fully load.
                cy.get('#winManu', { timeout: 10000 }).should('be.visible');
                cy.wait(1000);
                this.iframeHandling("add");
            }
            else {
                // cy.get('#ddlIndustry').click().type('{downarrow}{downarrow}{enter}');
                cy.get('#ddlIndustry').select(1);
            }
        });
        cy.get("#txtAddress1").clear().type(address);
        cy.get("#txtCity").clear().type(city);
        cy.get("#txtState").clear().type(state);
        cy.get("#txtZip").clear().type(zip);
        cy.get("#txtContactPerson").clear().type(Vendors.primaryContactName);
        cy.get("#chbxAccess").click();
        cy.get("#txtPrimaryEmail").clear().type(Vendors.primaryEmail);
        cy.get("#txtContactPhone").clear().type(mobile);
        cy.get("#btnSave").click();
        cy.wait(1000);
        //closing the pop up after new vendor created.
        cy.get('a[aria-label="Close"]').eq(7).click();
        // Extracting the vendorID from the url endpoint.
        cy.url().then((url) => {
            Vendors.vendorIdFromUrl = url.split('/').slice(-2, -1)[0];
            cy.log("Vendor ID:", Vendors.vendorIdFromUrl);
        });
    }
    //Need to make this function dynamic.
    searchVendor(view) {
        cy.get('a[href="/vendor/index"]').click();
        cy.wait(1000);
        cy.get('#btnReset').click();
        cy.wait(1500);
        cy.get('#view').select(view);
        cy.wait(1500);
        cy.get('#txtKeyword').type(Vendors.vendorName);
        // Waiting for the search API to get resolved.
        cy.intercept("/Vendor/Search").as("searchApiCall")
        cy.get("#btnSearch").click();
        cy.wait("@searchApiCall")
        //validating the name of the UserName in the column(User Name) of the user list.
        cy.xpath(`//td[contains(text(),"${Vendors.vendorName}")]`).contains(Vendors.vendorName);
    }
    editVendor() {
        // cy.get(':nth-child(1) > .k-button').click();
        cy.xpath(`//td//a[contains(@href,'/vendor/editvendor/${Vendors.vendorIdFromUrl}')]`).click();
        let address2 = faker.address.streetAddress(true);
        let newVendorName;
        cy.get("#txtName").invoke('val').then((val) => {
            newVendorName = val + " Vendor";
            cy.get("#txtName").clear().type(newVendorName);
        });
        //Editing the industry from the pop up.
        cy.get("#btnIndustry").click();
        this.iframeHandling("edit");
        cy.get("#btnSave").click();
    }
    iframeHandling(action) {
        cy.frameLoaded('iframe.k-content-frame');
        cy.iframe('iframe.k-content-frame').within(() => {
            if (action === "Add") {
                cy.get(`a.k-grid-${action}`, { timeout: 10000 }).click();
            }
            else {
                cy.get(`a.k-grid-edit`, { timeout: 10000 }).click();
            }
            cy.get("input[type='text']").clear().type(faker.company.name());
            cy.contains('Update').click();
            cy.wait(1000);
        });
        cy.get('a[aria-label="Close"]').eq(6).click();

    }
    addNewContactInfo(){
        const contactFirstName=faker.name.firstName();
        const contactLastName=faker.name.lastName();
        cy.get("#btnAddNewOwner").click();
        cy.get("#txtContactFirstName").clear().type(contactFirstName);
        cy.get("#txtContactLastName").clear().type(contactLastName);
        cy.get("#txtContactTitle").clear().type(faker.name.jobTitle());
        const uniqueRandomNum = Math.floor(Math.random() * 10)
        cy.get("#txtContactMobile").clear().type(faker.phone.number(`+88 01${uniqueRandomNum}########`));
        const contactEmail= contactFirstName+"."+contactLastName+"@nf.com";
        cy.get("#txtContactEmail").clear().type(contactEmail);
        cy.get("a.k-grid-update").click();
        //Validating that the contact info is added.
        cy.get('td[role="gridcell"]').contains(`${contactFirstName} ${contactLastName}`);
    }
    setVendorJurisdictions(){
        const users=new Users();
        users.setUpJurisdictions("tab-3");
    }
    searchVendorActiveView(){
        this.searchVendor("Active");
    }

}


export default Vendors;