// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
// let  LOCAL_STORAGE_MEMORY= {};
// Cypress.Commands.add("saveLocalStorage",() => {
//     Object.keys(localStorage).forEach((key)=>{
//         LOCAL_STORAGE_MEMORY[key]=localStorage[key];
//     });
// });
// Cypress.Commands.add("restoreLocalStorage",() => {
//     Object.keys(LOCAL_STORAGE_MEMORY).forEach((key)=>{
//         localStorage.setItem(key,LOCAL_STORAGE_MEMORY[key]);
//     });
// });
// import Login from "../Modules/Login";
// Cypress.Commands.add('maintainingSession',(username,password)=>{
//     const login = new Login();
//     cy.session([username,password],()=>{        
//         login.signin(username,password);
//     },
//     {
//         cacheAcrossSpecs:true
//     }
//     )
// })
Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });  
// Cypress.Commands.overwrite('type', (originalFn,subject,text,options) => {
//   return cy.wrap(originalFn,subject,text,options).then((result) =>{
//     const result = originalFn(subject, text,options)  
//    if (options && options.delay === false) {
//     return result;
//   }
//   cy.wait(2000);
//   return result;
  
//   }
//   )});
    // cy.wrap(subject).click();
import 'cypress-iframe';
// Adding JSON Read and Write Custom command.
Cypress.Commands.add('saveDataToJson',(data)=>{
  const filePath='cypress/fixtures/Data.json';
  cy.writeFile(filePath,JSON.stringify(data));
});
Cypress.Commands.add('readDataFromJson',()=>{
  const filePath='cypress/fixtures/Data.json';
  return cy.readFile(filePath);
});


  
  
