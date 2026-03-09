package com.pryme.loan.controller;

import com.pryme.loan.dto.ReviewRequest;
import com.pryme.loan.entity.Review;
import com.pryme.loan.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // --- Public Endpoints ---
    @GetMapping("/public/reviews")
    public ResponseEntity<List<Review>> getFeaturedReviews() {
        return ResponseEntity.ok(reviewService.getFeaturedReviews());
    }

    // --- Admin Endpoints ---
    @GetMapping("/admin/reviews")
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @PostMapping("/admin/reviews")
    public ResponseEntity<Review> addReview(@RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.createReview(request));
    }

    @DeleteMapping("/admin/reviews/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/admin/reviews/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable Long id, @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.updateReview(id, request));
    }
}