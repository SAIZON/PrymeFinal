package com.pryme.loan.repository;

import com.pryme.loan.entity.LoanDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID; // <-- Make sure to import UUID

// CHANGED: JpaRepository<LoanDocument, Long> is now JpaRepository<LoanDocument, UUID>
public interface LoanDocumentRepository extends JpaRepository<LoanDocument, UUID> {

    // If you have this method, make sure the applicationId parameter type matches your Application entity (likely Long)
    List<LoanDocument> findByApplicationId(Long applicationId);
}