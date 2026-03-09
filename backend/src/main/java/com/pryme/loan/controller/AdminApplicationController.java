package com.pryme.loan.controller;

import com.pryme.loan.entity.*;
import com.pryme.loan.exception.ResourceNotFoundException;
import com.pryme.loan.repository.ApplicationRepository;
import com.pryme.loan.repository.LoanDocumentRepository;
import com.pryme.loan.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/applications")
@RequiredArgsConstructor
public class AdminApplicationController {

    private final ApplicationRepository applicationRepository;
    private final NotificationRepository notificationRepository;
    private final LoanDocumentRepository loanDocumentRepository;

    @GetMapping
    public ResponseEntity<Page<Application>> getAllApplications(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        // Fetches all applications from all users
        return ResponseEntity.ok(applicationRepository.findAll(pageable));
    }

    // New Endpoint for updating status
    @PatchMapping("/{id}/status")
    public ResponseEntity<Application> updateApplicationStatus(
            @PathVariable Long id,
            @RequestParam ApplicationStatus status
    ) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        application.setStatus(status);

        Application updatedApp = applicationRepository.save(application);
        createStatusNotification(updatedApp);
        return ResponseEntity.ok(applicationRepository.save(application));
    }

//    @PatchMapping("/{id}/assign")
//    public ResponseEntity<Application> assignLead(
//            @PathVariable Long id,
//            @RequestBody java.util.Map<String, String> payload
//    ) {
//        String assigneeId = payload.get("assigneeId");
//
//        Application application = applicationRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));
//
//        // Assuming your Application entity has a setAssignee method
//        application.setAssignee(assigneeId);
//
//        return ResponseEntity.ok(applicationRepository.save(application));
//    }

    private void createStatusNotification(Application app) {
        Notification notification = new Notification();
        notification.setUser(app.getUser()); // Assumes Application has a User relationship
        notification.setTitle("Application Status Update");

        String message = String.format("Your %s application for %s has been %s.",
                app.getLoanType(),
                app.getBankName() != null ? app.getBankName() : "loan",
                app.getStatus().name()
        );

        notification.setMessage(message);

        // Determine type based on status
        if (app.getStatus() == ApplicationStatus.APPROVED) {
            notification.setType("SUCCESS");
        } else if (app.getStatus() == ApplicationStatus.REJECTED) {
            notification.setType("WARNING");
        } else {
            notification.setType("INFO");
        }

        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        notificationRepository.save(notification);
    }

    @PatchMapping("/documents/{documentId}/verify")
    public ResponseEntity<Void> verifyDocument(
            @PathVariable java.util.UUID documentId,
            @RequestParam DocumentStatus status,
            @RequestParam(required = false) String remarks) {

        LoanDocument document = loanDocumentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));

        document.setStatus(status);
        if (remarks != null) {
            document.setAdminRemarks(remarks);
        }

        loanDocumentRepository.save(document);
        return ResponseEntity.ok().build();
    }
}
