package se.kth.journal.journalservice.controller;

import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.kth.journal.journalservice.entity.Encounter;
import se.kth.journal.journalservice.service.EncounterService;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/encounters")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class EncounterController {

    private final EncounterService service;

    // Doctor / Staff
    @PostMapping
    @RolesAllowed({ "DOCTOR", "STAFF" })
    public ResponseEntity<?> create(@RequestBody Encounter e) {
        return ResponseEntity.ok(service.create(e));
    }

    // Doctor / Staff / Patient
    @GetMapping("/{id}")
    @RolesAllowed({ "DOCTOR", "STAFF", "PATIENT" })
    public ResponseEntity<Object> get(@PathVariable Long id) {
        return service.get(id)
                .<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.status(404).body(
                                Map.of("error", "Encounter not found")
                        )
                );
    }

    // Doctor / Staff (used by search-service)
    @GetMapping("/practitioner/{practitionerId}")
    @RolesAllowed({ "DOCTOR", "STAFF" })
    public ResponseEntity<?> getByPractitioner(
            @PathVariable Long practitionerId,
            @RequestParam(required = false) String date
    ) {
        if (date != null && !date.isBlank()) {
            LocalDate target = LocalDate.parse(date);
            List<Encounter> filtered = service.getByPractitionerOnDate(practitionerId, target);
            return ResponseEntity.ok(filtered);
        }

        return ResponseEntity.ok(service.getByPractitioner(practitionerId));
    }

    // Patient (egna) + Doctor + Staff
    @GetMapping("/patient/{patientId}")
    @RolesAllowed({ "DOCTOR", "STAFF", "PATIENT" })
    public ResponseEntity<?> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(service.getByPatient(patientId));
    }

    // Staff only
    @GetMapping
    @RolesAllowed({ "STAFF"})
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // Doctor / Staff
    @DeleteMapping("/{id}")
    @RolesAllowed({ "DOCTOR", "STAFF" })
    public ResponseEntity<?> delete(@PathVariable Long id) {
        boolean removed = service.delete(id);

        if (removed) {
            return ResponseEntity.ok(Map.of("status", "deleted"));
        }
        return ResponseEntity.status(404).body(Map.of("error", "Encounter not found"));
    }
}
