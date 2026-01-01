package se.kth.journal.userservice;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;
import se.kth.journal.userservice.entity.Role;
import se.kth.journal.userservice.entity.User;
import se.kth.journal.userservice.repository.UserRepository;

import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
public class UserServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner userSeed(UserRepository repo, RestTemplate restTemplate) {
        return args -> {

            if (repo.count() > 0) return;

            System.out.println("Seeding default users...");

            // PATIENT
            User patient = repo.save(User.builder()
                    .email("bemnet@example.com")
                    .username("bemnet")
                    .role(Role.PATIENT)
                    .build()
            );

            try {
                Map<String, Object> req = new HashMap<>();
                req.put("userId", patient.getId());
                req.put("username", patient.getUsername());
                req.put("email", patient.getEmail());
                req.put("role", patient.getRole().name());
                req.put("firstName", "Bemnet");
                req.put("lastName", "Tadesse");

                Map response = restTemplate.postForObject(
                        "http://journal-service:8084/patients",
                        req,
                        Map.class
                );

                if (response != null && response.get("id") != null) {
                    patient.setPatientId(String.valueOf(response.get("id")));
                    repo.save(patient);
                }

            } catch (Exception e) {
                System.out.println("Patient creation failed: " + e.getMessage());
            }

            // DOCTOR
            User doctor = repo.save(User.builder()
                    .email("doctor@example.com")
                    .username("doctor")
                    .role(Role.DOCTOR)
                    .build()
            );

            try {
                Map<String, Object> req = new HashMap<>();
                req.put("userId", doctor.getId());
                req.put("username", doctor.getUsername());
                req.put("email", doctor.getEmail());
                req.put("role", doctor.getRole().name());
                req.put("firstName", "Dr");
                req.put("lastName", "Doctor");

                Map response = restTemplate.postForObject(
                        "http://journal-service:8084/practitioners",
                        req,
                        Map.class
                );

                if (response != null && response.get("id") != null) {
                    doctor.setPractitionerId(String.valueOf(response.get("id")));
                    repo.save(doctor);
                }

            } catch (Exception e) {
                System.out.println("Doctor creation failed: " + e.getMessage());
            }

            // STAFF
            User staff = repo.save(User.builder()
                    .email("staff@example.com")
                    .username("staff")
                    .role(Role.STAFF)
                    .build()
            );

            try {
                Map<String, Object> req = new HashMap<>();
                req.put("userId", staff.getId());
                req.put("username", staff.getUsername());
                req.put("email", staff.getEmail());
                req.put("role", staff.getRole().name());
                req.put("firstName", "Staff");
                req.put("lastName", "Member");

                Map response = restTemplate.postForObject(
                        "http://journal-service:8084/practitioners",
                        req,
                        Map.class
                );

                if (response != null && response.get("id") != null) {
                    staff.setPractitionerId(String.valueOf(response.get("id")));
                    repo.save(staff);
                }

            } catch (Exception e) {
                System.out.println("Staff creation failed: " + e.getMessage());
            }

            System.out.println("Seeding complete.");
        };
    }
}
