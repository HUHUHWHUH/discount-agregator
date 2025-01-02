package com.fiji.discountservice.controller;

import com.fiji.discountservice.entity.Discount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, Long> {
    Page<Discount> findByActiveTrue(Pageable pageable);
    Page<Discount> findByCompanyAndActive(String company, boolean active, Pageable pageable);
}

