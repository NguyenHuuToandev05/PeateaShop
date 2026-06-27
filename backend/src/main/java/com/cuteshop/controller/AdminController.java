package com.cuteshop.controller;

import com.cuteshop.dto.response.ResponseDTOs.*;
import com.cuteshop.entity.Order;
import com.cuteshop.entity.TaobaoOrder;
import com.cuteshop.entity.User;
import com.cuteshop.repository.*;
import com.cuteshop.service.impl.OrderServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final OrderRepository orderRepository;
    private final TaobaoOrderRepository taobaoOrderRepository;
    private final UserRepository userRepository;
    private final OrderServiceImpl orderService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {
        // Stats
        long totalOrders    = orderRepository.count();
        long pendingOrders  = orderRepository.countByStatus(Order.OrderStatus.PENDING);
        long processingOrders = orderRepository.countByStatus(Order.OrderStatus.PROCESSING);
        var todayRevenue    = orderRepository.getTodayRevenue();
        long totalCustomers = userRepository.countByRole(User.Role.CUSTOMER);
        long newTaobao      = taobaoOrderRepository.countByStatus(TaobaoOrder.TaobaoOrderStatus.NEW);

        // Daily order stats (last 7 days)
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        List<DailyOrderStat> dailyStats = orderRepository
                .getDailyOrderCount(weekAgo)
                .stream()
                .map(row -> DailyOrderStat.builder()
                        .date(row[0].toString())
                        .count(((Number) row[1]).longValue())
                        .build())
                .collect(Collectors.toList());

        // Recent 5 orders
        List<OrderResponse> recentOrders = orderRepository
                .findAll(PageRequest.of(0, 5,
                        org.springframework.data.domain.Sort.by("createdAt").descending()))
                .getContent()
                .stream()
                .map(orderService::toResponse)
                .collect(Collectors.toList());

        DashboardResponse dash = DashboardResponse.builder()
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .processingOrders(processingOrders)
                .todayRevenue(todayRevenue)
                .totalCustomers(totalCustomers)
                .newTaobaoOrders(newTaobao)
                .dailyOrderStats(dailyStats)
                .recentOrders(recentOrders)
                .build();

        return ResponseEntity.ok(ApiResponse.success(dash));
    }

    @GetMapping("/customers")
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> getCustomers(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        var pageResult = userRepository.findAll(
                PageRequest.of(page, size,
                        org.springframework.data.domain.Sort.by("createdAt").descending()));

        List<UserResponse> content = pageResult.getContent().stream()
                .filter(u -> keyword == null ||
                        u.getFullName().toLowerCase().contains(keyword.toLowerCase()) ||
                        u.getEmail().toLowerCase().contains(keyword.toLowerCase()))
                .map(u -> UserResponse.builder()
                        .id(u.getId()).fullName(u.getFullName()).email(u.getEmail())
                        .phone(u.getPhone()).role(u.getRole().name())
                        .createdAt(u.getCreatedAt()).build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(
                PageResponse.<UserResponse>builder()
                        .content(content)
                        .pageNumber(pageResult.getNumber())
                        .pageSize(pageResult.getSize())
                        .totalElements(pageResult.getTotalElements())
                        .totalPages(pageResult.getTotalPages())
                        .last(pageResult.isLast())
                        .build()));
    }
}