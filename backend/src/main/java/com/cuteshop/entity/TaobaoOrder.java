package com.cuteshop.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "taobao_orders")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TaobaoOrder extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String orderCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String customerPhone;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String taobaoLink;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String productDescription;

    @Column(nullable = false)
    private Integer quantity;

    private String colorSize;

    @Column(precision = 10, scale = 2)
    private BigDecimal estimatedPriceCny;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TaobaoOrderStatus status = TaobaoOrderStatus.NEW;

    private String trackingNumber;

    @Column(columnDefinition = "TEXT")
    private String adminNote;

    public enum TaobaoOrderStatus {
        NEW,
        CONFIRMED,
        ORDERED_ON_TAOBAO,
        SHIPPED_FROM_CHINA,
        DELIVERED,
        CANCELLED
    }
}
