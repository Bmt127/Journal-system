package se.kth.journal.journalservice.controller;

import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;

import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import se.kth.journal.journalservice.dto.CreateObservationRequest;
import se.kth.journal.journalservice.entity.Observation;
import se.kth.journal.journalservice.entity.Patient;
import se.kth.journal.journalservice.repository.ObservationRepository;
import se.kth.journal.journalservice.repository.PatientRepository;

import java.time.LocalDate;
import java.util.List;
@RestController
@RequestMapping("/observations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ObservationController {

    private final ObservationRepository repo;
    private final PatientRepository patientRepo;

    // PATIENT → mina observationer via Keycloak
    @GetMapping("/me")
    @RolesAllowed("PATIENT")
    public List<Observation> getMyObservations(Authentication auth) {
        Jwt jwt = (Jwt) auth.getPrincipal();
        String keycloakId = jwt.getSubject();

        Patient p = patientRepo.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new RuntimeException("No patient linked"));

        return repo.findByPatientId(p.getId());
    }

    // DOCTOR / STAFF
    @GetMapping("/patient/{id}")
    @RolesAllowed({ "DOCTOR", "STAFF" })
    public List<Observation> getForPatient(@PathVariable Long id) {
        return repo.findByPatientId(id);
    }

    @PostMapping
    @RolesAllowed({ "DOCTOR", "STAFF" })
    public ResponseEntity<Observation> create(@RequestBody CreateObservationRequest req) {

        Observation obs = new Observation(
                null,
                req.getPatientId(),
                "NOTE",
                req.getNote(),
                LocalDate.now()
        );

        return ResponseEntity.ok(repo.save(obs));
    }
}
