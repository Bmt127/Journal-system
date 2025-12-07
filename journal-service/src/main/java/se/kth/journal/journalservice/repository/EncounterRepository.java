package se.kth.journal.journalservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.kth.journal.journalservice.entity.Encounter;

import java.time.LocalDate;
import java.util.List;

public interface EncounterRepository extends JpaRepository<Encounter, Long> {
    List<Encounter> findByPatientId(Long patientId);
    List<Encounter> findByPractitionerId(Long practitionerId);

    List<Encounter> findByPractitionerIdAndEncounterDate(Long practitionerId, LocalDate encounterDate);

}
