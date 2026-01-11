package se.kth.journal.messageservice.service;

import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;


@Service
@EnableKafka
public class KafkaConsumerService {
    @KafkaListener(topics = "${spring.kafka.topic.message}", groupId = "${spring.kafka.consumer.group-id}")
    public void consumeMessage(String message) {
        System.out.println("Received message from Kafka: " + message);
        // Bearbeta meddelandet här
    }
}
