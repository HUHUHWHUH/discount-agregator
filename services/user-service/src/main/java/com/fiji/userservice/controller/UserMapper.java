package com.fiji.userservice.controller;

import com.fiji.userservice.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(UserRequest request) {
        return User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .dateOfBirth(request.getDateOfBirth())
                .email(request.getEmail())
                .accountLocked(request.isAccountLocked())
                .enabled(request.isEnabled())
                .password(request.getPassword())
                .build();
    }

    public UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setFirstname(user.getFirstname());
        response.setLastname(user.getLastname());
        response.setDateOfBirth(user.getDateOfBirth());
        response.setEmail(user.getEmail());
        response.setAccountLocked(user.isAccountLocked());
        response.setEnabled(user.isEnabled());
        return response;
    }
}
