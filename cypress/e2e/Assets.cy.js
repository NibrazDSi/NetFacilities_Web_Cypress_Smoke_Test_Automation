import Login from "../Modules/Login";
import Home from "../Modules/Home";
import Assets from "../Modules/Assets"
import Users from "../Modules/Users";
describe("Validating the Assets module", () => {
    const login = new Login();
    const home = new Home();
    const users = new Users();
    const assets = new Assets();
    before(() => {
        cy.viewport('macbook-16');
        // using existing user
        // login.signin("Leora.Greenholt@nf.com", "Tdksk23kdiKsel");
        //using new user from json file.
        login.signinUsingNewUserFromJson()
        home.assetsModule("Assets", "Asset List");
    })
    beforeEach(() => {
        cy.wait(1000)
    })
    it("Validate that all columns are showing correctly in the Asset List.", () => {
        assets.columnsVerify();
    })
    it("Validate that all filters are showing correctly in the Asset List.", () => {
        assets.filtersVerify();
    })
    it("Validate that assets can be filtered by Site and Category.", () => {
        assets.filterUsingSiteAndCategory();
    })
    it("Validate that user can create a new asset", () => {
        assets.createNewAsset();
    })
    it("Validate that user can search the newly created Asset", () => {
        assets.searchAsset();
    })
    it("Validate that user can edit the newly created Asset", () => {
        assets.editAsset();
    })
    it("Validate that user can set Asset Online", () => {
        assets.setOnline();
    })

})