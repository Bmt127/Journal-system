import { useEffect } from "react";
import { keycloak } from "../keycloak"; // Lägg till måsvingarna här!

export default function Logout() {
    useEffect(() => {
        keycloak.logout({ redirectUri: window.location.origin });
    }, []);

    return <div>Logging out...</div>;
}