package se.kth.journal.messageservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import se.kth.journal.messageservice.dto.*;
import se.kth.journal.messageservice.service.MessageService;

import java.util.List;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MessageController {

    private final MessageService messageService;

    @GetMapping
    public List<MessageDTO> all() {
        return messageService.getAll();
    }

    @GetMapping("/")
    public String ok() {
        return "OK";
    }

    @PostMapping
    public MessageDTO create(@RequestBody MessageCreateDTO dto) {
        return messageService.create(dto);
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
