package com.pryme.loan.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "credit_card_rewards")
public class CreditCardReward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String cardName;

    // Multipliers (e.g., 4.0 means 4 points per unit currency)
    private double diningMultiplier;
    private double travelMultiplier;
    private double otherMultiplier = 1.0; // Default base rate

    // Value of 1 Point in currency (e.g., 0.25 for 25 paise)
    private double pointValue;
}