package com.fiji.discountservice.controller;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

public record DiscountRequest (
     Long id,
     String name, // Название предложения

     String company, // Название предложения

     String description,

     LocalDateTime startDate, // Дата начала предложения

     LocalDateTime endDate, // Дата окончания предложения

     boolean active // Активно ли предложение
)
{}
