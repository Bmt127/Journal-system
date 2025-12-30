package se.kth.journal.messageservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
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

    // =========================================
    // ALLA roller får se sina meddelanden
    // =========================================
    @GetMapping
    @PreAuthorize("hasAnyRole('doctor','staff','patient')")
    public List<MessageDTO> all() {
        return messageService.getAll();
    }

    // =========================================
    // Skicka meddelande (alla roller)
    // =========================================
    @PostMapping
    @PreAuthorize("hasAnyRole('doctor','staff','patient')")
    public MessageDTO create(@RequestBody MessageCreateDTO dto) {
        return messageService.create(dto);
    }

    // =========================================
    // Se skickade meddelanden
    // =========================================
    @GetMapping("/sender/{id}")
    @PreAuthorize("hasAnyRole('doctor','staff','patient')")
    public List<MessageDTO> bySender(@PathVariable Long id) {
        return messageService.getBySender(id);
    }

    // =========================================
    // Se mottagna meddelanden
    // =========================================
    @GetMapping("/receiver/{id}")
    @PreAuthorize("hasAnyRole('doctor','staff','patient')")
    public List<MessageDTO> byReceiver(@PathVariable Long id) {
        return messageService.getByReceiver(id);
    }
}
