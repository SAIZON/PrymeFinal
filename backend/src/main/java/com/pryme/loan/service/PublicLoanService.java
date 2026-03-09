package com.pryme.loan.service;

import com.pryme.loan.dto.PublicLoanProductDto;
import com.pryme.loan.entity.LoanProduct;
import com.pryme.loan.repository.LoanProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PublicLoanService {

    private final LoanProductRepository loanProductRepository;

    public List<PublicLoanProductDto> getAllLoanProducts() {
        return loanProductRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private PublicLoanProductDto mapToDto(LoanProduct product) {
        // Handle null checks safely
        String bankName = (product.getBank() != null) ? product.getBank().getName() : "Unknown Bank";
        String bankLogo = (product.getBank() != null) ? product.getBank().getLogoUrl() : "";

        // Split features string into list if stored as comma-separated
        List<String> features = product.getFeatures() != null
                ? Arrays.asList(product.getFeatures().split(","))
                : List.of();

        return new PublicLoanProductDto(
                product.getId(),
                bankName,
                bankLogo,
                product.getType(), // This is used for filtering
                product.getInterestRate(),
                product.getProcessingFee(),
                product.getMaxAmount(),
                product.getTenure(),
                features
        );
    }
}