import { Navigate } from "react-router-dom";

export default function RoleRoute({ allowedRoles, userRoles, children }) {
    const hasAccess = allowedRoles.some(role => userRoles.includes(role));

    if (!hasAccess) {
        return <Navigate to="/" replace />;
    }

    return children;
}
