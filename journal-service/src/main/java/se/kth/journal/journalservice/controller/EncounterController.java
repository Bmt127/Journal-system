package se.kth.journal.journalservice.controller;

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
@CrossOrigin(origins = "*")
public class EncounterController {

    private final EncounterService service;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Encounter e) {
        return ResponseEntity.ok(service.create(e));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> get(@PathVariable Long id) {
        return service.get(id)
                .<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.status(404).body(
                                Map.of("error", "Encounter not found")
                        )
                );
    }

    // ======================================================
    // ✔ FIXED ENDPOINT SO IT MATCHES SEARCH-SERVICE EXPECTATION
    // ======================================================
    @GetMapping("/practitioner/{practitionerId}")
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

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(service.getByPatient(patientId));
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        boolean removed = service.delete(id);

        if (removed) {
            return ResponseEntity.ok(Map.of("status", "deleted"));
        }
        return ResponseEntity.status(404).body(Map.of("error", "Encounter not found"));
    }
}
