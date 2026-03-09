package com.pryme.loan.controller;

import com.pryme.loan.dto.BankDto;
import com.pryme.loan.dto.LoanProductDto;
import com.pryme.loan.entity.Bank;
import com.pryme.loan.entity.LoanProduct;
import com.pryme.loan.service.AdminBankService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081", "http://localhost:5173"})
public class AdminBankController {

    private final AdminBankService adminBankService;

    public AdminBankController(AdminBankService adminBankService) {
        this.adminBankService = adminBankService;
    }

    // --- BANK ENDPOINTS ---

    @PostMapping("/banks")
    public ResponseEntity<Bank> createBank(@Valid @RequestBody BankDto dto) {
        return ResponseEntity.ok(adminBankService.createBank(dto));
    }

    @GetMapping("/banks")
    public ResponseEntity<List<Bank>> getAllBanks() {
        return ResponseEntity.ok(adminBankService.getAllBanks());
    }

    @PutMapping("/banks/{id}")
    public ResponseEntity<Bank> updateBank(@PathVariable Long id, @Valid @RequestBody BankDto dto) {
        return ResponseEntity.ok(adminBankService.updateBank(id, dto));
    }

    @DeleteMapping("/banks/{id}")
    public ResponseEntity<String> deleteBank(@PathVariable Long id) {
        adminBankService.deleteBank(id);
        return ResponseEntity.ok("Bank deleted successfully");
    }

    @PatchMapping("/banks/{id}/toggle")
    public ResponseEntity<Bank> toggleVisibility(@PathVariable Long id) {
        return ResponseEntity.ok(adminBankService.toggleVisibility(id));
    }

    // --- PRODUCT ENDPOINTS ---

    @PostMapping("/banks/{bankId}/products")
    public ResponseEntity<LoanProduct> addProduct(@PathVariable Long bankId, @RequestBody LoanProductDto dto) {
        return ResponseEntity.ok(adminBankService.addProductToBank(bankId, dto));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<LoanProduct> updateProduct(@PathVariable Long id, @RequestBody LoanProductDto dto) {
        return ResponseEntity.ok(adminBankService.updateProduct(id, dto));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        adminBankService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully");
    }

    @PatchMapping("/products/{productId}/rate")
    public ResponseEntity<String> updateProductRate(@PathVariable Long productId, @Valid @RequestBody BankDto dto) {
        if (dto.baseInterestRate() == null) {
            return ResponseEntity.badRequest().body("baseInterestRate is required");
        }
        adminBankService.updateLoanProductInterestRate(productId, dto.baseInterestRate());
        return ResponseEntity.ok("Interest rate updated for Product ID: " + productId);
    }
}