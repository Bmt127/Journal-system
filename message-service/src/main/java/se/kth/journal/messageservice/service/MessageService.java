package se.kth.journal.messageservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import se.kth.journal.messageservice.dto.*;
import se.kth.journal.messageservice.entity.Message;
import se.kth.journal.messageservice.repository.MessageRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository repo;

    public List<MessageDTO> getAll() {
        return repo.findAll()
                .stream()
                .map(MessageMapper::toDTO)
                .collect(Collectors.toList());
    }

    public MessageDTO send(String senderKeycloakId, MessageCreateDTO dto) {
        Message m = Message.builder()
                .senderKeycloakId(senderKeycloakId)
                .receiverKeycloakId(dto.getReceiverKeycloakId())
                .content(dto.getContent())
                .timestamp(LocalDateTime.now())
                .build();

        return MessageMapper.toDTO(repo.save(m));
    }

    public List<MessageDTO> getInbox(String keycloakId) {
        return repo.findByReceiverKeycloakIdOrderByTimestampAsc(keycloakId)
                .stream()
                .map(MessageMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<MessageDTO> getSent(String keycloakId) {
        return repo.findBySenderKeycloakIdOrderByTimestampAsc(keycloakId)
                .stream()
                .map(MessageMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<MessageDTO> getConversation(String user1, String user2) {
        return repo
                .findBySenderKeycloakIdAndReceiverKeycloakIdOrReceiverKeycloakIdAndSenderKeycloakIdOrderByTimestampAsc(
                        user1, user2, user1, user2
                )
                .stream()
                .map(MessageMapper::toDTO)
                .collect(Collectors.toList());
    }
}
