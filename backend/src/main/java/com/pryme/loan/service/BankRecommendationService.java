package com.pryme.loan.service;

import com.pryme.loan.dto.RecommendationRequest;
import com.pryme.loan.entity.LoanProduct;
import com.pryme.loan.repository.LoanProductRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class BankRecommendationService {

    private final LoanProductRepository loanProductRepository;

    public BankRecommendationService(LoanProductRepository loanProductRepository) {
        this.loanProductRepository = loanProductRepository;
    }

    public List<LoanProduct> getEligibleLoans(RecommendationRequest request) {
        // 1. Fetch all matching products from DB
        List<LoanProduct> eligibleProducts = loanProductRepository.findByTypeAndMinSalaryLessThanEqualAndMinCibilLessThanEqual(
                request.productType(),
                request.monthlyIncome(),
                request.cibilScore()
        );

        // 2. Sort them by Interest Rate (Lowest to Highest) for the best recommendation
        eligibleProducts.sort(Comparator.comparing(LoanProduct::getInterestRate));

        return eligibleProducts;
    }
}