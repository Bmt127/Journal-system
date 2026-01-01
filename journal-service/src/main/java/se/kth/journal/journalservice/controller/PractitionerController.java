package se.kth.journal.journalservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import se.kth.journal.journalservice.dto.PractitionerRequest;
import se.kth.journal.journalservice.entity.Practitioner;
import se.kth.journal.journalservice.service.PractitionerService;

import java.util.Map;
@RestController
@RequestMapping("/practitioners")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PractitionerController {

    private final PractitionerService service;

    //  permitAll – skapas av user-service
    @PostMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> create(@RequestBody PractitionerRequest req) {
        return ResponseEntity.ok(service.createPractitioner(req));
    }

    @GetMapping("/by-user/{userId}")
    @PreAuthorize("hasAnyRole('doctor','staff','patient')")
    public ResponseEntity<?> getByUserId(@PathVariable Long userId) {
        return service.findByUserId(userId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404)
                        .body(Map.of("error", "Practitioner not found")));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('doctor','staff')")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return service.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404)
                        .body(Map.of("error", "Practitioner not found")));
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
                : ResponseEntity.status(404).body(Map.of("error", "Practitioner not found"));
    }
}
