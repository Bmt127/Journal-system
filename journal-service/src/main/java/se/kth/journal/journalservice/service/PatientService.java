package se.kth.journal.journalservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import se.kth.journal.journalservice.entity.Patient;
import se.kth.journal.journalservice.repository.PatientRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository repo;

    public List<Patient> getAll() {
        return repo.findAll();
    }

    public Optional<Patient> getById(Long id) {
        return repo.findById(id);
    }

    public Optional<Patient> getByUserId(Long userId) {
        return repo.findByUserId(userId);
    }

    public Patient createPatient(Long userId, String username, String email,
                                 String firstName, String lastName) {

        Patient p = Patient.builder()
                .userId(userId)
                .username(username)
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .build();

        return repo.save(p);
    }

    // används bara som fallback om du skulle vilja
    public Patient createPatient(Long userId, String username, String email) {

        Patient p = Patient.builder()
                .userId(userId)
                .username(username)
                .email(email)
                .build();

        return repo.save(p);
    }

    public boolean delete(Long id) {
        if (!repo.existsById(id)) return false;
        repo.deleteById(id);
        return true;
    }
}
