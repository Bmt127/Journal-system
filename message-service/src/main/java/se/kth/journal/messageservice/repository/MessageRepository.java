package se.kth.journal.messageservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.kth.journal.messageservice.entity.Message;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findBySenderId(Long senderId);

    List<Message> findByReceiverId(Long receiverId);
}
