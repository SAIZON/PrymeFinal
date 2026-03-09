package com.pryme.loan.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "blog_posts")
public class BlogPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(unique = true, nullable = false)
    private String slug; // URL-friendly ID (e.g., "how-to-save-tax")

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content; // Supports HTML/Markdown

    private String author;

    private String category; // e.g., "Home Loans", "Personal Finance"

    @Column(columnDefinition = "TEXT")
    private String imageUrl; // URL to an image

    @Column(columnDefinition = "TEXT")
    private String excerpt; // Short summary
    // ------------------

    private boolean isPinned = false; // For "Featured" blogs

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}