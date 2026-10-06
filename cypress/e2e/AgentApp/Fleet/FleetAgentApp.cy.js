import LoginPage from "../../../pages/AgentApp/Fleet/LoginPage";


describe("Fleet Agent App Login Test", () => {

    before(()=>{
        LoginPage.visit();
    })

    beforeEach(()=>{
        cy.clearCookies();
        cy.clearAllLocalStorage();
        cy.clearAllSessionStorage();
        cy.visit("/login");
    })

    it("Verify Fleet Agent App Login", () => {
        LoginPage.headingTitle();
        LoginPage.email();
        LoginPage.loginButton();
        LoginPage.password();
        LoginPage.loginButton();
    })


});