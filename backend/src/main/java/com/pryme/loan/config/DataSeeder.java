//package com.pryme.loan.config;
//
//import com.pryme.loan.entity.CreditCardReward;
//import com.pryme.loan.entity.User;
//import com.pryme.loan.repository.CreditCardRewardRepository;
//import com.pryme.loan.repository.UserRepository;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.crypto.password.PasswordEncoder;
//
//import java.util.List;
//
//@Configuration
//public class DataSeeder {
//
//    @Bean
//    public CommandLineRunner initData(
//            UserRepository userRepository,
//            CreditCardRewardRepository rewardRepository, // Inject Reward Repo
//            PasswordEncoder passwordEncoder) {
//        return args -> {
//            // 1. Admin User Seeder (Keep existing logic)
//            if (userRepository.findByEmail("admin@pryme.com").isEmpty()) {
//                User admin = new User();
//                admin.setEmail("admin@pryme.com");
//                admin.setFullName("Super Admin");
//                admin.setMobile("0000000000");
//                admin.setRole("ADMIN");
//                admin.setPasswordHash(passwordEncoder.encode("admin123"));
//                userRepository.save(admin);
//                System.out.println("✅ DEFAULT ADMIN USER CREATED");
//            }
//
//            // 2. Credit Card Seeder (NEW)
//            if (rewardRepository.count() == 0) {
//                // Card 1: Dining Focused
//                CreditCardReward card1 = new CreditCardReward();
//                card1.setCardName("HDFC Regalia Gold");
//                card1.setDiningMultiplier(4.0); // 4x points on dining
//                card1.setTravelMultiplier(2.0);
//                card1.setOtherMultiplier(1.0);
//                card1.setPointValue(0.25); // 1 point = ₹0.25
//
//                // Card 2: Travel Focused
//                CreditCardReward card2 = new CreditCardReward();
//                card2.setCardName("Amex Platinum Travel");
//                card2.setDiningMultiplier(1.0);
//                card2.setTravelMultiplier(5.0); // 5x on travel
//                card2.setOtherMultiplier(1.5);
//                card2.setPointValue(0.50); // 1 point = ₹0.50
//
//                // Card 3: Balanced / Cashback
//                CreditCardReward card3 = new CreditCardReward();
//                card3.setCardName("SBI Cashback Card");
//                card3.setDiningMultiplier(5.0); // 5% cashback (treated as 5x points with 1.0 value)
//                card3.setTravelMultiplier(5.0);
//                card3.setOtherMultiplier(1.0);
//                card3.setPointValue(1.0); // 1 point = ₹1.00
//
//                rewardRepository.saveAll(List.of(card1, card2, card3));
//                System.out.println("✅ SAMPLE CREDIT CARDS SEEDED");
//            }
//        };
//    }
//}