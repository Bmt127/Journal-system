package se.kth.journal.journalservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import se.kth.journal.journalservice.entity.Practitioner;
import se.kth.journal.journalservice.repository.PractitionerRepository;
import se.kth.journal.journalservice.dto.PractitionerRequest;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PractitionerService {

    private final PractitionerRepository repo;

    public Practitioner createPractitioner(PractitionerRequest req) {

        Practitioner p = Practitioner.builder()
                .userId(req.getUserId())
                .username(req.getUsername())
                .email(req.getEmail())
                .role(req.getRole())
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .build();

        return repo.save(p);
    }

    public Optional<Practitioner> findByUserId(Long userId) {
        return repo.findByUserId(userId);
    }

    public Optional<Practitioner> findById(Long id) {
        return repo.findById(id);
    }

    public List<Practitioner> getAll() {
        return repo.findAll();
    }

    public boolean delete(Long id) {
        if (!repo.existsById(id)) return false;
        repo.deleteById(id);
        return true;
    }
}
