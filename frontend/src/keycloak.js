import Keycloak from "keycloak-js";

// Skapa och initiera Keycloak-instansen
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

// Funktion för att hämta patientId från token
const getPatientId = () => {
    return keycloak.tokenParsed?.patientId;
};

// Exportera keycloak som standardexport
export default keycloak;

// Exportera initKeycloak och getPatientId som namngivna exporter
export { initKeycloak, getPatientId };
