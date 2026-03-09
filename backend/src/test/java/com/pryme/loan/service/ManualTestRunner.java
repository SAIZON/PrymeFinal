package com.pryme.loan.service;

import com.pryme.loan.dto.PrePaymentRequest;
import com.pryme.loan.dto.PrePaymentResponse;
import com.pryme.loan.service.impl.LoanSimulationServiceImpl;

import java.math.BigDecimal;
import java.util.Scanner;

public class ManualTestRunner {

    public static void main(String[] args) {
        // 1. Manually instantiate the Service (No @Autowired needed for this simple test)
        LoanSimulationServiceImpl loanService = new LoanSimulationServiceImpl();
        Scanner scanner = new Scanner(System.in);

        System.out.println("==========================================");
        System.out.println("   MANUAL PRE-PAYMENT STRATEGY TESTER");
        System.out.println("   (Type your numbers and press Enter)");
        System.out.println("==========================================");

        try {
            // 2. Ask for User Input
            System.out.print(">> Enter Loan Amount (e.g., 5000000): ");
            BigDecimal loanAmount = scanner.nextBigDecimal();

            System.out.print(">> Enter Interest Rate (e.g., 8.5): ");
            BigDecimal rate = scanner.nextBigDecimal();

            System.out.print(">> Enter Tenure in Years (e.g., 20): ");
            int tenure = scanner.nextInt();

            // 3. Setup the Request (Monster Strategy: 13th EMI + 5% Step-Up)
            PrePaymentRequest request = new PrePaymentRequest();
            request.setLoanAmount(loanAmount);
            request.setInterestRate(rate);
            request.setTenureYears(tenure);
            request.setEnable13thEmi(true);
            request.setEnableStepUp(true);

            // 4. Run Calculation
            System.out.println("\n... Calculating Monster Strategy ...");
            PrePaymentResponse response = loanService.calculatePrePaymentSavings(request);

            // 5. Print Results
            System.out.println("\n---------------- RESULTS -----------------");
            System.out.println("Regular EMI:       ₹ " + response.getRegularEmi());
            System.out.println("New Tenure:        " + (response.getNewMonths()/12) + " Years " + (response.getNewMonths()%12) + " Months");
            System.out.println("Original Interest: ₹ " + response.getRegularTotalInterest());
            System.out.println("New Interest:      ₹ " + response.getNewTotalInterest());
            System.out.println("------------------------------------------");
            System.out.println("TOTAL SAVINGS:     ₹ " + response.getInterestSaved());
            System.out.println("------------------------------------------");

        } catch (Exception e) {
            System.out.println("\nError: Invalid input. Please enter numbers only (e.g., 8.5 not 8.5%).");
            e.printStackTrace();
        }
    }
}