package se.kth.journal.messageservice.dto;

import se.kth.journal.messageservice.entity.Message;

public class MessageMapper {

    public static MessageDTO toDTO(Message m) {
        return new MessageDTO(
                m.getId(),
                m.getSenderKeycloakId(),
                m.getReceiverKeycloakId(),
                m.getContent(),
                m.getTimestamp().toString()
        );
    }
}
