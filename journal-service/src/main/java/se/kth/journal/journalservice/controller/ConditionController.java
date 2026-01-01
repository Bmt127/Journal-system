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

    @PostMapping
    @PreAuthorize("hasAnyRole('doctor','staff')")
    public ResponseEntity<?> create(@RequestBody Condition c) {
        return ResponseEntity.ok(service.create(c));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('doctor','staff','patient')")
    public ResponseEntity<?> get(@PathVariable Long id) {
        return service.get(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404)
                        .body(Map.of("error", "Condition not found")));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('doctor','staff','patient')")
    public ResponseEntity<?> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(service.getByPatient(patientId));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('doctor','staff')")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('doctor')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return service.delete(id)
                ? ResponseEntity.ok(Map.of("status", "deleted"))
                : ResponseEntity.status(404).body(Map.of("error", "Condition not found"));
    }
}
