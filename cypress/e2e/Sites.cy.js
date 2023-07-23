import Login from "../Modules/Login";
import Home from "../Modules/Home";
import Sites from "../Modules/Sites"
describe("Validating the Sites module", () => {
      const login = new Login();
      const home = new Home();
      const sites = new Sites();
      before(() => {
            cy.viewport(1850, 1040);
            login.signin("admin1@nf.com", "Tdksk23kdiKsel");
            home.sitesModule("Sites", "Site List");
      })
      beforeEach(() => {
            cy.wait(1000)
      })
      it("Validate that all the columns in the site list are showing correctly.",()=>{
            sites.columnsVerify();
      })
      it("Validate that the filters at the bottom are showing correctly.",()=>{
            sites.filtersVerify();
      })
      it("Validate that user can filter sites using district and region", () => {
            sites.filterUsingDistrictAndRegion();
      })
      it("Validate that user can create a new site",()=>{
            sites.createNewSite();
      })
      it("Validate that user can search the newly created site",()=>{
            sites.searchSite();
      })
      it("Validate that user can edit the site",()=>{
            sites.editSite();
      })
      it("Validate user can add new subsites",()=>{
            sites.addNewSubsite();
      })
      it("Validate user can add new areas under a subsite",()=>{
            sites.addNewArea();
      })
      // it("Validate user can delete the newly created site",()=>{
      //       sites.deleteSite();
      // })




})