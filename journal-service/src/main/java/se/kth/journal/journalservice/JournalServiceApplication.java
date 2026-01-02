package se.kth.journal.journalservice;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import se.kth.journal.journalservice.entity.*;
import se.kth.journal.journalservice.repository.*;

import java.time.LocalDate;

@SpringBootApplication
public class JournalServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(JournalServiceApplication.class, args);
	}

//	@Bean
//	CommandLineRunner journalSeed(
//			PatientRepository patRepo,
//			PractitionerRepository pracRepo,
//			ObservationRepository obsRepo,
//			ConditionRepository condRepo,
//			EncounterRepository encRepo
//	) {
//		return args -> {
//
//			if (patRepo.count() == 0) {
//				patRepo.save(Patient.builder()
//						.email("bemnet@example.com")
//						.userId(1L)
//						.username("bemnet")
//						.firstName("Bemnet")
//						.lastName("Tadesse")
//						.build());
//			}
//
//			if (pracRepo.count() == 0) {
//				pracRepo.save(Practitioner.builder()
//						.email("doctor@example.com")
//						.role("DOCTOR")
//						.userId(2L)
//						.username("doctor")
//						.firstName("Dr")
//						.lastName("Doctor")
//						.build());
//
//				pracRepo.save(Practitioner.builder()
//						.email("staff@example.com")
//						.role("STAFF")
//						.userId(3L)
//						.username("staff")
//						.firstName("Staff")
//						.lastName("Member")
//						.build());
//			}
//
//			if (obsRepo.count() == 0) {
//				obsRepo.save(new Observation(null, 1L, "Blood Pressure", "120/80", LocalDate.now()));
//				obsRepo.save(new Observation(null, 1L, "Heart Rate", "72 bpm", LocalDate.now()));
//			}
//
//			if (condRepo.count() == 0) {
//				condRepo.save(new Condition(null, 1L, 2L, "Hypertension", "High blood pressure", LocalDate.now()));
//			}
//
//			if (encRepo.count() == 0) {
//				encRepo.save(new Encounter(null, 1L, 2L, "Routine checkup", "All good", LocalDate.now()));
//			}
//
//			System.out.println("Journal service data seeded!");
//		};
//	}
}