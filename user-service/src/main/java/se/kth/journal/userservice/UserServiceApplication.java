package se.kth.journal.userservice;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import se.kth.journal.userservice.entity.Role;
import se.kth.journal.userservice.entity.User;
import se.kth.journal.userservice.repository.UserRepository;

@SpringBootApplication
public class UserServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner userSeed(UserRepository repo) {
        return args -> {

            if (repo.count() > 0) return;

            System.out.println("Seeding default staff users...");

            repo.save(User.builder()
                    .keycloakId("seed-doctor-1")
                    .email("doctor@example.com")
                    .username("doctor")
                    .role(Role.DOCTOR)
                    .build()
            );

            repo.save(User.builder()
                    .keycloakId("seed-staff-1")
                    .email("staff@example.com")
                    .username("staff")
                    .role(Role.STAFF)
                    .build()
            );

            System.out.println("Seeding complete.");
        };
    }
}
