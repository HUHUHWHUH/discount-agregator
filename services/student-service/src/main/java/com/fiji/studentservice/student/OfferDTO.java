package com.fiji.studentservice.student;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OfferDTO {
    private Long id;
    private String title;
    private String description;
    private String partner;
}
