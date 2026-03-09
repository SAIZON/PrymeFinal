package com.pryme.loan.repository;

import com.pryme.loan.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID; // <--- Import UUID

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    // Change Long to UUID
    List<Notification> findByUserIdOrderByCreatedAtDesc(UUID userId);

    // Change Long to UUID
    long countByUserIdAndIsReadFalse(UUID userId);
}