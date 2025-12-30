package se.kth.journal.journalservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    // Doctor och staff får se alla patienter
    @GetMapping
    @PreAuthorize("hasAnyRole('doctor','staff')")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // Doctor, staff och patient får se patient via id
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('doctor','staff','patient')")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return service.getById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404)
                        .body(Map.of("error", "Patient not found")));
    }

    // Patient hämtar sig själv via userId, staff och doctor tillåts också
    @GetMapping("/by-user/{userId}")
    @PreAuthorize("hasAnyRole('doctor','staff','patient')")
    public ResponseEntity<?> getByUserId(@PathVariable Long userId) {
        return service.getByUserId(userId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404)
                        .body(Map.of("error", "Patient not found")));
    }

    // Skapas av user-service (backend) – kräver giltig token
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createPatient(@RequestBody Map<String, Object> payload) {

        try {
            Long userId = Long.valueOf(payload.get("userId").toString());
            String username = payload.getOrDefault("username", "").toString();
            String email = payload.getOrDefault("email", "").toString();

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
            return ResponseEntity.status(400)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Endast doctor får ta bort patient
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('doctor')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (service.delete(id)) {
            return ResponseEntity.ok(Map.of("status", "deleted"));
        }
        return ResponseEntity.status(404)
                .body(Map.of("error", "Patient not found"));
    }
}
