import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "https://keycloakk.app.cloud.cbh.kth.se",
    realm: "healthcare-realm",
    clientId: "frontend",
});

const initKeycloak = () => {
    return keycloak.init({
        onLoad: "login-required",
        checkLoginIframe: false,
    });
};

const getPatientId = () => {
    return keycloak.tokenParsed?.patientId;
};

// Ändring: Exportera allt som namngivna objekt
export { keycloak, initKeycloak, getPatientId };