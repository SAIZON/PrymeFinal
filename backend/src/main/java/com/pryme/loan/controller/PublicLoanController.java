package com.pryme.loan.controller;

import com.pryme.loan.dto.PublicLoanProductDto;
import com.pryme.loan.service.PublicLoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public/loans")
@RequiredArgsConstructor
public class PublicLoanController {

    private final PublicLoanService publicLoanService;

    @GetMapping
    public ResponseEntity<List<PublicLoanProductDto>> getAllLoans() {
        return ResponseEntity.ok(publicLoanService.getAllLoanProducts());
    }
}