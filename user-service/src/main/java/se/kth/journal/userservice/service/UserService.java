package se.kth.journal.userservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import se.kth.journal.userservice.dto.UserCreateDTO;
import se.kth.journal.userservice.dto.UserDTO;
import se.kth.journal.userservice.dto.UserMapper;
import se.kth.journal.userservice.entity.Role;
import se.kth.journal.userservice.entity.User;
import se.kth.journal.userservice.repository.UserRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RestTemplate restTemplate;

    @Value("${journal.service.url:http://journal-backend:8080}")
    private String journalBaseUrl;

    /* =========================
       READ
       ========================= */

    public List<UserDTO> getAll() {
        return userRepository.findAll()
                .stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
    }

    public UserDTO get(Long id) {
        return userRepository.findById(id)
                .map(UserMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserDTO getByKeycloakId(String keycloakId) {

        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseGet(() -> createUserFromKeycloak(keycloakId));

        if (user.getRole() == Role.PATIENT && user.getPatientId() == null) {
            provisionPatient(user);
        }

        if ((user.getRole() == Role.DOCTOR || user.getRole() == Role.STAFF)
                && user.getPractitionerId() == null) {
            provisionPractitioner(user);
        }

        return UserMapper.toDTO(user);
    }

    /* =========================
       CREATE
       ========================= */

    public UserDTO create(UserCreateDTO dto, String keycloakId) {

        User user = new User();
        user.setKeycloakId(keycloakId);
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setRole(Role.valueOf(dto.getRole().toUpperCase()));

        User saved = userRepository.save(user);

        if (saved.getRole() == Role.PATIENT) {
            provisionPatient(saved);
        } else {
            provisionPractitioner(saved);
        }

        return UserMapper.toDTO(saved);
    }

    /* =========================
       INTERNAL HELPERS
       ========================= */

    private User createUserFromKeycloak(String keycloakId) {
        User user = User.builder()
                .keycloakId(keycloakId)
                .username("auto-" + keycloakId.substring(0, 8))
                .email("unknown@keycloak")
                .role(Role.PATIENT)
                .build();

        return userRepository.save(user);
    }

    private void provisionPatient(User user) {
        Map<String, Object> request = basePayload(user);

        Map response = restTemplate.postForObject(
                journalBaseUrl + "/patients",
                request,
                Map.class
        );

        if (response != null && response.get("id") != null) {
            user.setPatientId(String.valueOf(response.get("id")));
            userRepository.save(user);
        }
    }

    private void provisionPractitioner(User user) {
        Map<String, Object> request = basePayload(user);

        Map response = restTemplate.postForObject(
                journalBaseUrl + "/practitioners",
                request,
                Map.class
        );

        if (response != null && response.get("id") != null) {
            user.setPractitionerId(String.valueOf(response.get("id")));
            userRepository.save(user);
        }
    }

    private Map<String, Object> basePayload(User user) {
        Map<String, Object> request = new HashMap<>();
        request.put("userId", user.getId());
        request.put("username", user.getUsername());
        request.put("email", user.getEmail());
        request.put("role", user.getRole().name());
        return request;
    }
}
