package com.fiji.gateway.filter;

import com.fiji.gateway.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationFilter.class);

    @Autowired
    private RouteValidator validator;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        System.out.println("AuthenticationFilter start");
        return (exchange, chain) -> {
            // Логируем информацию о запросе
            logger.info("Request path: {}", exchange.getRequest().getURI().getPath());

            // Проверка, что маршрут требует аутентификации
            if (validator.isSecured.test(exchange.getRequest())) {
                logger.info("Route requires authentication");

                // Проверка наличия заголовка Authorization
                if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                    logger.warn("Missing Authorization header");
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();  // Завершаем запрос с кодом 401
                }

                // Извлечение токена из заголовка
                String authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
                System.out.println("Auth hader: " + authHeader);
                logger.info("Authorization header found: {}", authHeader);

                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    authHeader = authHeader.substring(7);
                    logger.info("Extracted token: {}", authHeader);
                }

                // Валидация токена
                try {
                    jwtUtil.validateToken(authHeader);  // Проводим валидацию токена
                    logger.info("Token validated successfully");
                } catch (Exception e) {
                    logger.error("Token validation failed: {}", e.getMessage());
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();  // Завершаем запрос с ошибкой 401
                }
            }

            // Пропускаем запрос дальше
            return chain.filter(exchange);
        };
    }

    public static class Config {}
}
