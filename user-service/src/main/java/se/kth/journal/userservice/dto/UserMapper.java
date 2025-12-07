package se.kth.journal.userservice.dto;

import se.kth.journal.userservice.entity.User;

public class UserMapper {

    public static UserDTO toDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name(),
                user.getPractitionerId(), // NEW
                user.getPatientId()       // NEW
        );
    }
}
