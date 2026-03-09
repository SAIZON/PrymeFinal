package com.pryme.loan.repository;

import com.pryme.loan.entity.LoanProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface LoanProductRepository extends JpaRepository<LoanProduct, Long> {

    // Used by Recommendation Engine (Day 6)
    List<LoanProduct> findByTypeAndMinSalaryLessThanEqualAndMinCibilLessThanEqual(
            String type,
            BigDecimal monthlyIncome,
            int cibilScore
    );

    // Used by Admin Bank Manager (Day 9) 
    List<LoanProduct> findByBankId(Long bankId);
}