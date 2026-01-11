import { createRoot } from "react-dom/client";
import App from "./App";
import keycloak from "./auth/keycloak";

keycloak
    .init({
        onLoad: "login-required",
        pkceMethod: "S256",
        checkLoginIframe: false,
    })
    .then(() => {
        createRoot(document.getElementById("root")).render(
            <App keycloak={keycloak} />
        );
    })
    .catch(err => {
        console.error("Keycloak init failed", err);
    });
