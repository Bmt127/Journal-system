package se.kth.journal.journalservice.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "practitioners")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Practitioner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String username;
    private String email;
    private String role;

    private String firstName;
    private String lastName;

    public Practitioner(String email, String role, Long userId, String username, String firstName, String lastName) {
        this.email = email;
        this.role = role;
        this.userId = userId;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
