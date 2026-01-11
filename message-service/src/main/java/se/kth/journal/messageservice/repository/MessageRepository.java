package se.kth.journal.messageservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.kth.journal.messageservice.entity.Message;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByReceiverKeycloakIdOrderByTimestampAsc(String receiverKeycloakId);

    List<Message> findBySenderKeycloakIdOrderByTimestampAsc(String senderKeycloakId);

    List<Message> findBySenderKeycloakIdAndReceiverKeycloakIdOrReceiverKeycloakIdAndSenderKeycloakIdOrderByTimestampAsc(
            String sender1,
            String receiver1,
            String sender2,
            String receiver2
    );
}
