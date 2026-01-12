import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    // Ändra URL:en från localhost till molnet
    url: "https://keycloakk.app.cloud.cbh.kth.se",
    realm: "journal",
    clientId: "frontend",
});

export default keycloak;