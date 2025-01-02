package com.fiji.discountservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("discounts")
@RequiredArgsConstructor
public class DiscountController {
    private final DiscountService discountService;

    @PostMapping()
    public ResponseEntity<Long> saveDiscount(
            @Valid @RequestBody DiscountRequest request) {
        return ResponseEntity.ok(discountService.save(request));
    }

    @GetMapping("{discount-id}")
    public ResponseEntity<DiscountResponse> findDiscountById(
            @PathVariable("discount-id") Long discountId)
    {
        return ResponseEntity.ok(discountService.findById(discountId));
    }

    @GetMapping
    public ResponseEntity<PageResponse<DiscountResponse>> findAllActiveDiscounts(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(discountService.findAllActiveDiscounts(page, size));
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<String> activateOffer(@PathVariable Long id) {
        discountService.activateDiscount(id);
        return ResponseEntity.ok("Offer activated successfully.");
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<String> deactivateOffer(@PathVariable Long id) {
        discountService.deactivateDiscount(id);
        return ResponseEntity.ok("Offer deactivated successfully.");
    }

    @GetMapping("/company")
    public ResponseEntity<PageResponse<DiscountResponse>> findAllCompanyDiscounts(
            @RequestParam(name = "companyName") String companyName, // Параметр компании
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        // Получаем активные скидки для компании
        PageResponse<DiscountResponse> response = discountService.findAllActiveDiscountsByCompany(companyName, page, size);

        // Возвращаем результат в ResponseEntity
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/cover/{discount-id}", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadDiscountCoverPicture(
            @PathVariable("discount-id") Long discountId,
            //@Parameter
            @RequestPart("file") MultipartFile file
    ) {
        discountService.uploadDiscountCoverPicture(file, discountId);
        return ResponseEntity.accepted().build();
    }
}
