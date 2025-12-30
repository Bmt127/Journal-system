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

    // Skapa practitioner (staff / doctor)
    @PostMapping
    @PreAuthorize("hasAnyRole('doctor','staff')")
    public ResponseEntity<?> create(@RequestBody PractitionerRequest req) {
        Practitioner saved = service.createPractitioner(req);
        return ResponseEntity.ok(saved);
    }

    // Hämta practitioner via userId
    @GetMapping("/by-user/{userId}")
    @PreAuthorize("hasAnyRole('doctor','staff','patient')")
    public ResponseEntity<Object> getByUserId(@PathVariable Long userId) {
        return service.findByUserId(userId)
                .<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body(
                        Map.of("error", "Practitioner not found")
                ));
    }

    // Hämta practitioner via id
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('doctor','staff')")
    public ResponseEntity<Object> getById(@PathVariable Long id) {
        return service.findById(id)
                .<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body(
                        Map.of("error", "Practitioner not found")
                ));
    }

    // Lista alla practitioners
    @GetMapping
    @PreAuthorize("hasAnyRole('doctor','staff')")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // Ta bort practitioner (endast doctor)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('doctor')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        boolean removed = service.delete(id);
        if (removed) {
            return ResponseEntity.ok(Map.of("status", "deleted"));
        }
        return ResponseEntity.status(404)
                .body(Map.of("error", "Practitioner not found"));
    }
}
