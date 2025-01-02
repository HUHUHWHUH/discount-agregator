package com.fiji.authservice.controller;

//import com.fiji.authservice.email.EmailService;
//import com.fiji.authservice.email.EmailTemplateName;
import com.fiji.authservice.entity.Token;
import com.fiji.authservice.entity.TokenRepository;
import com.fiji.authservice.entity.User;
import com.fiji.authservice.entity.UserRepository;
import com.fiji.authservice.role.RoleRepository;
import com.fiji.authservice.security.JwtService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RoleRepository roleRepository;
    //private final EmailService emailService;
    private final TokenRepository tokenRepository;

    @Value("${application.mailing.frontend.activation-url}")
    private String activationUrl;

    @Value("3600000")
    private long refreshTokenExpiration;

    public void register(RegistrationRequest request) throws MessagingException {
        var userRole = roleRepository.findByName("USER")
                // todo - better exception handling
                .orElseThrow(() -> new IllegalStateException("ROLE USER was not initiated"));
        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .accountLocked(false)
                .enabled(false)
                .roles(List.of(userRole))
                .build();

        //убрать, если нужна валидаци пол отправке емейла с кодом подтверждения
        user.setEnabled(true);
        userRepository.save(user);
        // sendValidationEmail(user);
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = (User) auth.getPrincipal();
        var claims = new HashMap<String, Object>();
        claims.put("fullName", user.getFullName());

        // Генерация JWT токенов
        String jwtToken = jwtService.generateToken(claims, user);
        String refreshToken = jwtService.generateRefreshToken(user);

        // Сохранение refresh token в базе
        Token refreshTokenEntity = new Token();
        refreshTokenEntity.setToken(refreshToken);
        refreshTokenEntity.setUser(user);
        refreshTokenEntity.setCreatedAt(LocalDateTime.now());
        refreshTokenEntity.setExpiresAt(LocalDateTime.now().plus(refreshTokenExpiration, ChronoUnit.MILLIS));
        tokenRepository.save(refreshTokenEntity);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .username(user.getFullName())
                .build();
    }

    // Обновление токенов с использованием refresh токена
    //@Transactional
    public AuthenticationResponse refreshTokens(String refreshToken) {
        Token token = tokenRepository.findTokenByToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token: " + refreshToken));

        if (LocalDateTime.now().isAfter(token.getExpiresAt())) {
            throw new RuntimeException("Refresh token has expired");
        }

        var user = userRepository.findById(token.getUser().getId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Генерация новых токенов
        String jwtToken = jwtService.generateToken(new HashMap<>(), user);
        String newRefreshToken = jwtService.generateRefreshToken(user);

        // Обновление refresh токена в базе
        token.setToken(newRefreshToken);
        token.setExpiresAt(LocalDateTime.now().plus(refreshTokenExpiration, ChronoUnit.MILLIS)); // Используем ChronoUnit.MILLIS
        tokenRepository.save(token);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(newRefreshToken)
                .username(user.getFullName())
                .build();
    }

    //===================================================
    //===================================================
    private void saveRefreshToken(User user, String refreshToken) {
        Token token = Token.builder()
                .token(refreshToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(7))  // Срок действия refresh token
                .user(user)
                .type("REFRESH")
                .build();
        tokenRepository.save(token);
    }

//    public AuthenticationResponse refreshAccessToken(String refreshToken) {
//        Token savedToken = tokenRepository.findByToken(refreshToken)
//                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));
//
//        if (LocalDateTime.now().isAfter(savedToken.getExpiresAt())) {
//            throw new RuntimeException("Refresh token has expired");
//        }
//
//        var user = savedToken.getUser();
//        var claims = new HashMap<String, Object>();
//        claims.put("fullName", user.getFullName());
//
//        // Генерация нового access token
//        var newJwtToken = jwtService.generateToken(claims, user);
//
//        return AuthenticationResponse.builder()
//                .token(newJwtToken)
//                .username(user.getFullName())
//                .build();
//    }

    //@Transactional
//    public void activateAccount(String token) throws MessagingException {
//        Token savedToken = tokenRepository.findByToken(token)
//                // todo exception has to be defined
//                .orElseThrow(() -> new RuntimeException("Invalid token"));
//        if (LocalDateTime.now().isAfter(savedToken.getExpiresAt())) {
//            // sendValidationEmail(savedToken.getUser());
//            throw new RuntimeException("Activation token has expired. A new token has been send to the same email address");
//        }
//
//        var user = userRepository.findById(savedToken.getUser().getId())
//                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//        user.setEnabled(true);
//        userRepository.save(user);
//
//        savedToken.setValidatedAt(LocalDateTime.now());
//        tokenRepository.save(savedToken);
//    }

    private String generateAndSaveActivationToken(User user) {
        // Generate a token
        String generatedToken = generateActivationCode(6);
        var token = Token.builder()
                .token(generatedToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .user(user)
                .build();
        tokenRepository.save(token);

        return generatedToken;
    }

//    private void sendValidationEmail(User user) throws MessagingException {
//        var newToken = generateAndSaveActivationToken(user);
//
//        emailService.sendEmail(
//                user.getEmail(),
//                user.getFullName(),
//                EmailTemplateName.ACTIVATE_ACCOUNT,
//                activationUrl,
//                newToken,
//                "Account activation"
//                );
//    }

    private String generateActivationCode(int length) {
        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();

        SecureRandom secureRandom = new SecureRandom();

        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(characters.length());
            codeBuilder.append(characters.charAt(randomIndex));
        }

        return codeBuilder.toString();
    }
}