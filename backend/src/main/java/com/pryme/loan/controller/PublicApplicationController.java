//package com.pryme.loan.controller;
//
//import com.pryme.loan.entity.Application;
//import com.pryme.loan.entity.ApplicationStatus;
//import com.pryme.loan.repository.ApplicationRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.time.LocalDateTime;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/v1/public")
//@RequiredArgsConstructor
//public class PublicApplicationController {
//
//    private final ApplicationRepository applicationRepository;
//
//    @PostMapping("/apply")
//    public ResponseEntity<?> submitApplication(@RequestBody Map<String, Object> payload) {
//
//        Application application = new Application();
//
//        // Map the frontend JSON payload
//        application.setLoanType((String) payload.get("loanType"));
//
//        // Handle number conversion safely
//        Object amount = payload.get("requestedAmount");
//        if (amount instanceof Number) {
//            application.setRequestedAmount(((Number) amount).doubleValue());
//        }
//
//        // Set default internal fields
//        application.setStatus(ApplicationStatus.PENDING); // Or UNDER_REVIEW based on your enum
//        application.setCreatedAt(LocalDateTime.now());
//
//        Application savedApplication = applicationRepository.save(application);
//
//        // Return JSON with the ID so your frontend toast can show the Lead ID!
//        return ResponseEntity.ok(Map.of(
//                "message", "Application submitted successfully",
//                "applicationId", "PYR-" + savedApplication.getId()
//        ));
//    }
//}