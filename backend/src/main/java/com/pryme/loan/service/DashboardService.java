package com.pryme.loan.service;

import com.pryme.loan.dto.*;
import com.pryme.loan.entity.*;
import com.pryme.loan.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationRepository notificationRepository;
    private final ExternalLoanRepository externalLoanRepository;
    private final LoanProductRepository loanProductRepository;
    private final LoanDocumentRepository loanDocumentRepository;

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public DashboardStats getStats(String email) {
        User user = getUser(email);

        // Fix: Repositories return 'long', so we use 'long' here
        long activeApps = applicationRepository.countByUserIdAndStatusNot(user.getId(), ApplicationStatus.REJECTED);
        long unreadNotifs = notificationRepository.countByUserIdAndIsReadFalse(user.getId());

        java.math.BigDecimal totalDebt = externalLoanRepository.findByUserId(user.getId()).stream()
                .map(ExternalLoan::getOutstandingAmount)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

        return new DashboardStats(activeApps, unreadNotifs, totalDebt);
    }

    // --- APPLICATION METHODS ---
    public List<ApplicationDto> getUserApplications(String email) {
        User user = getUser(email);
        return applicationRepository.findByUserId(user.getId()).stream()
                .map(this::mapToApplicationDto) // Use the new helper method
                .collect(Collectors.toList());
    }

    // Add inside DashboardService class
    public ApplicationDto getApplicationDetails(String email, Long applicationId) {
        User user = getUser(email);
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // SECURITY CHECK: Ensure the application belongs to the logged-in user
        if (!app.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access Denied: You cannot view this application.");
        }

        return mapToApplicationDto(app); // Use the new helper method
    }



    private ApplicationDto mapToApplicationDto(Application app) {
        // 1. Map the documents list
        List<com.pryme.loan.dto.LoanDocumentDto> documentDtos = app.getDocuments() != null ?
                app.getDocuments().stream()
                        .map(doc -> new com.pryme.loan.dto.LoanDocumentDto(
                                doc.getId(),
                                doc.getFileName(),
                                doc.getType() != null ? doc.getType().name() : "OTHER",
                                doc.getStatus() != null ? doc.getStatus().name() : "PENDING",
                                doc.getUploadedAt()
                        ))
                        .collect(Collectors.toList())
                : java.util.List.of();

        // 2. Return the DTO with exactly 7 arguments
        return new ApplicationDto(
                app.getId(),
                app.getLoanType(),
                app.getBankName() != null ? app.getBankName() : "Pryme Partner",
                app.getAmount(),
                app.getStatus() != null ? app.getStatus().name() : "PENDING",
                app.getCreatedAt(),
                documentDtos // <-- The required 7th argument!
        );
    }


    @Transactional
    public void submitApplication(String email, ApplicationRequest request) {
        User user = getUser(email);

        Application app = new Application();
        app.setUser(user);
        app.setLoanType(request.loanType());
        app.setAmount(request.amount());
        app.setTenureMonths(request.tenureMonths());
        app.setStatus(ApplicationStatus.SUBMITTED);

        if (request.productId() != null) {
            LoanProduct product = loanProductRepository.findById(request.productId()).orElse(null);
            if (product != null) {
                app.setProductId(product.getId());
                app.setProductName(product.getType());
                if (product.getBank() != null) {
                    app.setBankName(product.getBank().getName());
                }
            }
        } else {
            app.setBankName("Pryme Partner Bank");
            app.setProductName(request.loanType());
        }

        applicationRepository.save(app);

        // Create Notification
        Notification notif = new Notification();
        notif.setUser(user);
        notif.setTitle("Application Submitted");
        notif.setMessage("Your application for " + app.getBankName() + " has been received.");
        notif.setType("INFO");
        notif.setCreatedAt(java.time.LocalDateTime.now());
        notificationRepository.save(notif);
    }

    // --- NOTIFICATION METHODS (Fixes "Cannot resolve method") ---
    public List<Notification> getNotifications(String email) {
        User user = getUser(email);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    // --- EXTERNAL LOAN METHODS (Fixes "Cannot resolve method") ---
    public List<ExternalLoan> getExternalLoans(String email) {
        User user = getUser(email);
        return externalLoanRepository.findByUserId(user.getId());
    }

    // --- DOCUMENT METHODS ---
    public List<LoanDocumentDto> getUserDocuments(String email) {
        User user = getUser(email);

        // 1. Fetch all applications for this user
        List<Application> userApplications = applicationRepository.findByUserId(user.getId());

        // 2. Fetch all documents linked to these applications and convert to DTOs
        return userApplications.stream()
                .flatMap(app -> loanDocumentRepository.findByApplicationId(app.getId()).stream())
                .map(doc -> new LoanDocumentDto(
                        doc.getId(),
                        doc.getFileName(),
                        doc.getType() != null ? doc.getType().name() : "OTHER",
                        doc.getStatus() != null ? doc.getStatus().name() : "PENDING",
//                        doc.getAdminRemarks(), // Include remarks if your DTO supports it
                        doc.getUploadedAt()
                ))
                .collect(Collectors.toList());
    }
}