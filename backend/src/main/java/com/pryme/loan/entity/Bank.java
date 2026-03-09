package com.pryme.loan.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Entity
@Table(name = "banks")
public class Bank {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String logoUrl;

    private boolean isActive = true;

    @Column(precision = 5, scale = 2)
    private BigDecimal baseInterestRate;

    @OneToMany(mappedBy = "bank", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // <--- CRITICAL FIX FOR VISIBILITY
    private List<LoanProduct> products;

    // Manual getters/setters if Lombok fails (optional if @Data works)
    public void setActive(boolean active) { this.isActive = active; }
    public boolean isActive() { return isActive; }
}