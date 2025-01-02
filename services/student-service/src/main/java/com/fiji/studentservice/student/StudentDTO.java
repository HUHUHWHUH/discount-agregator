package com.fiji.studentservice.student;

import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
public class StudentDTO {
    private Long id;
    private String name;
    private String email;
    private String password;
    private Set<Offer> favoriteOffers;
}
