package se.kth.journal.userservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.kth.journal.userservice.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByKeycloakId(String keycloakId);
}
