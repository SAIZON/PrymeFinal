package com.pryme.loan.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private String customerName;
    private String customerRole;
    private int rating;
    private String comment;
    private boolean isFeatured;
}