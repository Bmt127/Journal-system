import keycloak from "../auth/keycloak";

export function attachAuthInterceptor(api) {
    api.interceptors.request.use(
        config => {
            // Kontrollera att token finns och inte är utgången
            if (keycloak.token) {
                config.headers.Authorization = `Bearer ${keycloak.token}`;
            }
            return config;
        },
        error => Promise.reject(error)
    );
}