package se.kth.journal.userservice.dto;

import lombok.Data;

@Data
public class UserCreateDTO {

    private String keycloakId;   // REQUIRED
    private String username;
    private String email;
    private String role;

    private String firstName;
    private String lastName;
}
