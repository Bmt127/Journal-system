import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { keycloak, initKeycloak, getPatientId } from "./keycloak";

initKeycloak().then((authenticated) => {
    if (!authenticated) {
        keycloak.login();
    }

    const patientId = getPatientId();
    console.log("Patient ID från token:", patientId);

    ReactDOM.createRoot(document.getElementById("root")).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}).catch((error) => {
    console.error("Keycloak init failed", error);
});