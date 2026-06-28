package com.cuteshop.controller;

import com.cuteshop.dto.response.ResponseDTOs.*;
import com.cuteshop.service.impl.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/images")
@RequiredArgsConstructor
public class ImageController {

    private final CloudinaryService cloudinaryService;

    // Upload 1 ảnh
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Map<String, String>>> upload(
            @RequestParam("file") MultipartFile file) {
        try {
            String url = cloudinaryService.upload(file);
            return ResponseEntity.ok(ApiResponse.success(Map.of("url", url)));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Upload thất bại: " + e.getMessage()));
        }
    }

    // Upload nhiều ảnh
    @PostMapping("/upload-multiple")
    public ResponseEntity<ApiResponse<List<String>>> uploadMultiple(
            @RequestParam("files") List<MultipartFile> files) {
        List<String> urls = cloudinaryService.uploadMultiple(files);
        return ResponseEntity.ok(ApiResponse.success(urls));
    }

    // Xoá ảnh theo URL
    @DeleteMapping("/delete")
    public ResponseEntity<ApiResponse<Void>> delete(@RequestBody Map<String, String> body) {
        cloudinaryService.deleteByUrl(body.get("url"));
        return ResponseEntity.ok(ApiResponse.success("Đã xoá ảnh", null));
    }
}