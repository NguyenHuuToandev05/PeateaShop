package com.cuteshop.controller;

import com.cuteshop.dto.response.ResponseDTOs.*;
import com.cuteshop.entity.Category;
import com.cuteshop.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAll() {
        List<CategoryResponse> list = categoryRepository.findByActiveTrue()
                .stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/admin/categories")
    public ResponseEntity<ApiResponse<CategoryResponse>> create(@RequestBody Category req) {
        req.setId(null);
        return ResponseEntity.ok(ApiResponse.success(toResponse(categoryRepository.save(req))));
    }

    @PutMapping("/admin/categories/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> update(
            @PathVariable Long id, @RequestBody Category req) {
        Category cat = categoryRepository.findById(id).orElseThrow();
        cat.setName(req.getName());
        cat.setDescription(req.getDescription());
        cat.setImageUrl(req.getImageUrl());
        if (req.getActive() != null) cat.setActive(req.getActive());
        return ResponseEntity.ok(ApiResponse.success(toResponse(categoryRepository.save(cat))));
    }

    @DeleteMapping("/admin/categories/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        categoryRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }

    private CategoryResponse toResponse(Category c) {
        return CategoryResponse.builder()
                .id(c.getId()).name(c.getName()).description(c.getDescription())
                .imageUrl(c.getImageUrl()).active(c.getActive())
                .productCount(c.getProducts() != null ? c.getProducts().size() : 0)
                .build();
    }
}
