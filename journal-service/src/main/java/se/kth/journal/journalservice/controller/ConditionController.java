package se.kth.journal.journalservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> create(@RequestBody Condition c) {
        return ResponseEntity.ok(service.create(c));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> get(@PathVariable Long id) {
        return service.get(id)
                .<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.status(404).body(
                                Map.of("error", "Condition not found")
                        )
                );
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
        return ResponseEntity.status(404).body(Map.of("error", "Condition not found"));
    }
}
