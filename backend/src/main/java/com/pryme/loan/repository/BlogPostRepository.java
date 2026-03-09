package com.pryme.loan.repository;

import com.pryme.loan.entity.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    Optional<BlogPost> findBySlug(String slug);
    boolean existsBySlug(String slug);
}