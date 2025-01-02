package com.fiji.discountservice.controller;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DiscountResponse {
    private Long id;

    private String name; // Название предложения

    private String company; // Название предложения

    private String description; // Процент скидки

    private LocalDateTime startDate; // Дата начала предложения

    private LocalDateTime endDate; // Дата окончания предложения

    private String discountCover;

    private boolean active; // Активно ли предложение
}
