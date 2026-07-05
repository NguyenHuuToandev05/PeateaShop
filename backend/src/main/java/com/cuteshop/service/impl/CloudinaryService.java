package com.cuteshop.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    @Value("${cloudinary.folder:squishy-heaven}")
    private String folder;

    // Upload 1 file → trả về URL
    public String upload(MultipartFile file) throws IOException {
        Transformation transformation = new Transformation()
                .width(800)
                .height(800)
                .crop("limit")
                .chain()
                .quality("auto")
                .fetchFormat("auto");

        Map<?, ?> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder",          folder + "/products",
                        "transformation",  transformation,
                        "resource_type",   "image"
                )
        );
        return (String) result.get("secure_url");
    }

    // Upload nhiều file cùng lúc
    public List<String> uploadMultiple(List<MultipartFile> files) {
        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                urls.add(upload(file));
            } catch (IOException e) {
                log.error("Failed to upload file: {}", file.getOriginalFilename(), e);
            }
        }
        return urls;
    }

    // Xoá ảnh theo URL
    public void deleteByUrl(String url) {
        try {
            String publicId = extractPublicId(url);
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("Deleted image: {}", publicId);
        } catch (Exception e) {
            log.warn("Failed to delete image: {}", url, e);
        }
    }

    // Xoá nhiều ảnh
    public void deleteMultiple(List<String> urls) {
        if (urls == null || urls.isEmpty()) return;
        urls.forEach(this::deleteByUrl);
    }

    // Lấy public_id từ Cloudinary URL
    // URL: https://res.cloudinary.com/demo/image/upload/v123456/squishy-heaven/products/abc.webp
    // → public_id: squishy-heaven/products/abc
    private String extractPublicId(String url) {
        if (url == null || !url.contains("/upload/")) return "";
        String afterUpload = url.split("/upload/")[1];
        // Bỏ version nếu có (v123456/)
        String withoutVersion = afterUpload.replaceFirst("v\\d+/", "");
        // Bỏ extension
        int dotIndex = withoutVersion.lastIndexOf('.');
        return dotIndex > 0 ? withoutVersion.substring(0, dotIndex) : withoutVersion;
    }
}