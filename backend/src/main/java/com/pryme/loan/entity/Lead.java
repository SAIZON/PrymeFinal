package com.pryme.loan.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "leads")
public class Lead {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // <--- FIXED: Was likely IDENTITY
    private UUID id;

    private String name;
    private String email;
    private String mobile;

    // e.g. "Personal Loan", "Home Loan"
    @Column(nullable = false)
    private String loanType;

    @Column(columnDefinition = "TEXT")
    private String message;

    private String status; // NEW, CONTACTED, CLOSED

    @CreationTimestamp
    private LocalDateTime createdAt;
}