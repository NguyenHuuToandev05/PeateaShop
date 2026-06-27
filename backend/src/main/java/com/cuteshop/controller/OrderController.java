package com.cuteshop.controller;

import com.cuteshop.dto.request.CreateOrderRequest;
import com.cuteshop.dto.response.ResponseDTOs.*;
import com.cuteshop.entity.Order;
import com.cuteshop.service.impl.OrderServiceImpl;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class OrderController {

    private final OrderServiceImpl orderService;

    // ── Customer ──────────────────────────────────────────────────────────────
    @PostMapping("/orders")
    public ResponseEntity<ApiResponse<OrderResponse>> create(@Valid @RequestBody CreateOrderRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Order placed successfully!", orderService.create(req)));
    }

    @GetMapping("/orders/my")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> myOrders() {
        return ResponseEntity.ok(ApiResponse.success(orderService.getMyOrders()));
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getById(id)));
    }

    // ── Admin ─────────────────────────────────────────────────────────────────
    @GetMapping("/admin/orders")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> adminGetAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Order.OrderStatus orderStatus = status != null ? Order.OrderStatus.valueOf(status) : null;
        return ResponseEntity.ok(ApiResponse.success(
                orderService.adminGetAll(orderStatus, keyword, startDate, endDate, page, size)));
    }

    @PatchMapping("/admin/orders/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateStatus(
            @PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success(
                orderService.updateStatus(id, body.get("status"), body.get("adminNote"))));
    }

    @PatchMapping("/admin/orders/{id}/payment")
    public ResponseEntity<ApiResponse<OrderResponse>> updatePayment(
            @PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success(
                orderService.updatePayment(id, body.get("paymentStatus"))));
    }
}
