package se.kth.journal.journalservice.entity;

import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String username;
    private String email;

    private String firstName;
    private String lastName;

    public Patient(String email, Long userId, String username, String firstName, String lastName) {
        this.email = email;
        this.userId = userId;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
