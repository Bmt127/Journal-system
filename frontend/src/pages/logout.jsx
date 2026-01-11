import { useEffect } from "react";

export default function Logout({ keycloak }) {
    useEffect(() => {
        keycloak.logout({
            redirectUri: window.location.origin,
        });
    }, [keycloak]);

    return null;
}
