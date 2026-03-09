package com.pryme.loan.service;

import com.pryme.loan.entity.Lead;
import com.pryme.loan.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;

    public Lead createLead(Lead lead) {
        // In a real app, you might check for duplicates here
        return leadRepository.save(lead);
    }

    public Page<Lead> getAllLeads(Pageable pageable) {
        return leadRepository.findAll(pageable);
    }
}