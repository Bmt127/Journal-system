import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Ändring: Lägg till måsvingar runt keycloak
import { keycloak } from "../keycloak";

export default function RoleRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        const roles = keycloak.tokenParsed?.realm_access?.roles || [];

        if (roles.includes("PATIENT")) {
            navigate("/patient", { replace: true });
        } else if (roles.includes("DOCTOR")) {
            navigate("/doctor", { replace: true });
        } else if (roles.includes("STAFF")) {
            navigate("/staff", { replace: true });
        } else {
            navigate("/logout", { replace: true });
        }
    }, [navigate]);

    return null;
}