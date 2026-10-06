import FleetAgentTestData from "../../../testData/FleetAgentAppTestData";

class LoginPage {

    static visit = () => {
        cy.visit("https://agents.staging.nirvanatech.com/");
    }

    static headingTitle = () => {
        cy.get("h1").should("have.text", FleetAgentTestData.HeadingTitle);
    }
  
    static email = () =>{
        cy.get("[name='identifier']").type(FleetAgentTestData.emailText);
    }

    static password = () =>{
        cy.get("[name='password']").type(FleetAgentTestData.passwordText);
    }

    static loginButton = () =>{
        cy.get("button").contains("Continue").click();
    }

}

export default LoginPage;