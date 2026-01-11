package se.kth.journal.journalservice.controller;

import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import se.kth.journal.journalservice.entity.Condition;
import se.kth.journal.journalservice.entity.Patient;
import se.kth.journal.journalservice.repository.PatientRepository;
import se.kth.journal.journalservice.service.ConditionService;

import java.util.Map;
@RestController
@RequestMapping("/conditions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ConditionController {

    private final ConditionService service;
    private final PatientRepository patientRepo;

    // Doctor / Staff
    @PostMapping
    @RolesAllowed({ "DOCTOR", "STAFF" })
    public ResponseEntity<?> create(@RequestBody Condition c) {
        return ResponseEntity.ok(service.create(c));
    }

    // PATIENT → mina diagnoser
    @GetMapping("/me")
    @RolesAllowed("PATIENT")
    public ResponseEntity<?> myConditions(Authentication auth) {
        Jwt jwt = (Jwt) auth.getPrincipal();
        String keycloakId = jwt.getSubject();

        Patient p = patientRepo.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new RuntimeException("No patient linked"));

        return ResponseEntity.ok(service.getByPatient(p.getId()));
    }

    // DOCTOR / STAFF
    @GetMapping("/patient/{id}")
    @RolesAllowed({ "DOCTOR", "STAFF" })
    public ResponseEntity<?> byPatient(@PathVariable Long id) {
        return ResponseEntity.ok(service.getByPatient(id));
    }

    // Doctor / Staff / Patient
    @GetMapping("/{id}")
    @RolesAllowed({ "DOCTOR", "STAFF", "PATIENT" })
    public ResponseEntity<?> get(@PathVariable Long id) {
        return service.get(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404)
                        .body(Map.of("error", "Condition not found")));
    }

    // Staff only
    @GetMapping
    @RolesAllowed("STAFF")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @DeleteMapping("/{id}")
    @RolesAllowed({ "DOCTOR", "STAFF" })
    public ResponseEntity<?> delete(@PathVariable Long id) {
        boolean removed = service.delete(id);
        if (removed) return ResponseEntity.ok(Map.of("status", "deleted"));
        return ResponseEntity.status(404).body(Map.of("error", "Condition not found"));
    }
}
