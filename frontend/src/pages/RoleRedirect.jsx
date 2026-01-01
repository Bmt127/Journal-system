import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import keycloak from "../keycloak";

export default function RoleRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!keycloak.authenticated) return;

        const roles = keycloak.tokenParsed?.realm_access?.roles || [];

        if (roles.includes("PATIENT")) navigate("/patient", { replace: true });
        else if (roles.includes("DOCTOR")) navigate("/doctor", { replace: true });
        else if (roles.includes("STAFF")) navigate("/staff", { replace: true });
        else navigate("/logout");
    }, [navigate]);

    return null;
}
