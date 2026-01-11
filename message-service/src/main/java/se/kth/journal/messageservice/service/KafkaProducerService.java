package se.kth.journal.messageservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;
import se.kth.journal.messageservice.dto.MessageCreateDTO;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Service
public class KafkaProducerService {

    @Value("${spring.kafka.topic.message}")
    private String messageTopic;

    private final KafkaTemplate<String, String> kafkaTemplate;

    public KafkaProducerService(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendMessage(MessageCreateDTO message) {
        String messageJson = convertMessageToJson(message);
        // Skicka meddelandet och få tillbaka en CompletableFuture
        CompletableFuture<SendResult<String, String>> future = kafkaTemplate.send(messageTopic, messageJson);

        // Hantera resultatet eller fel
        future.whenComplete((result, ex) -> {
            if (ex != null) {
                System.err.println("Message sending failed: " + ex.getMessage());
            } else {
                System.out.println("Message sent successfully: ");
            }
        });


    }

    private String convertMessageToJson(MessageCreateDTO message) {
        // Om du vill använda JSON kan du konvertera med hjälp av ett bibliotek som Jackson eller Gson
        // Här skickar vi ett enkelt string-meddelande
        return message.getContent();
    }
}
