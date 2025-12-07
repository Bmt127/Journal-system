package se.kth.journal.userservice.dto;

import lombok.Data;

@Data
public class UserCreateDTO {
    private String username;
    private String email;
    private String password;
    private String role;
}
