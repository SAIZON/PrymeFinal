package com.pryme.loan.dto;

import lombok.Data;

@Data
public class LeadRequest {
    // ONLY the fields we want the user to see
    private String name;
    private String mobile;
    private String email;
    private String loanType;
    private String message;
}