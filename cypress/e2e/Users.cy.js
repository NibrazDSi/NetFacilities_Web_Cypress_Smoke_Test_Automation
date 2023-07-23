import Login from "../Modules/Login";
import Home from "../Modules/Home";
import Users from "../Modules/Users"
describe("Validating the Users module", () => {
    const login = new Login();
    const home = new Home();
    const users = new Users();
    before(() => {
        cy.viewport('macbook-16');
        login.signin("admin1@nf.com", "Tdksk23kdiKsel");
        home.usersModule("Users", "User List");
    })
    beforeEach(() => {
        cy.wait(1000)
    })
    it("Validate that all the columns in the Users list are showing correctly.", () => {
        users.columnsVerify();
    })
    it("Validate that the filters at the bottom are showing correctly.", () => {
        users.filtersVerify();
    })
    it("Validate that user can filter sites using User Role", () => {
        users.filterUsingUserRole();
    })
    it("Validate that user can create a new user", () => {
        users.createNewUser();
    })
    it("Validate that user can search the newly User", () => {
        users.searchUser();
    })
    it("Validate that user can edit the user", () => {
        users.editUser();
    })
    it("Validate that users permission can be changed by the Advanced users",()=>{
        users.changePermissions();
    })
    it("Validate that users can set up Jurisdictions.",()=>{
        users.setUpJurisdictions("tab-2");
    })
    it("Validate that the new user created can be logged in with.",()=>{
        users.loginAsNewUser();
    })


});