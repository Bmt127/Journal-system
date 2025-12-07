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

    private String email;
    private String username;
    private String password;

    @Column(name = "patient_id")
    private String patientId;

    @Column(name = "practitioner_id")
    private String practitionerId; // NEW FIELD

    @Enumerated(EnumType.STRING)
    private Role role;

    // Custom constructor
    public User(String email, String username, String password, Role role, String patientId) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.role = role;
        this.patientId = patientId;
    }
}
