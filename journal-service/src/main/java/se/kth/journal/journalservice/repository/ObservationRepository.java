package se.kth.journal.journalservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.kth.journal.journalservice.entity.Observation;

import java.util.List;

public interface ObservationRepository extends JpaRepository<Observation, Long> {
    List<Observation> findByPatientId(Long patientId);
}
