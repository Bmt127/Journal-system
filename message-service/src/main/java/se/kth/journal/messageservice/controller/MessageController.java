package se.kth.journal.messageservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import se.kth.journal.messageservice.dto.*;
import se.kth.journal.messageservice.service.MessageProducer;
import se.kth.journal.messageservice.service.MessageService;

import java.util.List;
import org.springframework.kafka.core.KafkaTemplate;
@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MessageController {

    private final MessageService messageService;
    private final MessageProducer messageProducer;

    @GetMapping
    public List<MessageDTO> all() {
        return messageService.getAll();
    }

    @PostMapping
    public MessageDTO create(@RequestBody MessageCreateDTO dto) {

        MessageDTO saved = messageService.create(dto);

        messageProducer.sendMessage("New message created with ID " + saved.getId());

        return saved;
    }

    @GetMapping("/sender/{id}")
    public List<MessageDTO> bySender(@PathVariable Long id) {
        return messageService.getBySender(id);
    }

    @GetMapping("/receiver/{id}")
    public List<MessageDTO> byReceiver(@PathVariable Long id) {
        return messageService.getByReceiver(id);
    }
}
