package com.fiji.userservice.service;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UserUpdateRequest {
    private String firstname;
    private String lastname;
    private LocalDate dateOfBirth;
    private String email;
    private String password; // если нужно менять пароль
}

