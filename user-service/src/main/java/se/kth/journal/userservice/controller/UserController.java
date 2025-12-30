package se.kth.journal.userservice.controller;

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

    // ==================================================
    // GET ALL USERS (staff / admin use case)
    // ==================================================
    @GetMapping
    public List<UserDTO> all() {
        return userService.getAll();
    }

    // ==================================================
    // CREATE USER (called after Keycloak registration)
    // ==================================================
    @PostMapping
    public UserDTO create(@RequestBody UserCreateDTO dto) {
        return userService.create(dto);
    }

    // ==================================================
    // GET USER BY INTERNAL ID
    // ==================================================
    @GetMapping("/{id}")
    public UserDTO get(@PathVariable Long id) {
        return userService.get(id);
    }

    // ==================================================
    // GET CURRENT LOGGED-IN USER (JWT from Keycloak)
    // ==================================================
    @GetMapping("/me")
    public UserDTO me(@AuthenticationPrincipal Jwt jwt) {
        String keycloakUserId = jwt.getSubject();
        return userService.getByKeycloakId(keycloakUserId);
    }
}
