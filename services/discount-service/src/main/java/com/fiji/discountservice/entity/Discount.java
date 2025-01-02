package com.fiji.discountservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Entity
@Table(name = "offers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Discount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // Название предложения

    @Column(nullable = false)
    private String company; // Название предложения

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private LocalDateTime startDate; // Дата начала предложения

    @Column(nullable = false)
    private LocalDateTime endDate; // Дата окончания предложения

    @Column(nullable = false)
    private boolean active; // Активно ли предложение

    private String discountCover;

}
