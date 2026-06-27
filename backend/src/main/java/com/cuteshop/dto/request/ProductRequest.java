package com.cuteshop.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductRequest {

    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String name;

    private String description;

    @NotNull(message = "Giá không được để trống")
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal price;

    @NotNull
    @Min(0)
    private Integer stock;

    private List<String> imageUrls;

    private List<String> variants;

    private Long categoryId;

    private Boolean active = true;
    private Boolean newArrival = false;
    private Boolean featured = false;
}
