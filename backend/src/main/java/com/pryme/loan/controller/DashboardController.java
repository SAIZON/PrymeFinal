package com.pryme.loan.controller;

import com.pryme.loan.dto.*;
import com.pryme.loan.entity.ExternalLoan;
import com.pryme.loan.entity.Notification;
import com.pryme.loan.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getStats(Principal principal) {
        return ResponseEntity.ok(dashboardService.getStats(principal.getName()));
    }

    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationDto>> getRecentApplications(Principal principal) {
        return ResponseEntity.ok(dashboardService.getUserApplications(principal.getName()));
    }

    @PostMapping("/apply")
    public ResponseEntity<String> submitApplication(@RequestBody ApplicationRequest request, Principal principal) {
        dashboardService.submitApplication(principal.getName(), request);
        return ResponseEntity.ok("Application submitted successfully");
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<Notification>> getNotifications(Principal principal) {
        // Matches the method name in Service now
        return ResponseEntity.ok(dashboardService.getNotifications(principal.getName()));
    }

    @GetMapping("/external-loans")
    public ResponseEntity<List<ExternalLoan>> getExternalLoans(Principal principal) {
        // Matches the method name in Service now
        return ResponseEntity.ok(dashboardService.getExternalLoans(principal.getName()));
    }

    @GetMapping("/application/{id}")
    public ResponseEntity<ApplicationDto> getApplicationDetails(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(dashboardService.getApplicationDetails(principal.getName(), id));
    }

    @GetMapping("/documents")
    public ResponseEntity<List<LoanDocumentDto>> getDocuments(Principal principal) {
        return ResponseEntity.ok(dashboardService.getUserDocuments(principal.getName()));
    }
}