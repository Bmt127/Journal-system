import { useEffect } from "react";
import keycloak from "../keycloak";

export default function Logout() {
    useEffect(() => {
        keycloak.logout({
            redirectUri: window.location.origin,
        });
    }, []);

    return null;
}
