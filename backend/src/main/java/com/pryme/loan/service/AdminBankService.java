package com.pryme.loan.service;

import com.pryme.loan.dto.BankDto;
import com.pryme.loan.dto.LoanProductDto;
import com.pryme.loan.entity.Bank;
import com.pryme.loan.entity.LoanProduct;
import com.pryme.loan.repository.BankRepository;
import com.pryme.loan.repository.LoanProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminBankService {

    private final BankRepository bankRepository;
    private final LoanProductRepository loanProductRepository;

    // --- BANK OPERATIONS ---

    public Bank createBank(BankDto dto) {
        Bank bank = new Bank();
        bank.setName(dto.name());
        bank.setLogoUrl(dto.logoUrl());
        bank.setActive(dto.active() != null ? dto.active() : true);
        bank.setBaseInterestRate(dto.baseInterestRate());
        return bankRepository.save(bank);
    }

    public List<Bank> getAllBanks() {
        return bankRepository.findAll();
    }

    public Bank updateBank(Long id, BankDto dto) {
        Bank bank = bankRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bank not found"));
        bank.setName(dto.name());
        bank.setLogoUrl(dto.logoUrl());
        bank.setActive(dto.active());
        bank.setBaseInterestRate(dto.baseInterestRate());
        return bankRepository.save(bank);
    }

    public void deleteBank(Long id) {
        if (!bankRepository.existsById(id)) {
            throw new RuntimeException("Bank not found");
        }
        bankRepository.deleteById(id);
    }

    public Bank toggleVisibility(Long id) {
        Bank bank = bankRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bank not found"));
        bank.setActive(!bank.isActive());
        return bankRepository.save(bank);
    }

    @Transactional
    public void updateBankRates(Long bankId, BigDecimal newBaseRate) {
        Bank bank = bankRepository.findById(bankId)
                .orElseThrow(() -> new RuntimeException("Bank not found"));
        bank.setBaseInterestRate(newBaseRate);
        bankRepository.save(bank);
    }

    // --- PRODUCT OPERATIONS ---

    public LoanProduct addProductToBank(Long bankId, LoanProductDto dto) {
        Bank bank = bankRepository.findById(bankId)
                .orElseThrow(() -> new RuntimeException("Bank not found"));

        LoanProduct product = new LoanProduct();
        product.setBank(bank);
        product.setType(dto.type());
        product.setInterestRate(dto.interestRate());
        product.setProcessingFee(dto.processingFee());
        product.setMaxAmount(dto.maxAmount());
        product.setTenure(dto.tenure());
        product.setFeatures(dto.features());

        // Defaults
        product.setMinSalary(BigDecimal.ZERO);
        product.setMinCibil(0);

        return loanProductRepository.save(product);
    }

    public LoanProduct updateProduct(Long id, LoanProductDto dto) {
        LoanProduct product = loanProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setType(dto.type());
        product.setInterestRate(dto.interestRate());
        product.setProcessingFee(dto.processingFee());
        product.setMaxAmount(dto.maxAmount());
        product.setTenure(dto.tenure());
        product.setFeatures(dto.features());

        return loanProductRepository.save(product);
    }

    public void deleteProduct(Long id) {
        if (!loanProductRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        loanProductRepository.deleteById(id);
    }

    @Transactional
    public void updateLoanProductInterestRate(Long productId, BigDecimal newRate) {
        LoanProduct product = loanProductRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setInterestRate(newRate.toString() + "%");
        loanProductRepository.save(product);
    }
}