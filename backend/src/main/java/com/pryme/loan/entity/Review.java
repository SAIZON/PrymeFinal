package com.pryme.loan.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String customerRole; // e.g., "Software Engineer"
    private int rating; // 1 to 5

    @Column(length = 1000)
    private String comment;

    private boolean isFeatured = false; // Show on Landing Page

    @CreationTimestamp
    private LocalDateTime createdAt;
}