package se.kth.journal.messageservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MessageDTO {
    private Long id;
    private String senderKeycloakId;
    private String receiverKeycloakId;
    private String content;
    private String timestamp;
}
