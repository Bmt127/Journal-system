package se.kth.journal.messageservice.dto;

import lombok.Data;

@Data
public class MessageCreateDTO {
    private Long senderId;
    private Long receiverId;
    private String content;
}
