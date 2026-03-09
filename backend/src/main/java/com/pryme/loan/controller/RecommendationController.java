package com.pryme.loan.controller;

import com.pryme.loan.dto.RecommendationRequest;
import com.pryme.loan.entity.LoanProduct;
import com.pryme.loan.service.BankRecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public/recommendations")
@CrossOrigin(origins = "http://localhost:3000") // Allow Frontend Access
public class RecommendationController {

    private final BankRecommendationService recommendationService;

    public RecommendationController(BankRecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @PostMapping("/check-eligibility")
    public ResponseEntity<List<LoanProduct>> checkEligibility(@RequestBody RecommendationRequest request) {
        List<LoanProduct> offers = recommendationService.getEligibleLoans(request);
        return ResponseEntity.ok(offers);
    }
}