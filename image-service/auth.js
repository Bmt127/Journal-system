const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const keycloakRealm = "healthcare-realm";
const keycloakUrl = "https://keycloakk.app.cloud.cbh.kth.se";

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${keycloakUrl}/realms/${keycloakRealm}/protocol/openid-connect/certs`
    }),
    audience: "image-service",   // clientId i Keycloak
    issuer: `${keycloakUrl}/realms/${keycloakRealm}`,
    algorithms: ["RS256"]
});

module.exports = checkJwt;
