package se.kth.journal.journalservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.kth.journal.journalservice.entity.Practitioner;

import java.util.Optional;

public interface PractitionerRepository extends JpaRepository<Practitioner, Long> {
    Optional<Practitioner> findByUserId(Long userId);
}
