import 'cypress-xpath';
import { faker } from '@faker-js/faker';
import Login from "./Login";
class Users {
    //Need to make this function dynamic.
    columnsVerify() {
        cy.xpath("//a[@class='k-link']").then(($links) => {
            cy.wrap($links[0]).invoke('text').should('equal', 'USER ROLE');
            cy.wrap($links[1]).invoke('text').should('equal', 'USER NAME');
            cy.wrap($links[2]).invoke('text').should('equal', 'COMPANY/AREA/DEPT.');
            cy.wrap($links[3]).invoke('text').should('equal', 'EMAIL');
            cy.wrap($links[4]).invoke('text').should('equal', 'PHONE');
            cy.wrap($links[5]).invoke('text').should('equal', 'PRIMARY SITE: SUB SITE');
            cy.wrap($links[6]).invoke('text').should('equal', 'ACCESS');
            cy.wrap($links[7]).invoke('text').should('equal', 'SITES');
        });
    }
    //Need to make this function dynamic.
    filtersVerify() {
        cy.get('label').then(($links) => {
            cy.wrap($links[0]).invoke('text').should('contain', 'VIEW');
            cy.wrap($links[1]).invoke('text').should('contain', 'SITE');
            cy.wrap($links[2]).invoke('text').should('contain', 'SUB-SITE');
            cy.wrap($links[4]).invoke('text').should('contain', 'DEPARTMENT');
            cy.wrap($links[5]).invoke('text').should('contain', 'ROLE');
        });
    }
    //Need to make this function dynamic.
    filterUsingUserRole() {
        cy.get('#btnReset').click();
        cy.get('#role').select('13').invoke('text').should('contain', 'Maintenance');
        // Validating that the filtered role is showing in specific row and column(User Role)
        let tableRow;
        // cy.get('tr').its('length').then((length) => {
        //     cy.log(`There are ${length} tr tags on the page.`);
        //     tableRow = length - 10;
        // }).then(() => {
        // cy.xpath('//td[@role="gridcell"]//a[contains(text(), "Edit")]').its('length').then((count) => {
        //     // `count` variable will contain the number of instances of total number of Edit button (total users)
        //     cy.log(`Number of instances: ${count}`);
        //     for (let i = 4; i < 4 + count; i++) {
        //         cy.get('tr').eq(i).find('td[data-colid="62"]')
        //             .contains('Maintenance');
        //     }
        // });
        cy.xpath("//tbody[@role='rowgroup']//tr").as("rows");
        cy.get("@rows").its('length').then((count) => {
            for (let i = 0; i < count; i++) {
                cy.get("@rows").eq(i).find('td[data-colid="62"]')
                    .contains('Maintenance');
            }
        })

        // })


    }
    static userName = faker.name.firstName() + " " + faker.name.lastName();
    static email = Users.userName.split(" ")[0].toLowerCase() + "." + Users.userName.split(" ")[1].toLowerCase() + "@nf.com";
    static password = "Tdksk23kdiKsel";
    static userId;
    createNewUser() {
        // let displayName = "Test User" + " " + Users.userName.split(" ")[0];
        let company = faker.company.name();
        let mainPhone = faker.phone.imei();
        let mobile = faker.phone.number();
        cy.get('a[href="/users/index"]').click();
        cy.get('a[href="/users/newuser"]').eq(0).click();
        let title;
        cy.xpath('//select[@id="ddlUserRole"]//option[@value="13"][contains(text(), "Maintenance")]').invoke('text').then((selectedText) => {
            title = selectedText + " " + "Technician";
            cy.log("Title", title);
            cy.get('#txtTitle').clear().type(title);
        });
        cy.wait(1000);
        cy.get("#ddlUserRole").select('13').invoke('text').should('contain', 'Maintenance');
        cy.get('#txtFirstName').clear().type(Users.userName.split(" ")[0]);
        cy.get('#txtLastName').clear().type(Users.userName.split(" ")[1]);
        // cy.get('#txtDisplayName').clear().type(displayName);
        // cy.get('#txtCompany').clear().type(company);
        cy.get('#ddlDept').select('6060').invoke('text').should('contain', 'Programming Division');
        cy.wait(1000);
        cy.get('#txtPhone').clear().type(mainPhone);
        cy.wait(1000);
        cy.get('#txtMobile').clear().type(mobile);
        cy.wait(1000);
        cy.get('#txtEmail').clear().type(Users.email);
        // removing the readonly attribute.
        cy.get('#txtPassword')
            .invoke('removeAttr', 'readonly')
            .clear()
            .type(Users.password);
        // can use the site created in another module.
        cy.wait(1000);
        // Read the siteID from the JSON file
        cy.readDataFromJson().then((siteData) => {
            cy.log("SiteData:", siteData)
            const idSite = siteData.Sites["siteId"];
            cy.log("Site ID:", idSite);
            cy.get("#ddlSite").select(String(idSite));
            cy.intercept('POST',"/Bldg/GetBldgsBySite").as("subsiteLoad");
            cy.get('#btnSave').click();
            cy.wait(2000);
            cy.wait('@subsiteLoad');
            // Extracting the userID from the url endpoint.
            cy.url().then((url) => {
                Users.userId = url.split("/").pop();
                cy.log("User ID:", Users.userId);
                this.saveUsersDataToJson(Users.userName, Users.email,Users.userId);
            });
        });
        // For using existing data.
        // cy.get("#ddlSite").select('93984');

    }
    // storing user data to json file
    saveUsersDataToJson(userName, email, Id) {
        cy.readDataFromJson().then((existingData) => {
            // Merge the new data with the existing data
            const newData = {
                ...existingData,
                Users: {
                    userName: userName,
                    userEmail:email,
                    userId: Id,
                },
            };
            cy.saveDataToJson(newData);
        });
    }
    //Need to make this function dynamic.
    searchUser() {
        cy.get('a[href="/users/index"]').click();
        // cy.get('#btnReset').click();
        cy.get('#txtKeyword').type(Users.userName.split(" ")[0]);
        cy.wait(1000);
        cy.get("#btnSearch").click();
        cy.wait(1000);
        //validating the name of the UserName in the column(User Name) of the user list.
        cy.get('td[data-colid="57"]')
            .contains(Users.userName);
    }
    editUser() {
        // cy.get(':nth-child(1) > .k-button').click();
        cy.xpath(`//td//a[contains(@href,'/users/edituser/${Users.userId}')]`).click();
        let newDisplayName;
        cy.wait(1000);
        cy.get("#txtDisplayName").invoke('val').then((val) => {
            newDisplayName = val + " testUser";
            cy.get("#txtDisplayName").clear().type(newDisplayName);
        });
        cy.wait(1000);

        // cy.get("#ddlBldg").select("194775");
        cy.get('#ddlBldg') // Locate the <select> element
            .find('option') // Find all the <option> elements within the <select>
            .eq(1) // Select the first <option> element
            .then(($option) => {
                const firstSubsite = $option.val(); // Get the value attribute of the second <option>
                cy.log('Value of the first option:', firstSubsite);
                cy.get("#ddlBldg").select(firstSubsite);
            });
        cy.wait(1000);
        let mainPhone = faker.phone.number('+88 017########');
        cy.get("#txtPhone").clear().type(mainPhone);
        cy.wait(1000);
        cy.get("#txtPager").clear().type(faker.phone.number('+88 018########'));
        cy.wait(1000);
    }
    changePermissions() {
        // Updating Finance Permission.
        this.permissionAction("Finance")
        cy.get("#btnSave").click();
        cy.wait(1000);
        // Updating Invenotory Categories Permission.
        this.permissionAction("Inventory Categories")
        cy.get("#btnSave").click();
        cy.wait(1000);
        // Updating Vendor Permission.
        this.permissionAction("Vendors")
        cy.get("#btnSave").click();
        cy.wait(1000);
        // Updating Sites Permission.
        this.permissionAction("Sites");
        cy.get("#btnSave").click();
        cy.wait(1000);
    }

