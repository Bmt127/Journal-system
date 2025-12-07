package se.kth.journal.journalservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @Autowired
    private ObservationRepository repo;

    @GetMapping("/patient/{id}")
    public List<Observation> getForPatient(@PathVariable Long id) {
        return repo.findByPatientId(id);
    }

    @PostMapping
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
