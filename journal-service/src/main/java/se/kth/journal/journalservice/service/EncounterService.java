package se.kth.journal.journalservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import se.kth.journal.journalservice.entity.Encounter;
import se.kth.journal.journalservice.repository.EncounterRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EncounterService {

    private final EncounterRepository repo;

    public Encounter create(Encounter e) {
        return repo.save(e);
    }

    public List<Encounter> getByPractitionerOnDate(Long practitionerId, LocalDate date) {
        return repo.findByPractitionerIdAndEncounterDate(practitionerId, date);
    }

    public Optional<Encounter> get(Long id) {
        return repo.findById(id);
    }
    public List<Encounter> getAll() {
        return repo.findAll();
    }

    public List<Encounter> getByPatient(Long patientId) {
        return repo.findByPatientId(patientId);
    }

    public List<Encounter> getByPractitioner(Long practitionerId) {
        return repo.findByPractitionerId(practitionerId);
    }

    public boolean delete(Long id) {
        if (!repo.existsById(id)) return false;
        repo.deleteById(id);
        return true;
    }
}
