package se.kth.journal.messageservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import se.kth.journal.messageservice.dto.UserDTO;

@FeignClient(name = "user-service", url = "http://user-service:8081")
public interface UserClient {

    @GetMapping("/users/keycloak/{keycloakId}")
    UserDTO getByKeycloak(@PathVariable String keycloakId);
}