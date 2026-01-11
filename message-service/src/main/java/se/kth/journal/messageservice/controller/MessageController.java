package se.kth.journal.messageservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import se.kth.journal.messageservice.dto.*;
import se.kth.journal.messageservice.service.MessageService;
import se.kth.journal.messageservice.service.KafkaProducerService;

import java.util.List;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final KafkaProducerService kafkaProducerService;

    private String getKeycloakId(Authentication auth) {
        Jwt jwt = (Jwt) auth.getPrincipal();
        return jwt.getSubject();   // this is the UUID
    }

    @GetMapping("/me/inbox")
    public List<MessageDTO> inbox(Authentication auth) {
        return messageService.getInbox(getKeycloakId(auth));
    }

    @GetMapping("/me/sent")
    public List<MessageDTO> sent(Authentication auth) {
        return messageService.getSent(getKeycloakId(auth));
    }

    @GetMapping("/me/conversation/{otherKeycloakId}")
    public List<MessageDTO> conversation(
            @PathVariable String otherKeycloakId,
            Authentication auth
    ) {
        return messageService.getConversation(getKeycloakId(auth), otherKeycloakId);
    }

    // Skicka meddelande till Kafka istället för direkt i databasen
    @PostMapping("/me")
    public MessageDTO send(@RequestBody MessageCreateDTO dto, Authentication auth) {
        // Skicka meddelandet till Kafka
        kafkaProducerService.sendMessage(dto);

        // Spara meddelandet i databasen (om du vill)
        return messageService.send(getKeycloakId(auth), dto);
    }
}
