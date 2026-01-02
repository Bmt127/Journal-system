import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "https://keycloakk.app.cloud.cbh.kth.se",
    realm: "healthcare-realm",
    clientId: "frontend",
});

keycloak.init({
    onLoad: "login-required",
    checkLoginIframe: false,
}).then(() => {
    // Kontrollera om patientId finns i token
    const patientId = keycloak.tokenParsed?.patientId;
    console.log("Patient ID från token:", patientId);

    ReactDOM.createRoot(document.getElementById("root")).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}).catch((error) => {
    console.error("Keycloak init failed", error);
});
