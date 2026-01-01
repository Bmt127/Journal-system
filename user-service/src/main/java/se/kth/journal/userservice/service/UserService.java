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

    @Value("${journal.service.url:http://journal-service:8084}")
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

    /**
     * Hämtar användare via Keycloak-id.
     * Saknas patientId / practitionerId → skapas automatiskt.
     */
    public UserDTO getByKeycloakId(String keycloakId) {

        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() ->
                        new RuntimeException("User not found for keycloakId: " + keycloakId)
                );

        // PATIENT → skapa patient om saknas
        if (user.getRole() == Role.PATIENT && user.getPatientId() == null) {
            provisionPatient(user);
        }

        // DOCTOR / STAFF → skapa practitioner om saknas
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

        // Skapa koppling direkt vid skapande
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

    private void provisionPatient(User user) {
        try {
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

        } catch (Exception e) {
            throw new RuntimeException("Kunde inte skapa patient", e);
        }
    }

    private void provisionPractitioner(User user) {
        try {
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

        } catch (Exception e) {
            throw new RuntimeException("Kunde inte skapa practitioner", e);
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
