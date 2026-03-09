package com.pryme.loan.repository;

import com.pryme.loan.entity.ExternalLoan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ExternalLoanRepository extends JpaRepository<ExternalLoan, UUID> {
    List<ExternalLoan> findByUserId(UUID userId);
}