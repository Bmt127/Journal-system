package se.kth.journal.journalservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import se.kth.journal.journalservice.entity.Condition;
import se.kth.journal.journalservice.service.ConditionService;

import java.util.Map;

@RestController
@RequestMapping("/conditions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ConditionController {

    private final ConditionService service;

    // Doctor och staff får skapa diagnoser
    @PostMapping
    @PreAuthorize("hasAnyRole('doctor','staff')")
    public ResponseEntity<?> create(@RequestBody Condition c) {
        return ResponseEntity.ok(service.create(c));
    }

    // Doctor, staff och patient får läsa
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('doctor','staff','patient')")
    public ResponseEntity<Object> get(@PathVariable Long id) {
        return service.get(id)
                .<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.status(404).body(
                                Map.of("error", "Condition not found")
                        )
                );
    }

    // Doctor, staff och patient får läsa patientens conditions
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('doctor','staff','patient')")
    public ResponseEntity<?> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(service.getByPatient(patientId));
    }

    // Endast doctor och staff får se alla
    @GetMapping
    @PreAuthorize("hasAnyRole('doctor','staff')")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // Endast doctor får ta bort
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('doctor')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        boolean removed = service.delete(id);

        if (removed) {
            return ResponseEntity.ok(Map.of("status", "deleted"));
        }
        return ResponseEntity.status(404).body(Map.of("error", "Condition not found"));
    }
}
