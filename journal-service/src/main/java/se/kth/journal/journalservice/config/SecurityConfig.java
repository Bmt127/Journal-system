package se.kth.journal.journalservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))  // Konfigurera CORS
                .csrf(csrf -> csrf.disable())  // Stänger av CSRF-skydd (passar bra för API:er)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)  // Ingen sessionshantering
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()  // Tillåt OPTIONS-metod för alla vägar
                        .requestMatchers("/actuator/**").permitAll()  // Offentliga actuator endpoints
                        .requestMatchers("/patients/me").permitAll()  // Offentlig endpoint för testning av patienter
                        .requestMatchers("/healthz").permitAll()  // Offentlig hälsokontroll
                        .anyRequest().authenticated()  // Alla andra vägar kräver autentisering
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .jwtAuthenticationConverter(jwtAuthenticationConverter())  // Anpassa hur JWT-token konverteras
                                .decoder(jwtDecoder())  // Dekodera JWT med JWK
                        )
                );

        return http.build();
    }

    // Dekodera JWT-token med hjälp av JWK Set URI
    @Bean
    public JwtDecoder jwtDecoder() {
        // Här använder vi en extern URL för JWK Set URI. Byt till rätt Keycloak-server URL.
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withJwkSetUri("https://keycloakk.app.cloud.cbh.kth.se/realms/journal/protocol/openid-connect/certs").build();

        // För att tillåta tokenvalidering även om vi kör i Docker eller på olika nätverk
        jwtDecoder.setJwtValidator(token -> org.springframework.security.oauth2.core.OAuth2TokenValidatorResult.success());

        return jwtDecoder;
    }

    // Konvertera JWT till rätt auktoriteter baserat på roller
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Map<String, Object> realmAccess = jwt.getClaim("realm_access");
            if (realmAccess == null || realmAccess.isEmpty()) {
                return Collections.emptyList();
            }

            @SuppressWarnings("unchecked")
            Collection<String> roles = (Collection<String>) realmAccess.get("roles");
            if (roles == null) {
                return Collections.emptyList();
            }

            return roles.stream()
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                    .collect(Collectors.toList());
        });
        return converter;
    }

    // Konfigurera CORS för att tillåta förfrågningar från rätt ursprung
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));  // Lägg till din frontend-URL för utveckling
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With", "Accept"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);  // CORS-förfrågningar kan cacheas under 1 timme

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
