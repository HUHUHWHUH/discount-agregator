package com.fiji.discountservice.scheduler;

import com.fiji.discountservice.controller.DiscountRepository;
import com.fiji.discountservice.controller.DiscountService;
import com.fiji.discountservice.entity.Discount;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DiscountScheduler {
    private final DiscountRepository offerRepository;

    public DiscountScheduler(DiscountRepository offerRepository) {
        this.offerRepository = offerRepository;
    }

    /**
     * Планировщик для автоматического обновления статуса предложений.
     * Выполняется каждый час.
     */
    @Scheduled(cron = "0 0 * * * *") // Каждые 0 минут каждого часа
    public void updateOfferStatuses() {
        List<Discount> discounts = offerRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        for (Discount discount : discounts) {
            boolean shouldBeActive = now.isAfter(discount.getStartDate()) && now.isBefore(discount.getEndDate());
            if (discount.isActive() != shouldBeActive) {
                discount.setActive(shouldBeActive);
                offerRepository.save(discount);
            }
        }
    }
}
