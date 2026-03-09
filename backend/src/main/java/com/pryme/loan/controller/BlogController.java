package com.pryme.loan.controller;

import com.pryme.loan.dto.BlogPostRequest;
import com.pryme.loan.entity.BlogPost;
import com.pryme.loan.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;

    // --- Public Endpoints ---
    @GetMapping("/public/blogs")
    public ResponseEntity<List<BlogPost>> getAllBlogs() {
        return ResponseEntity.ok(blogService.getAllPosts());
    }

    @GetMapping("/public/blogs/{slug}")
    public ResponseEntity<BlogPost> getBlogBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(blogService.getPostBySlug(slug));
    }

    // --- Admin Endpoints ---
    @PostMapping("/admin/blogs")
    public ResponseEntity<BlogPost> createBlog(@RequestBody BlogPostRequest request) {
        return ResponseEntity.ok(blogService.createPost(request));
    }

    @DeleteMapping("/admin/blogs/{id}")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id) {
        blogService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/admin/blogs/{id}")
    public ResponseEntity<BlogPost> updateBlog(@PathVariable Long id, @RequestBody BlogPostRequest request) {
        return ResponseEntity.ok(blogService.updatePost(id, request));
    }
}