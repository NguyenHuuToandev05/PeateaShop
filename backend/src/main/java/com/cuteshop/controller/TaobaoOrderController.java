package com.cuteshop.controller;

import com.cuteshop.dto.request.CreateTaobaoOrderRequest;
import com.cuteshop.dto.response.ResponseDTOs.*;
import com.cuteshop.entity.TaobaoOrder;
import com.cuteshop.service.impl.TaobaoOrderServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class TaobaoOrderController {

    private final TaobaoOrderServiceImpl taobaoOrderService;

    // ── Public / Customer ─────────────────────────────────────────────────────
    @PostMapping("/taobao-orders")
    public ResponseEntity<ApiResponse<TaobaoOrderResponse>> create(
            @Valid @RequestBody CreateTaobaoOrderRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Taobao order submitted!", taobaoOrderService.create(req)));
    }

    @GetMapping("/taobao-orders/my")
    public ResponseEntity<ApiResponse<List<TaobaoOrderResponse>>> myOrders() {
        return ResponseEntity.ok(ApiResponse.success(taobaoOrderService.getMy()));
    }

    // ── Admin ─────────────────────────────────────────────────────────────────
    @GetMapping("/admin/taobao-orders")
    public ResponseEntity<ApiResponse<PageResponse<TaobaoOrderResponse>>> adminGetAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        TaobaoOrder.TaobaoOrderStatus s = status != null
                ? TaobaoOrder.TaobaoOrderStatus.valueOf(status) : null;
        return ResponseEntity.ok(ApiResponse.success(
                taobaoOrderService.adminGetAll(s, keyword, page, size)));
    }

    @PatchMapping("/admin/taobao-orders/{id}/status")
    public ResponseEntity<ApiResponse<TaobaoOrderResponse>> updateStatus(
            @PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success(
                taobaoOrderService.updateStatus(id,
                        body.get("status"),
                        body.get("trackingNumber"),
                        body.get("adminNote"))));
    }
}
