package com.cuteshop.service.impl;

import com.cuteshop.dto.request.CreateTaobaoOrderRequest;
import com.cuteshop.dto.response.ResponseDTOs.*;
import com.cuteshop.entity.TaobaoOrder;
import com.cuteshop.entity.User;
import com.cuteshop.repository.TaobaoOrderRepository;
import com.cuteshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaobaoOrderServiceImpl {

    private final TaobaoOrderRepository taobaoOrderRepository;
    private final UserRepository userRepository;
    private static final AtomicLong COUNTER = new AtomicLong(2000);

    @Transactional
    public TaobaoOrderResponse create(CreateTaobaoOrderRequest req) {
        TaobaoOrder.TaobaoOrderBuilder builder = TaobaoOrder.builder()
                .orderCode("TB-" + COUNTER.incrementAndGet())
                .customerName(req.getCustomerName()).customerPhone(req.getCustomerPhone())
                .taobaoLink(req.getTaobaoLink()).productDescription(req.getProductDescription())
                .quantity(req.getQuantity()).colorSize(req.getColorSize())
                .estimatedPriceCny(req.getEstimatedPriceCny()).note(req.getNote())
                .status(TaobaoOrder.TaobaoOrderStatus.NEW);

        // Optionally attach logged-in user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            userRepository.findByEmail(auth.getName()).ifPresent(builder::user);
        }
        return toResponse(taobaoOrderRepository.save(builder.build()));
    }

    public List<TaobaoOrderResponse> getMy() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return taobaoOrderRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // Admin
    public PageResponse<TaobaoOrderResponse> adminGetAll(TaobaoOrder.TaobaoOrderStatus status,
                                                          String keyword, int page, int size) {
        Page<TaobaoOrder> p = taobaoOrderRepository.searchOrders(status, keyword, PageRequest.of(page, size));
        return PageResponse.<TaobaoOrderResponse>builder()
                .content(p.getContent().stream().map(this::toResponse).collect(Collectors.toList()))
                .pageNumber(p.getNumber()).pageSize(p.getSize())
                .totalElements(p.getTotalElements()).totalPages(p.getTotalPages()).last(p.isLast()).build();
    }

    @Transactional
    public TaobaoOrderResponse updateStatus(Long id, String status, String trackingNumber, String adminNote) {
        TaobaoOrder o = taobaoOrderRepository.findById(id).orElseThrow();
        o.setStatus(TaobaoOrder.TaobaoOrderStatus.valueOf(status));
        if (trackingNumber != null && !trackingNumber.isBlank()) o.setTrackingNumber(trackingNumber);
        if (adminNote != null) o.setAdminNote(adminNote);
        return toResponse(taobaoOrderRepository.save(o));
    }

    public TaobaoOrderResponse toResponse(TaobaoOrder o) {
        return TaobaoOrderResponse.builder()
                .id(o.getId()).orderCode(o.getOrderCode())
                .userId(o.getUser() != null ? o.getUser().getId() : null)
                .customerName(o.getCustomerName()).customerPhone(o.getCustomerPhone())
                .taobaoLink(o.getTaobaoLink()).productDescription(o.getProductDescription())
                .quantity(o.getQuantity()).colorSize(o.getColorSize())
                .estimatedPriceCny(o.getEstimatedPriceCny()).note(o.getNote())
                .status(o.getStatus().name()).trackingNumber(o.getTrackingNumber())
                .adminNote(o.getAdminNote())
                .createdAt(o.getCreatedAt()).updatedAt(o.getUpdatedAt()).build();
    }
}
