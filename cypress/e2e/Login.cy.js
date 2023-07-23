import Login from "../Modules/Login";
describe('Log in to the System', () => {
  const login = new Login();
  before(()=>{
    cy.viewport(1850,1040);
  })
  it('Login into the dashboard', () => {
    login.signin("admin1@nf.com", "Tdksk23kdiKsel");
  })
})