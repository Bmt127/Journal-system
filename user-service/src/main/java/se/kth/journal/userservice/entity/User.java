package se.kth.journal.userservice.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // === KEYCLOAK ===
    @Column(name = "keycloak_id", nullable = false, unique = true)
    private String keycloakId;

    private String email;
    private String username;

    @Enumerated(EnumType.STRING)
    private Role role;

    // === JOURNAL-SERVICE KOPPLINGAR ===
    @Column(name = "patient_id")
    private String patientId;

    @Column(name = "practitioner_id")
    private String practitionerId;
}
