package se.kth.journal.journalservice.controller;

import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.kth.journal.journalservice.dto.PractitionerRequest;
import se.kth.journal.journalservice.entity.Practitioner;
import se.kth.journal.journalservice.service.PractitionerService;

import java.util.Map;

@RestController
@RequestMapping("/practitioners")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PractitionerController {

    private final PractitionerService service;

    // =====================================================
    // CREATE PRACTITIONER (USED BY USER-SERVICE)
    // =====================================================
    @PostMapping
    @RolesAllowed("STAFF")
    public ResponseEntity<?> create(@RequestBody PractitionerRequest req) {
        Practitioner saved = service.createPractitioner(req);
        return ResponseEntity.ok(saved);
    }

    // =====================================================
    // GET PRACTITIONER BY USER ID
    // Doctor / Staff (doctor dashboard + messages)
    // =====================================================
    @GetMapping("/by-user/{userId}")
    @RolesAllowed({ "DOCTOR", "STAFF" })
    public ResponseEntity<Object> getByUserId(@PathVariable Long userId) {
        return service.findByUserId(userId)
                .<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body(
                        Map.of("error", "Practitioner not found")
                ));
    }

    // =====================================================
    // GET PRACTITIONER BY ID
    // Doctor / Staff
    // =====================================================
    @GetMapping("/{id}")
    @RolesAllowed({ "DOCTOR", "STAFF" })
    public ResponseEntity<Object> getById(@PathVariable Long id) {
        return service.findById(id)
                .<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body(
                        Map.of("error", "Practitioner not found")
                ));
    }

    // =====================================================
    // LIST ALL PRACTITIONERS
    // Staff only (search / admin)
    // =====================================================
    @GetMapping
    @RolesAllowed("STAFF")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // =====================================================
    // DELETE PRACTITIONER
    // Staff only
    // =====================================================
    @DeleteMapping("/{id}")
    @RolesAllowed("STAFF")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        boolean removed = service.delete(id);
        if (removed) {
            return ResponseEntity.ok(Map.of("status", "deleted"));
        }
        return ResponseEntity.status(404).body(Map.of("error", "Practitioner not found"));
    }
}
