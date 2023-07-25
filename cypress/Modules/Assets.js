import 'cypress-xpath';
import { faker } from '@faker-js/faker';
class Assets {
    columnsVerify() {
        cy.xpath("//th[@role='columnheader']").then(($links) => {
            cy.wrap($links[0]).invoke('text').should('equal', 'EDIT');
            cy.wrap($links[1]).invoke('text').should('equal', 'STATUS');
            cy.wrap($links[2]).invoke('text').should('equal', 'ASSET ID');
            cy.wrap($links[3]).invoke('text').should('equal', 'DESCRIPTION');
            cy.wrap($links[4]).invoke('text').should('equal', 'CATEGORY');
            cy.wrap($links[5]).invoke('text').should('equal', 'SITE');
            cy.wrap($links[6]).invoke('text').should('equal', 'SUB-SITE');
            cy.wrap($links[7]).invoke('text').should('equal', 'AREA');
            // cy.wrap($links[8]).invoke('text').should('equal', 'BARCODE');
            // cy.wrap($links[9]).invoke('text').should('equal', 'LOCATION INSTALLED');
            // cy.wrap($links[10]).invoke('text').should('equal', 'RELATIONSHIP');
            // cy.wrap($links[11]).invoke('text').should('equal', 'SERIAL/VIN');
            // cy.wrap($links[12]).invoke('text').should('equal', 'PMS');
            // cy.wrap($links[13]).invoke('text').should('equal', 'MODEL');
            // cy.wrap($links[14]).invoke('text').should('equal', 'MANUFACTURER');
            // cy.wrap($links[15]).invoke('text').should('equal', 'WORK ORDER');
            // cy.wrap($links[16]).invoke('text').should('equal', 'HISTORY');
            // cy.wrap($links[17]).invoke('text').should('equal', 'READING');
        });
    }
    filtersVerify() {
        cy.get('label').then(($links) => {
            cy.wrap($links[0]).invoke('text').should('contain', 'VIEW');
            cy.wrap($links[1]).invoke('text').should('contain', 'STATUS');
            cy.wrap($links[2]).invoke('text').should('contain', 'SITE');
            cy.wrap($links[5]).invoke('text').should('contain', 'CATEGORY');
            cy.wrap($links[6]).invoke('text').should('contain', 'RELATIONSHIP');
        });
    }
    filterUsingSiteAndCategory() {
        cy.get('#btnReset').click();
        cy.get('#site').select("93975").invoke("text").should("contain", "3-24-2023_Site_1");
        cy.get('#category').select("9787").invoke("text").should("contain", "Air Conditioner");
        // Validating that after filtering the Category and Site column contains the filtered category.
        let tableRow;
        cy.get('tr').its('length').then((length) => {
            cy.log(`There are ${length} tr tags on the page.`);
            tableRow = length - 8;
        }).then(() => {
            for (let i = tableRow; i < length - 1; i++) {
                cy.get('tr').eq(i).find('td[data-colid="78"]')
                    .contains('Air Conditioner');
                cy.get('tr').eq(i).find('td[data-colid="79"]').find('a')
                    .contains('3-24-2023_Site_1');
            }
        })
    }
    static assetId;
    static assetIdFromUrl;
    createNewAsset() {
        //generating id of the asset as current date (MM.DD.YY)
        const currentDate = new Date();
        const year = currentDate.getFullYear().toString().slice(-2).padStart(2, '0'); // [year = last 2 digits of the current year]
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // [month = current month (with leading zero)]
        const day = currentDate.getDate().toString().padStart(2, '0'); // [day = current day of the month (with leading zero)]
        const randomNum = Math.floor(Math.random() * 100);
        Assets.assetId = `${month}${day}${year}.${randomNum}`;
        cy.log("Asset ID:", Assets.assetId);
        let assetName = `Asset Test - ${randomNum}`;
        let address = faker.address.streetAddress(true);
        cy.get("a[onclick='CheckAssetLimit()']").click();
        cy.get('#txtAssetCode').clear().type(Assets.assetId);
        cy.get('#txtDisplayName').clear().type(assetName);
        cy.get('#ddlCategory').select("9787");
        // new site created added to the asset.
        cy.get("#ddlSite").select("93975|194763");
        cy.get("#txtLocation").clear().type(address);
        cy.get("#btnSave").click();
        cy.wait(1000);
        cy.url().then((url) => {
            Assets.assetIdFromUrl = url.split('/').slice(-1)[0].replace(/\D/g, '');
            cy.log(`Asset ID:${Assets.assetIdFromUrl}`);
        });
    }
    searchAsset() {
        cy.get('a[href="/assets/index"]').click();
        cy.get('#txtKeyword').type(Assets.assetId);
        // cy.wait(1000);
        cy.get("#btnSearch").click();
        //validating the name of the Asset ID in the column(Asset Id) of the Asset list.
        cy.xpath(`//td//a//span[contains(text(),"${Assets.assetId}")]`).contains(Assets.assetId);
    }
    editAsset() {
        cy.xpath(`//td//a[contains(@href,'/assets/editasset/${Assets.assetIdFromUrl}')]`).eq(0).click();
        cy.get("#ddlManufacturer").select("11592");
        cy.get("#txtModel").type(faker.vehicle.model());
        cy.get("#txtSerialVIN").type(faker.vehicle.vin());
        const barcodeNumber = faker.random.numeric(12);
        cy.get("#txtBarcode").type(barcodeNumber);
        cy.get("#btnSave").click();
    }
    setOnline() {
        cy.get("#btnChangeAssetStatus").click();
        cy.get("#winAssetDowntime", { timeout: 10000 }).should("be.visible");
        cy.wait(1000);
        cy.frameLoaded('iframe.k-content-frame');
        cy.iframe('iframe.k-content-frame').within(() => {
            // setting a date two days from before.
            cy.get('.k-i-calendar').click({ force: true }).as('calendarIcon');
            cy.get('@calendarIcon').then(($calendar) => {
                cy.wrap($calendar).type('{leftarrow}{leftarrow}{enter}');
            });
            cy.get("#ddlReason").select("5967");
            cy.get("#txtExplanation").type(faker.lorem.sentence(5));
            cy.get("#btnSetAssetOnline").click();
        });
        cy.wait(1000);
        // Making sure that the asset has been set online.
        cy.get('#spnAssetStatus > span').invoke("text").should("equal", "ONLINE")
    }

}

export default Assets;