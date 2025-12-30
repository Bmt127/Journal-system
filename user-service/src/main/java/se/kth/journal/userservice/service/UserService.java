package se.kth.journal.userservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import se.kth.journal.userservice.dto.UserCreateDTO;
import se.kth.journal.userservice.dto.UserDTO;
import se.kth.journal.userservice.dto.UserMapper;
import se.kth.journal.userservice.entity.User;
import se.kth.journal.userservice.repository.UserRepository;
import se.kth.journal.userservice.entity.Role;

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

    public List<UserDTO> getAll() {
        return userRepository.findAll().stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
    }

    public UserDTO get(Long id) {
        return userRepository.findById(id)
                .map(UserMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserDTO login(String username, String password) {
        var userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Fel användarnamn");
        }


        var user = userOpt.get();

        if (user.getPassword() == null || !user.getPassword().equals(password)) {
            throw new IllegalArgumentException("Fel lösenord");
        }

        return UserMapper.toDTO(user);
    }

    public UserDTO getByKeycloakId(String keycloakId) {
        return userRepository.findByKeycloakId(keycloakId)
                .map(UserMapper::toDTO)
                .orElseThrow(() ->
                        new RuntimeException("User not found for keycloakId: " + keycloakId)
                );
    }


    // CREATE USER + CREATE PATIENT OR PRACTITIONER IN JOURNAL-SERVICE
    public UserDTO create(UserCreateDTO dto) {

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setRole(Role.valueOf(dto.getRole().toUpperCase()));

        User saved = userRepository.save(user);

        try {
            Map<String, Object> request = new HashMap<>();
            request.put("userId", saved.getId());
            request.put("username", saved.getUsername());
            request.put("email", saved.getEmail());
            request.put("role", saved.getRole().name());

            // ------------ PATIENT ------------
            if (saved.getRole() == Role.PATIENT) {
                String url = journalBaseUrl + "/patients";
                Map response = restTemplate.postForObject(url, request, Map.class);

                if (response != null && response.get("id") != null) {
                    saved.setPatientId(String.valueOf(response.get("id")));
                    userRepository.save(saved);
                }
            }

            // ------------ DOCTOR / STAFF → PRACTITIONER ------------
            else {
                String url = journalBaseUrl + "/practitioners";
                Map response = restTemplate.postForObject(url, request, Map.class);

                if (response != null && response.get("id") != null) {
                    saved.setPractitionerId(String.valueOf(response.get("id")));
                    userRepository.save(saved);
                }
            }

        } catch (Exception e) {
            System.err.println("Could not create remote entity in journal-service: " + e.getMessage());
        }

        return UserMapper.toDTO(saved);
    }
}