    permissionAction(ModuleName) {
        // cy.contains('tr[role="row"] td[role="gridcell"]', ModuleName)
        //     .next('td[role="gridcell"]')
        //     .find('a.k-grid-edit')
        cy.contains('tr[role="row"] td[role="gridcell"]', ModuleName)
            .siblings('td[role="gridcell"]')
            .find('a.k-grid-edit').click();

        cy.get('span.k-input').click().as('dropdown');

        cy.get('@dropdown').then(($dropdown) => {
            if ($dropdown.length > 0) {
                cy.wrap($dropdown).type('{downarrow}{downarrow}{downarrow}{enter}');
            }
        });
        cy.contains('tr[role="row"] td[role="gridcell"]', ModuleName)
            .siblings('td[role="gridcell"]')
            .find('a.k-grid-update').click();

    }
    setUpJurisdictions(tab) {
        cy.get(`[aria-controls=${tab}] > .k-link`).click();
        cy.wait(1000);
        cy.get('#ddlJurisdictionView').select('Disabled').should('have.value', 'false');
        // Wait for the options to load
        cy.wait(1000);
        cy.get('#ddlJurisdictionView').select('Disabled').should('have.value', 'false');
        cy.wait(1000);
        cy.get('input[value="93975"]').click();
        cy.wait(1000);
        cy.get('input[value="62582"]').click();
        cy.wait(1000);
        cy.get('input[value="93983"]').click();
        cy.get('#btnSaveJurisdiction').click();
        // Wait for the save operation to complete
        cy.get('#ddlJurisdictionView').select('Enabled').should('have.value', 'true');
        cy.wait(1000);
        cy.get('#btnSaveJurisdiction').click();
        cy.wait(1000)
        // // Wait for the save operation to complete
        // cy.wait(1000);
        //Validating the Sites that the User has access to
        const SiteNames = ['3-24-2023_Site_1', 'Arizona Water', 'Lakeside Villa', 'Villa Azul'];
        cy.xpath('//a[contains(@href, "/sites/editsite/")]').each(($element, index) => {
            const SiteName = SiteNames[index];
            // Use conditional statement to check if the element's text contains the expected SiteName
            cy.wrap($element).invoke('text').then((text) => {
                if (text.includes(SiteName)) {
                    expect(text).to.eq(SiteName);
                } else {
                    cy.log(`Skipping the element ${index} as text doesn't match expected SiteName`);
                }
            });
        });
    }
    loginAsNewUser() {
        //logging out from the current user.
        cy.get('.m-tec-name').trigger('mouseover'); // Trigger the hover effect
        // Overiding the CSS property display:none to show the dropdown.
        cy.wait(1000);
        cy.get('.dropdown-content2')
            .invoke('attr', 'style', 'display: block') // Override the display property
            .should('be.visible'); // Verify that the dropdown menu is visible
        cy.contains('#lnksignout', 'Log Out').click(); // Click on the logout option
        cy.wait(1000);
        // logging in as new user.
        const login = new Login();
        cy.wait(1000);
        login.signin(Users.email, Users.password);
        //Confirm the Profile.
        cy.get("#btnSave").click();

    }

}



export default Users;