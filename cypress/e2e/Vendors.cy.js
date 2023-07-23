import Login from "../Modules/Login";
import Home from "../Modules/Home";
import Vendors from "../Modules/Vendors"
import Users from "../Modules/Users";
describe("Validating the Vendors module", () => {
    const login = new Login();
    const home = new Home();
    const users = new Users();
    const vendors = new Vendors();
    before(() => {
        cy.viewport('macbook-16');
        // using existing user
        // login.signin("Leora.Greenholt@nf.com", "Tdksk23kdiKsel");
        //using new user from json file.
        login.signinUsingNewUserFromJson()
        home.vendorsModule("Vendors", "Vendor List");
    })
    beforeEach(() => {
        cy.wait(1000)
    })
    it("Validate that all columns are showing correctly in the Vendor List.", () => {
        vendors.columnsVerify();
    })
    it("Validate that all filters are showing correctly in the Vendor List.", () => {
        vendors.filtersVerify();
    })
    it("Validate that user can create a new vendor", () => {
        vendors.createNewVendor();
    })
    it("Validate that user can search the newly created vendor in the Master View as no Jurisdiction is set", () => {
        vendors.searchVendor("Master");
    })
    it("Validate that user can edit the newly created Vendor", () => {
        vendors.editVendor();
    })
    it("Validate that user can add new Contact Info", () => {
        vendors.addNewContactInfo();
    })
    it("Validate that user can set up Jurisdictions for the Vendor", () => {
        vendors.setVendorJurisdictions();
    })
    it("Validate that user can search the vendor in the active view as Jurisdictions is set ", () => {
        vendors.searchVendorActiveView();
    })


});
