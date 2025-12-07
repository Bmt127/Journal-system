package se.kth.journal.journalservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.kth.journal.journalservice.entity.Patient;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByUserId(Long userId);
}
