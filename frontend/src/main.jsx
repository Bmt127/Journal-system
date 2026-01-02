import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { keycloak, initKeycloak, getPatientId } from "./keycloak"; // Importera keycloak.js

// Initiera Keycloak
initKeycloak().then((authenticated) => {
    if (!authenticated) {
        keycloak.login(); // Om användaren inte är autentiserad, logga in
    }

    // Kontrollera om patientId finns i token och logga det
    const patientId = getPatientId();
    console.log("Patient ID från token:", patientId);

    // Rendera applikationen när Keycloak är initialiserad
    ReactDOM.createRoot(document.getElementById("root")).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}).catch((error) => {
    console.error("Keycloak init failed", error);
});
