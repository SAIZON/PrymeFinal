package com.pryme.loan.repository;

import com.pryme.loan.entity.Application;
import com.pryme.loan.entity.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID; // <--- Import UUID

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    // Change Long to UUID
    List<Application> findByUserId(UUID userId);

    // Change Long to UUID
    long countByUserIdAndStatusNot(UUID userId, ApplicationStatus status);
}