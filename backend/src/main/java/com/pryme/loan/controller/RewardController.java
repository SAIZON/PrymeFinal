package com.pryme.loan.controller;

import com.pryme.loan.dto.RewardCalculationRequest;
import com.pryme.loan.dto.RewardCalculationResponse;
import com.pryme.loan.entity.CreditCardReward;
import com.pryme.loan.service.RewardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class RewardController {

    private final RewardService rewardService;

    // --- Public: Calculator ---
    @PostMapping("/public/calculate/rewards")
    public ResponseEntity<List<RewardCalculationResponse>> calculateRewards(@RequestBody RewardCalculationRequest request) {
        return ResponseEntity.ok(rewardService.calculateBestRewards(request));
    }

    // --- Admin: Config Management ---
    @PostMapping("/admin/rewards/config")
    public ResponseEntity<CreditCardReward> addCardConfig(@RequestBody CreditCardReward card) {
        return ResponseEntity.ok(rewardService.addCard(card));
    }

    @GetMapping("/admin/rewards/config")
    public ResponseEntity<List<CreditCardReward>> getAllCardConfigs() {
        return ResponseEntity.ok(rewardService.getAllCards());
    }
}