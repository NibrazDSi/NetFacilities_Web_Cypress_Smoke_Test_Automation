import 'cypress-xpath';
import { faker } from '@faker-js/faker';

class WorkOrders {
    columnsVerify() {
        cy.xpath("//th[@role='columnheader']").then(($links) => {
            cy.wrap($links[0]).invoke('text').should('equal', 'FILE');
            cy.wrap($links[1]).invoke('text').should('equal', 'ACTIONS');
            cy.wrap($links[2]).find("a.k-link").invoke('text').should('equal', 'WORK ORDER');
            cy.wrap($links[3]).invoke('text').should('equal', 'INDICATORS');
            cy.wrap($links[6]).find("a.k-link").invoke('text').should('equal', 'CURRENT STATUS');
            cy.wrap($links[7]).find("a.k-link").invoke('text').should('equal', 'SITE NAME');
            cy.wrap($links[8]).find("a.k-link").invoke('text').should('equal', 'LOCATION');
            cy.wrap($links[9]).find("a.k-link").invoke('text').should('equal', 'ORIGINATOR');
            cy.wrap($links[10]).find("a.k-link").invoke('text').should('equal', 'SERVICE TYPE');
            cy.wrap($links[11]).find("a.k-link").invoke('text').should('equal', 'OUTPUT TO');
            cy.wrap($links[12]).find("a.k-link").invoke('text').should('equal', 'ASSIGNED TO');
            cy.wrap($links[13]).find("a.k-link").invoke('text').should('equal', 'SCHEDULE DATE');
            cy.wrap($links[14]).find("a.k-link").invoke('text').should('equal', 'PRIORITY');
            cy.wrap($links[15]).find("a.k-link").invoke('text').should('equal', 'OVERDUE DATE');
            cy.wrap($links[16]).find("a.k-link").invoke('text').should('equal', 'ASSET');
            cy.wrap($links[17]).find("a.k-link").invoke('text').should('equal', 'SYMPTOM/TASK');
            cy.wrap($links[18]).find("a.k-link").invoke('text').should('equal', 'CREATED DATE');
        });
    }
    filtersVerify() {
        cy.get('label').then(($links) => {
            cy.wrap($links[3]).invoke('text').should('contain', 'VIEW');
            cy.wrap($links[4]).invoke('text').should('contain', 'SITE');
            cy.wrap($links[7]).invoke('text').should('contain', 'OUTPUT');
            cy.wrap($links[9]).invoke('text').should('contain', 'WO TYPE');
            cy.wrap($links[10]).invoke('text').should('contain', 'SERVICE TYPE');
            cy.wrap($links[11]).invoke('text').should('contain', 'DEPARTMENT');
        });
    }
    filterUsingSiteAndServiceType() {
        //waiting for the API to get resolved.
        cy.intercept('POST', "/WorkOrder/GetOverview").as("overviewLoad");
        cy.get('#btnReset').click();
        cy.wait(2000);
        cy.wait('@overviewLoad');
        cy.get('#site').select("93975");
        // Wait for the data to load (adjust the time according to your application)
        cy.wait('@overviewLoad');
        // Perform the assertion
        cy.get('#site').invoke("text").should("contain", "3-24-2023_Site_1");
        cy.wait(1000);
        //finding the index of the dropdown option "Accoustics" (The index changes, so made it dynamic.)
        let optionIndex;
        cy.get('#serviceType').then(($select) => {
            optionIndex = Cypress.$($select).find('option[value="173"]').index();
            cy.log('Index of "Acoustics" option:', optionIndex);
        });
        cy.get('.multiSelectBox_wrap').eq(1).click().as('dropdown');
        cy.get('@dropdown').then(($dropdown) => {
            // Creating an array of length = optionIndex and filling it with {downarrow} as value and joining it as a single string.
            const downArrowPresses = Array(optionIndex).fill('{downarrow}').join('');
            cy.wrap($dropdown).type(`${downArrowPresses}{enter}`);
        });
        cy.get('.overviewButton').click();
        cy.wait(2500);
        cy.wait('@overviewLoad');
        cy.get("#serviceType").invoke("text").should("contain", "Acoustics");
        cy.wait(1000);
        // Validating that after filtering the Site and Serive Type column contains the filtered option.
        cy.get('tr[role="row"]').its('length').then((length) => {
            cy.log(`There are ${length} tr tags on the page.`);
            for (let i = 1; i < length; i++) {
                cy.get('tr[role="row"]').eq(i).find('td[data-colid="11"]')
                    .contains('3-24-2023_Site_1');
                cy.get('tr[role="row"]').eq(i).find('td[data-colid="13"]').find('span.OverviewWOID')
                    .contains('Acoustics');
            }
        });
    }
    filterUsingView() {
        //waiting for the API to get resolved.
        cy.intercept('POST', "/WorkOrder/GetOverview").as("overviewLoad");
        cy.get('#btnReset').click();
        cy.wait(2000);
        cy.wait('@overviewLoad');
        cy.get("#view").select("6");
        cy.wait('@overviewLoad');
        // Validate that all the Work Orders are filtered according to the View.
        cy.get(".overviewStatus").then(($row) => {
            const rowLength = $row.length; // Access the length of the resolved valueS
            for (let i = 0; i < rowLength; i++) {
                cy.wrap($row[i]).invoke("text").should("equal", "Completed");
                cy.wait(1000);
            }
        });
    }
    static workOrderFromUrl;
    createNewWorkOrder() {
        cy.wait(1500);
        cy.get("a[href='/workorder/details']").eq(1).click();
        cy.wait(1000);
        cy.get(".k-select").then(($dropdownSelect) => {
            //selecting the site and subsite.
            cy.wrap($dropdownSelect[0]).invoke('show').click().type("{downarrow}{enter}");
            cy.wait(1500);
            cy.wrap($dropdownSelect[1]).invoke('show').click().type("{downarrow}{enter}");
            cy.wait(1500);
        })
        //Selecting time.
        const randomNumber = Cypress._.random(0, 30);
        cy.log(randomNumber);
        const downArrowPresses = Array(randomNumber).fill('{downarrow}').join('');
        cy.get("span[aria-controls='txtTime_timeview']").invoke('show').click().type(`${downArrowPresses}{enter}`);
        // Selecting the first element among the duplicated option.
        cy.get('#ddlServiceType').then($option => { $option.val("264") });
        cy.get("#txtServiceDesc").type(faker.lorem.sentences());
        cy.get("#ddlClass").select("1659");
        cy.get("#btnSubmit").click();
        // Wait for the URL to contain the desired path
        cy.url().should('include', '/workorder/choose');
        cy.url().then((url) => {
            WorkOrders.workOrderFromUrl = url.split('/').slice(-1)[0];
            cy.log(`WorkOrder ID:${WorkOrders.workOrderFromUrl}`);
        });
    }
    searchWorkOrder(status) {
        //waiting for the API to get resolved.
        cy.intercept('POST', "/WorkOrder/GetOverview").as("overviewLoad");
        cy.get("a[href='/workorder/overview']").click();
        cy.wait('@overviewLoad');
        cy.get('#btnReset').click();
        cy.wait('@overviewLoad');
        cy.get("#txtKeyword").type(WorkOrders.workOrderFromUrl);
        cy.get("#btnSearch").click();
        cy.wait('@overviewLoad');
        // Asserting that the search results extracted the correct Work order.
        cy.get(".OverviewWOID").eq(0).invoke("text").should("equal",WorkOrders.workOrderFromUrl);
        // Assert that the WO status is opened.
        if (status === "Opened") {
            cy.get(".overviewStatus").invoke("text").should("equal", "Opened");
        }
        else if (status === "Approved"){
            cy.get(".overviewStatus").invoke("text").should("equal", "Approved");
        }
        else{
            cy.get(".overviewStatus").invoke("text").should("equal", "Completed");            
        }
    }
    editWorkOrder() {
        cy.get(".top-menu").click();
        cy.get(`li a[href='/workorder/details/${WorkOrders.workOrderFromUrl}']`).click();
        // waiting for the edit work order page to load.
        cy.url().should('include', '/workorder/details');
        cy.wait(1500);
        cy.get(':nth-child(3) > .k-widget > .k-dropdown-wrap > .k-input').click().type("{downarrow}{enter}");
        cy.get("#txtLocationDesc").clear().type(`Located at ${faker.address.streetAddress()}`);
        cy.wait(1500);
        cy.get("#ddlSymptoms").select("65098");
        //updating budget
        cy.get(".k-numeric-wrap").clear().type(Cypress._.random(0, 15));
        cy.get("#btnUpdate").click();
    }
    attachAsset() {
        // wait for the url to load.
        cy.url().should('include', '/workorder/details');
        cy.get("#aAssetWin").click();
        cy.wait(1000);
        cy.get('span[class="k-input"]',{force:true}).eq(3).click().type("{downarrow}{enter}");
        cy.get('#btnContinue').click();
        // Validate that an asset has been attached and a label came.
        cy.get(".l-k").eq(13).invoke("text").should("equal", "ASSET");
        cy.get("#btnUpdate").click();
    }
    approveWorkOrder(status) {
        cy.get(`a[href='/workorder/choose/${WorkOrders.workOrderFromUrl}']`).click();
        cy.wait(1200);
        cy.get("#btnContinue").click();
        // wait for the url to load.
        cy.url().should('include', '/workorder/approve');
        cy.get("#ddlCallTracking").select("1");
        cy.get("#ddlOutputTo").select("-1");
        cy.wait(1000);
        //selecting assignees.
        if (status === "Approve" || status === "Opened") {
            cy.get(".k-multiselect-wrap").eq(0).click().type(`${this.getRandomKeyCombination()}${this.getRandomKeyCombination()}${this.getRandomKeyCombination()}`);
        }
        else {
            cy.get("span[aria-label='delete']").then(($cross) => {
                for (let i = 0; i < $cross.length; i++) {
                    cy.wrap($cross[i]).click();
                }
            })
            cy.get(".k-multiselect-wrap").eq(0).click().type(`${this.getRandomKeyCombination()}${this.getRandomKeyCombination()}`);

        }
        //click on outside
        cy.get(".k-tabstrip-wrapper").click();
        cy.get("#btnSend").click();
    }
    getRandomKeyCombination = () => {
        const numKeys = Math.floor(Math.random() * 15) + 1;
        const downArrowCombination = Array.from({ length: numKeys }, () => '{downarrow}').join('');
        return `{downarrow}${downArrowCombination}{enter}`;
    };

    reassignWorkOrder() {
        this.searchWorkOrder("Approved");
        cy.get(".top-menu").click();
        this.approveWorkOrder("Reassign");
    }
    closeOutWorkOrder(){
        this.searchWorkOrder("Approved");
        cy.get(".top-menu").click();
        cy.get(`li a[href='/workorder/complete/${WorkOrders.workOrderFromUrl}']`).click();
         // wait for the url to load.
         cy.url().should('include', '/workorder/complete');
         cy.get("span.k-i-calendar").click().type("{enter}");
         cy.get(".k-multiselect-wrap").eq(1).click().type(`${this.getRandomKeyCombination()}${this.getRandomKeyCombination()}${this.getRandomKeyCombination()}`);
         //click on outside
         cy.get(".k-tabstrip-wrapper").click();
         cy.get("#txtNotes").type(faker.lorem.sentences());
         cy.get("#btnCloseOut").click();
         // Assert that the Work Order status changed or not.
         this.searchWorkOrder("Completed")
    }
}
export default WorkOrders;