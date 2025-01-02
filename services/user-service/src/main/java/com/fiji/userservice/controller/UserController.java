package com.fiji.userservice.controller;

import com.fiji.userservice.entity.User;
import com.fiji.userservice.security.JwtService;
import com.fiji.userservice.service.UserService;
import com.fiji.userservice.service.UserUpdateRequest;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;
    private final JwtService jwtService;

    @GetMapping("/getuser")
    public ResponseEntity<User> getUser(
            @RequestHeader("Authorization") String authorizationHeader) {

        String token = authorizationHeader.replace("Bearer ", "");
        Claims claims;
        String email;
        try {
            email = jwtService.extractClaim(token, claim -> claim.get("sub", String.class));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Optional<User> user = userService.findUserByEmail(email);
        if(user.isPresent()) {
            return ResponseEntity.ok(user.get());
        }
        else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateUser(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody UserUpdateRequest userUpdateRequest) {
        //Извлекаем токен из заголовка
        String token = authorizationHeader.replace("Bearer ", "");
        System.out.println("==================" + token);
        // Проверяем токен и извлекаем данные
        Claims claims;
        String email;
        try {
            email = jwtService.extractClaim(token, claim -> claim.get("sub", String.class));
        } catch (Exception e) {
            return new ResponseEntity<>("Invalid token", HttpStatus.UNAUTHORIZED);
        }

        // Получаем email или username из токена
        //String username = claims.getSubject(); // Обычно это email или username
        System.out.println("Authenticated user: " + email);

        //Обновляем данные пользователя
        userService.updateUserByEmail(email, userUpdateRequest);

        return new ResponseEntity<>("User updated successfully", HttpStatus.OK);
    }
}
