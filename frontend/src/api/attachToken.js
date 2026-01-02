import {keycloak} from "../keycloak";

export function attachToken(apiInstance) {
    apiInstance.interceptors.request.use(async (config) => {
        if (keycloak.token) {
            await keycloak.updateToken(30);
            config.headers.Authorization = `Bearer ${keycloak.token}`;
        }
        return config;
    });
}
