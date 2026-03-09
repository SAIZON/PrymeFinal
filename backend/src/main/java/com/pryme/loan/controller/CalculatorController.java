package com.pryme.loan.controller;

import com.pryme.loan.dto.EligibilityRequest;
import com.pryme.loan.dto.EligibilityResponse;
import com.pryme.loan.dto.PrePaymentRequest;
import com.pryme.loan.dto.PrePaymentResponse;
import com.pryme.loan.service.LoanSimulationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;

@RestController
@RequestMapping("/api/v1/public/calculators")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081"})
public class CalculatorController {

    private final LoanSimulationService loanSimulationService;

    public CalculatorController(LoanSimulationService loanSimulationService) {
        this.loanSimulationService = loanSimulationService;
    }

    // 1. EMI Calculator
    @GetMapping("/emi")
    public ResponseEntity<BigDecimal> calculateEMI(
            @RequestParam double principal,
            @RequestParam double rate,
            @RequestParam double years) {

        if (rate <= 0) {
            BigDecimal totalMonths = BigDecimal.valueOf(years * 12);
            if (totalMonths.compareTo(BigDecimal.ZERO) == 0) return ResponseEntity.ok(BigDecimal.ZERO);
            return ResponseEntity.ok(BigDecimal.valueOf(principal).divide(totalMonths, 2, RoundingMode.HALF_UP));
        }

        BigDecimal p = BigDecimal.valueOf(principal);
        BigDecimal r = BigDecimal.valueOf(rate)
                .divide(BigDecimal.valueOf(12 * 100), 10, RoundingMode.HALF_UP);
        BigDecimal n = BigDecimal.valueOf(years * 12);

        BigDecimal onePlusR = BigDecimal.ONE.add(r);
        BigDecimal numerator = p.multiply(r).multiply(onePlusR.pow(n.intValue()));
        BigDecimal denominator = onePlusR.pow(n.intValue()).subtract(BigDecimal.ONE);

        BigDecimal emi = numerator.divide(denominator, 2, RoundingMode.HALF_UP);

        return ResponseEntity.ok(emi);
    }

    // 2. Pre-payment Calculator
    @PostMapping("/prepayment-savings")
    public ResponseEntity<PrePaymentResponse> calculatePrePayment(@RequestBody PrePaymentRequest request) {
        return ResponseEntity.ok(loanSimulationService.calculatePrePaymentSavings(request));
    }

    // 3. Eligibility Calculator (YOU WERE MISSING THIS)
    @PostMapping("/eligibility")
    public ResponseEntity<EligibilityResponse> checkEligibility(@RequestBody EligibilityRequest request) {
        return ResponseEntity.ok(loanSimulationService.checkEligibility(request));
    }
}