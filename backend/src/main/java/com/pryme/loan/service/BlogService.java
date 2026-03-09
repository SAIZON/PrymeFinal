package com.pryme.loan.service;

import com.pryme.loan.dto.BlogPostRequest;
import com.pryme.loan.entity.BlogPost;
import com.pryme.loan.repository.BlogPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.pryme.loan.exception.ResourceNotFoundException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogPostRepository blogRepository;

    public List<BlogPost> getAllPosts() {
        // Return Pinned posts first, then by date
        return blogRepository.findAll(Sort.by(Sort.Direction.DESC, "isPinned", "createdAt"));
    }

    public BlogPost getPostBySlug(String slug) {
        return blogRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with slug: " + slug)); // UPDATED
    }

    public BlogPost createPost(BlogPostRequest request) {
        BlogPost post = new BlogPost();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setAuthor(request.getAuthor());
        post.setPinned(request.isPinned());
        post.setCategory(request.getCategory());
        post.setImageUrl(request.getImageUrl());
        post.setExcerpt(request.getExcerpt());
        post.setSlug(generateUniqueSlug(request.getTitle()));
        return blogRepository.save(post);
    }

    // Logic: "Loan Tips" -> "loan-tips". If exists -> "loan-tips-1"
    private String generateUniqueSlug(String title) {
        String baseSlug = title.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "") // Remove special chars
                .replace(" ", "-");           // Replace spaces with dashes

        String finalSlug = baseSlug;
        int counter = 1;

        while (blogRepository.existsBySlug(finalSlug)) {
            finalSlug = baseSlug + "-" + counter;
            counter++;
        }
        return finalSlug;
    }

    public void deletePost(Long id) {
        blogRepository.deleteById(id);
    }

    public BlogPost updatePost(Long id, BlogPostRequest request) {
        BlogPost post = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + id)); // UPDATED

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setAuthor(request.getAuthor());
        post.setPinned(request.isPinned());
        post.setCategory(request.getCategory());
        post.setImageUrl(request.getImageUrl());
        post.setExcerpt(request.getExcerpt());


        // Note: We deliberately do NOT update the 'slug' here to prevent
        // breaking SEO links (404 errors) if the title changes.

        return blogRepository.save(post);
    }
}