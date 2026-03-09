package com.pryme.loan.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "loan_products")
public class LoanProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "bank_id")
    @JsonBackReference // <--- CRITICAL FIX FOR VISIBILITY
    private Bank bank;

    private String type;          // e.g. "Personal Loan"
    private String interestRate;  // e.g. "10.5%"
    private String processingFee; // e.g. "1%"

    private String maxAmount;     // e.g. "50 Lakhs"
    private String tenure;        // e.g. "1-5 Years"

    @Column(columnDefinition = "TEXT")
    private String features;      // e.g. "Instant Approval"

    private BigDecimal minSalary;
    private Integer minCibil;
}