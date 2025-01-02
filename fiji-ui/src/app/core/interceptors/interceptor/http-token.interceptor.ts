import { inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { TokenService } from '../../../services/auth/token/token.service';
import { AuthenticationService } from '../../../services/auth/services/authentication.service';
import { Observable, throwError } from 'rxjs';

export const httpTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService); // Инжектируем TokenService
  const authService = inject(AuthenticationService); // Инжектируем AuthenticationService

  const accessToken = tokenService.getToken();

  // Добавляем токен в заголовки, если он есть
  const clonedRequest = accessToken
    ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
    : req;

  return next(clonedRequest).pipe(
    catchError((error) => {
      if (error.status === 401 && tokenService.getRefreshToken!) {
        console.log("xxx");
        // Если 401 ошибка, пробуем обновить токен
        return authService.refreshTokenMethod().pipe(
          switchMap((response) => {
            tokenService.setToken(response.token!); // Сохраняем новый accessToken
            tokenService.setRefreshToken(response.refreshToken!); // Сохраняем новый refreshToken

            // Повторно отправляем исходный запрос с новым токеном
            const newRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.token}`,
              },
            });
            return next(newRequest);
          }),
          catchError((refreshError) => {
            // Если обновление токена не удалось, перенаправляем на страницу логина
            tokenService.clearTokens();
            window.location.href = '/auth/login'; // Перенаправляем пользователя на страницу входа
            return throwError(refreshError); // Прокидываем ошибку дальше
          })
        );
      }

      // Если ошибка не связана с 401 или не удалось обновить токен
      return throwError(error);
    })
  );
};
