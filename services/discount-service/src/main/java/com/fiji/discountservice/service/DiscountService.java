//package com.fiji.discountservice.service;
//
//import com.fiji.discountservice.controller.DiscountResponse;
//import com.fiji.discountservice.controller.PageResponse;
//import com.fiji.discountservice.entity.Discount;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.domain.Sort;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//public class DiscountService {
//
//    public void deactivateDiscount(Long id) {
//        Discount discount = discountRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Discount not found with id: " + id));
//        discount.setActive(false);
//        discountRepository.save(discount);
//    }
//
//    public PageResponse<DiscountResponse> searchDiscountsByName(String name, int page, int size) {
//        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
//        Page<Discount> discountPage = discountRepository.findByNameContainingIgnoreCase(name, pageable);
//
//        List<DiscountResponse> discountResponses = discountPage.getContent().stream()
//                .map(this::mapToDiscountResponse)
//                .collect(Collectors.toList());
//
//        return new PageResponse<>(
//                discountResponses,
//                discountPage.getNumber(),
//                discountPage.getSize(),
//                discountPage.getTotalElements(),
//                discountPage.getTotalPages(),
//                discountPage.isFirst(),
//                discountPage.isLast()
//        );
//    }
//}