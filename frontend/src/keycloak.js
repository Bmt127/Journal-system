import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "https://keycloakk.app.cloud.cbh.kth.se",
    realm: "healthcare-realm",
    clientId: "frontend",
});

export default keycloak;
