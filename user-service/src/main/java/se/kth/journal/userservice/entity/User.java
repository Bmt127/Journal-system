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

    // Koppling till Keycloak
    @Column(unique = true, nullable = false)
    private String keycloakId;

    private String email;
    private String username;

    // kommer inte användas längre (kan tas bort senare)
    private String password;

    @Column(name = "patient_id")
    private String patientId;

    @Column(name = "practitioner_id")
    private String practitionerId;

    @Enumerated(EnumType.STRING)
    private Role role;
}
