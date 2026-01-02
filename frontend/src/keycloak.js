import Keycloak from "keycloak-js";

// Skapa en Keycloak-instans
const keycloak = new Keycloak({
    url: "https://keycloakk.app.cloud.cbh.kth.se",
    realm: "healthcare-realm",
    clientId: "frontend",
});

// Initiera Keycloak
const initKeycloak = () => {
    return keycloak.init({
        onLoad: "login-required",
        checkLoginIframe: false,
    });
};

// Kontrollera patientId i token
const getPatientId = () => {
    return keycloak.tokenParsed?.patientId;
};

export { keycloak, initKeycloak, getPatientId };
