package com.pryme.loan.controller;

import com.pryme.loan.dto.LeadRequest;
import com.pryme.loan.entity.Lead;
import com.pryme.loan.service.LeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    // FIX: Use LeadRequest DTO here.
    // This hides "id", "status", and "createdAt" from the API input.
    @PostMapping("/public/leads")
    public ResponseEntity<Lead> submitLead(@RequestBody LeadRequest request) {
        Lead lead = new Lead();
        lead.setName(request.getName());
        lead.setMobile(request.getMobile());
        lead.setEmail(request.getEmail());
        lead.setLoanType(request.getLoanType());
        lead.setMessage(request.getMessage());
        // Internal fields set automatically

        return ResponseEntity.ok(leadService.createLead(lead));
    }

    @GetMapping("/admin/leads")
    public ResponseEntity<Page<Lead>> getLeads(
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable
    ) {
        return ResponseEntity.ok(leadService.getAllLeads(pageable));
    }
}