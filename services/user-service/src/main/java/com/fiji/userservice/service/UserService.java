package com.fiji.userservice.service;

import com.fiji.userservice.entity.User;
import com.fiji.userservice.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public User updateUser(Integer userId, UserUpdateRequest userUpdateRequest) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = optionalUser.get();

        // Обновление данных
        if (userUpdateRequest.getFirstname() != null) {
            user.setFirstname(userUpdateRequest.getFirstname());
        }
        if (userUpdateRequest.getLastname() != null) {
            user.setLastname(userUpdateRequest.getLastname());
        }
        if (userUpdateRequest.getDateOfBirth() != null) {
            user.setDateOfBirth(userUpdateRequest.getDateOfBirth());
        }
        if (userUpdateRequest.getEmail() != null) {
            user.setEmail(userUpdateRequest.getEmail());
        }
        if (userUpdateRequest.getPassword() != null) {
            // Преобразование пароля с использованием кодировщика
            user.setPassword(passwordEncoder.encode(userUpdateRequest.getPassword()));
        }

        return userRepository.save(user); // Сохраняем обновленного пользователя в базе
    }

    public User updateUserByEmail(String email, UserUpdateRequest userUpdateRequest) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = optionalUser.get();

        // Обновление данных
        if (userUpdateRequest.getFirstname() != null) {
            user.setFirstname(userUpdateRequest.getFirstname());
        }
        if (userUpdateRequest.getLastname() != null) {
            user.setLastname(userUpdateRequest.getLastname());
        }
        if (userUpdateRequest.getDateOfBirth() != null) {
            user.setDateOfBirth(userUpdateRequest.getDateOfBirth());
        }
        if (userUpdateRequest.getEmail() != null) {
            user.setEmail(userUpdateRequest.getEmail());
        }
        if (userUpdateRequest.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(userUpdateRequest.getPassword()));
        }

        return userRepository.save(user); // Сохраняем обновленного пользователя в базе
    }


    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> findUserById(Integer id) {
        return userRepository.findById(id);
    }

    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUserById(Integer id) {
        userRepository.deleteById(id);
    }
}
