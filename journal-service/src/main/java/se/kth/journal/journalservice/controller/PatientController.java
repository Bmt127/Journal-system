package se.kth.journal.journalservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.kth.journal.journalservice.entity.Patient;
import se.kth.journal.journalservice.service.PatientService;

import java.util.Map;

@RestController
@RequestMapping("/patients")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PatientController {

    private final PatientService service;

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return service.getById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).body(Map.of("error", "Patient not found")));
    }


    @GetMapping("/by-user/{userId}")
    public ResponseEntity<?> getByUserId(@PathVariable Long userId) {
        return service.getByUserId(userId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).body(Map.of("error", "Patient not found")));
    }


    // ============================================================
    // CREATE PATIENT (USED BY USER-SERVICE)
    // ============================================================
    @PostMapping
    public ResponseEntity<?> createPatient(@RequestBody Map<String, Object> payload) {

        try {
            Long userId = Long.valueOf(payload.get("userId").toString());
            String username = payload.getOrDefault("username", "").toString();
            String email = payload.getOrDefault("email", "").toString();

            // Extract first/last name from username (important for SEARCH)
            String[] parts = username.trim().split(" ");
            String firstName = parts.length > 0 ? parts[0] : "";
            String lastName = parts.length > 1 ? parts[1] : "";

            Patient p = service.createPatient(
                    userId,
                    username,
                    email,
                    firstName,
                    lastName
            );

            return ResponseEntity.ok(p);

        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (service.delete(id)) {
            return ResponseEntity.ok(Map.of("status", "deleted"));
        }
        return ResponseEntity.status(404).body(Map.of("error", "Patient not found"));
    }
}
