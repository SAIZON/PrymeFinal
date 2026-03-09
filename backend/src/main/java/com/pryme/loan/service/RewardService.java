package com.pryme.loan.service;

import com.pryme.loan.dto.RewardCalculationRequest;
import com.pryme.loan.dto.RewardCalculationResponse;
import com.pryme.loan.entity.CreditCardReward;
import com.pryme.loan.repository.CreditCardRewardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RewardService {

    private final CreditCardRewardRepository rewardRepository;

    // --- Admin: Configure Cards ---
    public CreditCardReward addCard(CreditCardReward card) {
        return rewardRepository.save(card);
    }

    public List<CreditCardReward> getAllCards() {
        return rewardRepository.findAll();
    }

    // --- Public: Calculate Logic ---
    public List<RewardCalculationResponse> calculateBestRewards(RewardCalculationRequest request) {
        List<CreditCardReward> allCards = rewardRepository.findAll();

        return allCards.stream().map(card -> {
            // 1. Calculate Points earned per category
            double diningPoints = request.getAnnualDiningSpend() * card.getDiningMultiplier();
            double travelPoints = request.getAnnualTravelSpend() * card.getTravelMultiplier();
            double otherPoints = request.getAnnualOtherSpend() * card.getOtherMultiplier();

            double totalPoints = diningPoints + travelPoints + otherPoints;

            // 2. Convert Points to Cash Value
            double totalSavings = totalPoints * card.getPointValue();

            return new RewardCalculationResponse(
                    card.getCardName(),
                    Math.round(totalPoints),
                    Math.round(totalSavings)
            );
        }).collect(Collectors.toList());
    }
}