package se.kth.journal.journalservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import se.kth.journal.journalservice.dto.CreateObservationRequest;
import se.kth.journal.journalservice.entity.Observation;
import se.kth.journal.journalservice.repository.ObservationRepository;

import java.time.LocalDate;
import java.util.List;
@RestController
@RequestMapping("/observations")
@CrossOrigin("*")
public class ObservationController {

    private final ObservationRepository repo;

    public ObservationController(ObservationRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/patient/{id}")
    @PreAuthorize("hasAnyRole('doctor','staff','patient')")
    public List<Observation> getForPatient(@PathVariable Long id) {
        return repo.findByPatientId(id);
    }

    //  permitAll – skapas via staff/doctor UI OCH ev backend
    @PostMapping
    @PreAuthorize("permitAll()")
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
