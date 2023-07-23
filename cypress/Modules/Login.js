class Login {
    signin(useremail, password) {
        cy.visit('/');
        cy.get('#email').type(useremail);
        cy.get('#password').type(password);
        cy.get('#btnSubmit').click();
    }
    signinUsingNewUserFromJson() {
        cy.visit('/');
        cy.readDataFromJson().then((userData) => {
            const email= userData.Users["userEmail"]
            cy.log("Email:",email);
            cy.get('#email').type(email);
            cy.get('#password').type("Tdksk23kdiKsel");
            cy.get('#btnSubmit').click();
        })
    }
    //     settingCookie(useremail, password) {
    //         this.signin(useremail, password);
    //         // cy.url().should('include', 'myhome')
    //         cy.getCookies().then((cookies) => {
    //             let authCookies = []
    //             // Loop through all cookies to find the authentication cookies
    //             cookies.forEach((cookie) => {

    //                 authCookies.push(cookie)

    //             })

    //             if (authCookies.length > 0) {
    //               // Set the authentication cookies and log them to the console
    //               authCookies.forEach((cookie) => {
    //                 cy.setCookie(cookie.name, cookie.value)
    //                 cy.log(`Set authentication cookie ${cookie.name}: ${cookie.value}`)
    //               })
    //             } else {
    //               // Handle the case where the authentication cookies are not found
    //               cy.log('Authentication cookies not found')
    //             }
    //           })
    //         cy.visit('https://mvc.netfacilities.com/myhome', {
    //             onBeforeLoad(win) {
    //                 win.sessionStorage.clear()
    //                 win.localStorage.clear()
    //                 win.document.cookie = 'ASP.NET_SessionId=' + Cypress.Cookies.get('ASP.NET_SessionId').value
    //             },
    //         })

    //     }
   
}
export default Login;