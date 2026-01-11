package se.kth.journal.journalservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;

@SpringBootApplication
public class JournalServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(JournalServiceApplication.class, args);
	}

	/**
	 * Seed disabled because authentication and user lifecycle
	 * is handled by Keycloak + user-service.
	 */
	@Bean
	CommandLineRunner journalSeed() {
		return args -> {
			System.out.println("Journal seed disabled when using Keycloak");
		};
	}
}
