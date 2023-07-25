const { defineConfig } = require("cypress");

module.exports = defineConfig({
  chromeWebSecurity:false,
  reporter: 'cypress-mochawesome-reporter',
  e2e: {
    baseUrl:"https://mvc.netfacilities.com/",
    watchForFileChanges:false,
    autoRefresh:false,
    testIsolation:false,
    // defaultCommandTimeout: 5000,
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      config.specPattern = [
        'cypress/e2e/Login.cy.js', 
        'cypress/e2e/Home.cy.js',
        'cypress/e2e/Sites.cy.js',
        'cypress/e2e/Users.cy.js',
        'cypress/e2e/Vendors.cy.js',
        'cypress/e2e/Assets.cy.js',
        'cypress/e2e/WorkOrders.cy.js'
      ]
      return config;
    },
    videoUploadOnPasses:false,
    videoCompression:false
  },
});
