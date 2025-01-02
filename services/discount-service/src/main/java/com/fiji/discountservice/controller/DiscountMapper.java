package com.fiji.discountservice.controller;

import com.fiji.discountservice.entity.Discount;
import org.springframework.stereotype.Service;

@Service
public class DiscountMapper {
    public Discount toDiscount(DiscountRequest request) {
        return Discount.builder()
                .id(request.id())
                .name(request.name())
                .description(request.description())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .active(request.active())
                .company(request.company())
                .build();
    }

    public DiscountResponse toDiscountResponse(Discount discount) {
        return DiscountResponse
                .builder()
                .id(discount.getId())
                .name(discount.getName())
                .description(discount.getDescription())
                .startDate(discount.getStartDate())
                .endDate(discount.getEndDate())
                .active(discount.isActive())
                .company(discount.getCompany())
                .discountCover(discount.getDiscountCover())
                //.discountCover(FileUtils.readFileFromLocation(discount.getDiscountCover()))
                .build();

    }

    DiscountResponse convertToResponse(Discount discount) {
        return DiscountResponse.builder()
                .id(discount.getId())
                .name(discount.getName())
                .startDate(discount.getStartDate())
                .endDate(discount.getEndDate())
                .description(discount.getDescription())
                .company(discount.getCompany())
                .active(discount.isActive())
                .discountCover(discount.getDiscountCover())
                .build();
    }
}
