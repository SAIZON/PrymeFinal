package com.pryme.loan.controller;

import com.pryme.loan.entity.Application;
import com.pryme.loan.entity.ApplicationStatus;
import com.pryme.loan.entity.User;
import com.pryme.loan.repository.ApplicationRepository;
import com.pryme.loan.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1") // 🧠 Notice: This is NOT /public, so it requires a JWT token!
@RequiredArgsConstructor
public class UserApplicationController {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    @PostMapping("/apply")
    public ResponseEntity<?> submitApplication(@RequestBody Map<String, Object> payload, Authentication authentication) {

        // 1. Identify who is logged in from the JWT token
        String email = authentication.getName();
        User loggedInUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Application application = new Application();

        // 2. Strictly link this application to the logged-in User
        application.setUser(loggedInUser);

        // 3. Map the payload from React
        application.setLoanType((String) payload.get("loanType"));

        Object amountObj = payload.get("requestedAmount");
        if (amountObj instanceof Number) {
            application.setAmount(BigDecimal.valueOf(((Number) amountObj).doubleValue()));
        }

        application.setStatus(ApplicationStatus.SUBMITTED);

        Application savedApplication = applicationRepository.save(application);

        return ResponseEntity.ok(Map.of(
                "message", "Application submitted successfully",
                "applicationId", "PYR-" + savedApplication.getId()
        ));
    }
}