package com.pryme.loan.service;

import com.pryme.loan.dto.ReviewRequest;
import com.pryme.loan.entity.Review;
import com.pryme.loan.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public List<Review> getFeaturedReviews() {
        return reviewRepository.findByIsFeaturedTrue();
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public Review createReview(ReviewRequest request) {
        Review review = new Review();
        review.setCustomerName(request.getCustomerName());
        review.setCustomerRole(request.getCustomerRole());
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setFeatured(request.isFeatured());
        return reviewRepository.save(review);
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }

    public Review updateReview(Long id, ReviewRequest request) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        review.setCustomerName(request.getCustomerName());
        review.setCustomerRole(request.getCustomerRole());
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setFeatured(request.isFeatured());

        return reviewRepository.save(review);
    }
}