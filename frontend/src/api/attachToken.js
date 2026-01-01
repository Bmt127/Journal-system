// src/api/attachToken.js
import keycloak from "../keycloak";

export function attachToken(apiInstance) {
    apiInstance.interceptors.request.use(config => {
        if (keycloak.token) {
            config.headers.Authorization = `Bearer ${keycloak.token}`;
        }
        return config;
    });
}
