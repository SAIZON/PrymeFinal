package com.pryme.loan.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@Entity
@Table(name = "external_loans")
public class ExternalLoan {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String bankName;
    private String loanType; // e.g., "Car Loan", "Home Loan"

    private BigDecimal outstandingAmount;
    private BigDecimal emiAmount;
}