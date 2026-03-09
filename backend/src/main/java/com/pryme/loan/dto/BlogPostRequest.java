package com.pryme.loan.dto;

import lombok.Data;

@Data
public class BlogPostRequest {
    private String title;
    private String content;
    private String author;
    private boolean isPinned;

    // --- NEW FIELDS ---
    private String category;
    private String imageUrl;
    private String excerpt;
}