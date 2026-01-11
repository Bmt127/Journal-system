package se.kth.journal.journalservice.controller;

import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import se.kth.journal.journalservice.entity.Patient;
import se.kth.journal.journalservice.service.PatientService;

import java.util.Map;

@RestController
@RequestMapping("/patients")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PatientController {

    private final PatientService service;

    @GetMapping("/me")
    @RolesAllowed({ "PATIENT", "DOCTOR", "STAFF" })
    public ResponseEntity<?> getMe(Authentication auth) {

        Jwt jwt = (Jwt) auth.getPrincipal();
        String keycloakId = jwt.getSubject();

        return service.getByKeycloakId(keycloakId)
                .<ResponseEntity<?>>map(p -> ResponseEntity.ok(p))
                .orElseGet(() -> ResponseEntity.status(404)
                        .body(Map.of("error", "No patient linked to this Keycloak user")));
    }

    @GetMapping("/{id}")
    @RolesAllowed({ "DOCTOR", "STAFF", "PATIENT" })
    public ResponseEntity<?> getById(@PathVariable Long id) {

        return service.getById(id)
                .<ResponseEntity<?>>map(p -> ResponseEntity.ok(p))
                .orElseGet(() -> ResponseEntity.status(404)
                        .body(Map.of("error", "Patient not found")));
    }


    @GetMapping
    @RolesAllowed("STAFF")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // user-service → journal-service (machine to machine)
    @PostMapping
    @RolesAllowed("STAFF")
    public ResponseEntity<?> create(@RequestBody Map<String, String> payload) {

        Patient p = service.createPatient(
                payload.get("keycloakId"),
                payload.get("username"),
                payload.get("email"),
                payload.getOrDefault("firstName", ""),
                payload.getOrDefault("lastName", "")
        );

        return ResponseEntity.ok(p);
    }
}
