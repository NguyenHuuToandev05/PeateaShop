package com.cuteshop.dto.request;

import com.cuteshop.entity.Order;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {

    @NotBlank(message = "Tên người nhận không được để trống")
    private String recipientName;

    @NotBlank(message = "Số điện thoại không được để trống")
    private String recipientPhone;

    @NotBlank(message = "Địa chỉ không được để trống")
    private String shippingAddress;

    @NotBlank(message = "Thành phố không được để trống")
    private String shippingCity;

    @NotBlank(message = "Tỉnh/Thành không được để trống")
    private String shippingProvince;

    private String note;

    @NotNull(message = "Phương thức thanh toán không được để trống")
    private Order.PaymentMethod paymentMethod;

    @NotEmpty(message = "Giỏ hàng không được để trống")
    @Valid
    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        @NotNull
        private Long productId;

        private String variant;

        @NotNull
        @Min(value = 1, message = "Số lượng tối thiểu là 1")
        private Integer quantity;
    }
}
