package com.pryme.loan.config;

import com.pryme.loan.entity.*;
import com.pryme.loan.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import java.math.BigDecimal;

@Component
public class EntityTestRunner implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private NotificationRepository notificationRepository;
    @Autowired private ExternalLoanRepository externalLoanRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("--- STARTING PHASE 2 ENTITY TEST ---");

        User user = userRepository.findAll().stream().findFirst().orElse(null);
        if (user == null) {
            System.out.println("No users found. Skipping test.");
            return;
        }

        // 1. Test Notification
        Notification notif = new Notification();
        notif.setUser(user);
        notif.setTitle("Welcome!");
        notif.setMessage("Phase 2 Database setup is complete.");
        notif.setType("SUCCESS");
        notificationRepository.save(notif);
        System.out.println("--- SUCCESS: Notification Saved! ---");

        // 2. Test External Loan
        ExternalLoan loan = new ExternalLoan();
        loan.setUser(user);
        loan.setBankName("HDFC Bank");
        loan.setLoanType("Car Loan");
        loan.setOutstandingAmount(new BigDecimal("200000"));
        loan.setEmiAmount(new BigDecimal("5000"));
        externalLoanRepository.save(loan);
        System.out.println("--- SUCCESS: External Loan Saved! ---");
    }
}