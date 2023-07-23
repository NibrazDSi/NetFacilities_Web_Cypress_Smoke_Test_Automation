import Login from "../Modules/Login";
import Home from "../Modules/Home";
import Assets from "../Modules/Assets"
import WorkOrders from "../Modules/WorkOrders"
import Users from "../Modules/Users";
describe("Validating the Work Orders module", () => {
    const login = new Login();
    const home = new Home();
    const users = new Users();
    const assets = new Assets();
    const workOrders = new WorkOrders();
    before(() => {
        cy.viewport('macbook-16');
        // using existing user
        // login.signin("Leora.Greenholt@nf.com", "Tdksk23kdiKsel");
        //using new user from json file.
        login.signinUsingNewUserFromJson()
        home.workOrderModule("Work Orders","Overview");
    })
    beforeEach(() => {
        cy.wait(1000)
    })
    it("Validate that all columns are showing correctly in the Overview List.", () => {
        workOrders.columnsVerify();
    })
    it("Validate that all filters are showing correctly in the Overview list.", () => {
        workOrders.filtersVerify();
    })
    it("Validate user can filter Work Orders by Site and Service type.", () => {
        workOrders.filterUsingSiteAndServiceType();
    })
    it("Validate user can filter Work Orders by View.", () => {
        workOrders.filterUsingView();
    })
    it("Validate that user can create a new Work Order", () => {
        workOrders.createNewWorkOrder();
    })
    it("Validate user can search the newly created Work Orders from the Overview.", () => {
        workOrders.searchWorkOrder("Opened");
    })
    it("Validate user can edit the opened work order.", () => {
        workOrders.editWorkOrder();
    })
    it("Validate that user can attach Asset to a Work order.", () => {
        workOrders.attachAsset();
    })
    it("Validate that user can approve a Work order.", () => {
        workOrders.approveWorkOrder("Opened");
    })
    it("Validate that user can reassign a Work order.", () => {
        workOrders.reassignWorkOrder();
    })
    it("Validate that user can close out a Work order.", () => {
        workOrders.closeOutWorkOrder();
    })
})