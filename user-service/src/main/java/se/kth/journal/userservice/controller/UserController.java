package se.kth.journal.userservice.controller;

import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import se.kth.journal.userservice.dto.UserCreateDTO;
import se.kth.journal.userservice.dto.UserDTO;
import se.kth.journal.userservice.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    // STAFF only
    @GetMapping
    @RolesAllowed({"STAFF", "DOCTOR"})
    public List<UserDTO> all() {
        return userService.getAll();
    }

    // STAFF only
    @PostMapping
    @RolesAllowed({"STAFF", "DOCTOR"})
    public UserDTO create(@RequestBody UserCreateDTO dto) {
        return userService.create(dto);
    }

    // Logged-in user (patient / doctor / staff)
    @GetMapping("/me")
    @RolesAllowed({"STAFF", "DOCTOR", "PATIENT"})
    public UserDTO me(@AuthenticationPrincipal Jwt jwt) {
        return userService.getByKeycloakId(jwt.getSubject());
    }

    // STAFF only
    @GetMapping("/{id}")
    @RolesAllowed({"STAFF", "DOCTOR"})
    public UserDTO get(@PathVariable Long id) {
        return userService.get(id);
    }
}
