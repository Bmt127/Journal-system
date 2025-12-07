package se.kth.journal.journalservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import se.kth.journal.journalservice.entity.Condition;
import se.kth.journal.journalservice.repository.ConditionRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ConditionService {

    private final ConditionRepository repo;

    public Condition create(Condition c) {
        return repo.save(c);
    }
    public List<Condition> getAll() {
        return repo.findAll();
    }

    public List<Condition> getByPatient(Long patientId) {
        return repo.findByPatientId(patientId);
    }

    public Optional<Condition> get(Long id) {
        return repo.findById(id);
    }

    public boolean delete(Long id) {
        if (!repo.existsById(id)) return false;
        repo.deleteById(id);
        return true;
    }
}
