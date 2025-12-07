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
        return repo.findAll().stream()
                .map(MessageMapper::toDTO)
                .collect(Collectors.toList());
    }

    public MessageDTO create(MessageCreateDTO dto) {
        Message m = Message.builder()
                .senderId(dto.getSenderId())
                .receiverId(dto.getReceiverId())
                .content(dto.getContent())
                .timestamp(LocalDateTime.now())
                .build();

        return MessageMapper.toDTO(repo.save(m));
    }

    public List<MessageDTO> getBySender(Long senderId) {
        return repo.findBySenderId(senderId).stream()
                .map(MessageMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<MessageDTO> getByReceiver(Long receiverId) {
        return repo.findByReceiverId(receiverId).stream()
                .map(MessageMapper::toDTO)
                .collect(Collectors.toList());
    }
}
