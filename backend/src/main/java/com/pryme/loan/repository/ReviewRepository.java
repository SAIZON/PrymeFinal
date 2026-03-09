package com.pryme.loan.repository;

import com.pryme.loan.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByIsFeaturedTrue();
}