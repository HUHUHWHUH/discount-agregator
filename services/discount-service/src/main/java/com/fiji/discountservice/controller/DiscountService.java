package com.fiji.discountservice.controller;

import com.fiji.discountservice.entity.Discount;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiscountService {
    private final DiscountRepository discountRepository;
    private final DiscountMapper discountMapper;
    private final FileStorageService fileStorageService;

    public Long save(DiscountRequest request) {
        Discount discount = discountMapper.toDiscount(request);
        return discountRepository.save(discount).getId();
    }

    public DiscountResponse findById(Long id) {
        return discountRepository.findById(id)
                .map(discountMapper::toDiscountResponse)
                .orElseThrow(() -> new EntityNotFoundException("No discount with id: " + id));
    }

    public void activateDiscount(Long discountId) {
        Discount discount = discountRepository.findById(discountId)
                .orElseThrow(() -> new EntityNotFoundException("Discount not found with id: " + discountId));

        LocalDateTime now = LocalDateTime.now();
        if (now.isAfter(discount.getStartDate()) && now.isBefore(discount.getEndDate())) {
            discount.setActive(true);
            discountRepository.save(discount);
        } else {
            throw new IllegalStateException("Cannot activate discount outside the valid date range.");
        }
    }

    /**
     * Деактивирует предложение
     */
    public void deactivateDiscount(Long offerId) {
        Discount discount = discountRepository.findById(offerId)
                .orElseThrow(() -> new EntityNotFoundException("Offer not found with id: " + offerId));

        discount.setActive(false);
        discountRepository.save(discount);
    }

    public PageResponse<DiscountResponse> findAllActiveDiscounts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "startDate"));

        Page<Discount> discountPage = discountRepository.findByActiveTrue(pageable);

        List<DiscountResponse> discountResponses = discountPage.getContent().stream()
                .map(discountMapper::convertToResponse)
                .collect(Collectors.toList());

        PageResponse<DiscountResponse> response = new PageResponse<>();
        response.setContent(discountResponses);
        response.setNumber(discountPage.getNumber());
        response.setSize(discountPage.getSize());
        response.setTotalElements(discountPage.getTotalElements());
        response.setTotalPages(discountPage.getTotalPages());
        response.setFirst(discountPage.isFirst());
        response.setLast(discountPage.isLast());

        return response;
    }

    public PageResponse<DiscountResponse> findAllActiveDiscountsByCompany(String companyName, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "startDate"));

        // Условие активных скидок
        Page<Discount> discountPage = discountRepository.findByCompanyAndActive(companyName, true, pageable);

        List<DiscountResponse> discountResponses = discountPage.getContent().stream()
                .map(discountMapper::convertToResponse)
                .collect(Collectors.toList());

        return new PageResponse<>(
                discountResponses,
                discountPage.getNumber(),
                discountPage.getSize(),
                discountPage.getTotalElements(),
                discountPage.getTotalPages(),
                discountPage.isFirst(),
                discountPage.isLast()
        );
    }

    public void uploadDiscountCoverPicture(MultipartFile file, Long discountId) {
        Discount discount = discountRepository.findById(discountId)
                .orElseThrow(() -> new EntityNotFoundException("Discount not found with id: " + discountId));
        var discountCover = fileStorageService.saveFile(file, discount);
        discount.setDiscountCover(discountCover);
        discountRepository.save(discount);
    }
}
