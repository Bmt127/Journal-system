package se.kth.journal.messageservice.dto;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String keycloakId;
    private String username;
    private String email;
    private String role;
    private String practitionerId;
    private String patientId;
}
