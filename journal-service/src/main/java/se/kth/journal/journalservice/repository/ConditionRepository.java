package se.kth.journal.journalservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.kth.journal.journalservice.entity.Condition;

import java.util.List;

public interface ConditionRepository extends JpaRepository<Condition, Long> {
    List<Condition> findByPatientId(Long patientId);
}
