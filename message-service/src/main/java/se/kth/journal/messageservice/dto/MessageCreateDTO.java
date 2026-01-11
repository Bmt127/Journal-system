package se.kth.journal.messageservice.dto;

import lombok.Data;

@Data
public class MessageCreateDTO {
    private String receiverKeycloakId;
    private String content;
}
