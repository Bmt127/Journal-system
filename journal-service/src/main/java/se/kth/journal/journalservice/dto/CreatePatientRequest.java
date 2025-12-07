package se.kth.journal.journalservice.dto;

import lombok.Data;

@Data
public class CreatePatientRequest {
    private Long userId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
}
