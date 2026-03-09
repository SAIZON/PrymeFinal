package com.pryme.loan.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "loan_documents")
public class LoanDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    @JsonIgnore
    private Application application;

    private String fileName;

    // In production, this stores the S3 Object Key, not a local C:/ drive path
    private String filePath;

    @Enumerated(EnumType.STRING)
    private DocumentType type;

    @Enumerated(EnumType.STRING)
    private DocumentStatus status;

    // --- NEW FIELD ---
    @Column(columnDefinition = "TEXT")
    private String adminRemarks;

    @CreationTimestamp
    private LocalDateTime uploadedAt;
}