package se.kth.journal.journalservice.dto;

import lombok.Data;

@Data
public class PractitionerRequest {
    private Long userId;
    private String username;
    private String email;
    private String role;
    private String firstName;
    private String lastName;
}
