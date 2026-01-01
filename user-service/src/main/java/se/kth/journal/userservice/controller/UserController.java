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

    // GET ALL USERS
    @GetMapping
    public List<UserDTO> all() {
        return userService.getAll();
    }

    // CREATE USER – JWT REQUIRED
    @PostMapping
    public UserDTO create(
            @RequestBody UserCreateDTO dto,
            @AuthenticationPrincipal Jwt jwt
    ) {
        String keycloakUserId = jwt.getSubject();
        return userService.create(dto, keycloakUserId);
    }

    // GET BY INTERNAL ID
    @GetMapping("/{id}")
    public UserDTO get(@PathVariable Long id) {
        return userService.get(id);
    }

    // GET CURRENT LOGGED-IN USER
    @GetMapping("/me")
    public UserDTO me(@AuthenticationPrincipal Jwt jwt) {
        return userService.getByKeycloakId(jwt.getSubject());
    }
}
