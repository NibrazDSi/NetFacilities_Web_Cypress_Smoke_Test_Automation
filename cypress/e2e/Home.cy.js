import Login from "../Modules/Login";
import Home from "../Modules/Home";
describe('Validating the Home Page', () => {
  const login = new Login();
  const home = new Home();
  before(() => {
    cy.viewport(1850, 1040);
    // login.settingCookie("admin1@nf.com", "Tdksk23kdiKsel");
    login.signin("admin1@nf.com", "Tdksk23kdiKsel");
    // cy.maintainingSession("admin1@nf.com", "Tdksk23kdiKsel");
    // cy.saveLocalStorage();
  })
  it('Work Orders module is displayed and upon clicking user is navigated to Overview Page', () => {
    // cy.visit('/myhome');
    home.workOrderModule("Work Orders","Overview");
  })
  it('Activities module is displayed and upon clicking user is navigated to Schedules tab', () => {
    // cy.visit('/myhome');
    home.activitiesModule("Activities","Calendar");
  })
  it('Sites module is displayed and upon clicking user is navigated to Site List', () => {
    home.sitesModule("Sites","Site List");
  })
  it('Users module is displayed and upon clicking user is navigated to User List', () => {
    home.usersModule("Users","User List");
  })
  it('Vendors module is displayed and upon clicking user is navigated to Vendor List', () => {
    home.vendorsModule("Vendors","Vendor List");
  })
  it('Assets module is displayed and upon clicking user is navigated to Asset List', () => {
    home.assetsModule("Assets","Asset List");
  })
  it('Inventory module is displayed and upon clicking user is navigated to Inventory List', () => {
    home.inventoryModule("Inventory","Inventory List");
  })
  afterEach(() => {
    // cy.restoreLocalStorage();
    home.backToHome();
  })
  
  it("Verifying that log out option is showing in the home screen", () => {
    home.logoutOption("Log Out");
  })
})