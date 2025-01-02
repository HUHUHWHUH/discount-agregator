import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // Сеттер для сохранения accessToken в LocalStorage
  setToken(token: string | null) {
    if (this.isBrowser && token) {
      localStorage.setItem('token', token);
    }
  }

  // Геттер для получения accessToken из LocalStorage
  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('token');
    }
    return null; // Возвращаем null на сервере
  }

  // Сеттер для сохранения refreshToken в LocalStorage
  setRefreshToken(refreshToken: string | null) {
    if (this.isBrowser && refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  // Геттер для получения refreshToken из LocalStorage
  getRefreshToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('refresh_token');
    }
    return null;
  }

  // Проверка, валиден ли accessToken
  isTokenValid(): boolean {
    if (!this.isBrowser) {
      return false; // Если выполняется на сервере, токен недействителен
    }

    const token = this.getToken();
    if (!token) {
      return false;
    }

    const jwtHelper = new JwtHelperService();
    const isTokenExpired = jwtHelper.isTokenExpired(token);
    if (isTokenExpired) {
      localStorage.clear();
      return false;
    }
    return true;
  }

  isRefreshTokenValid(): boolean {
    if (!this.isBrowser) {
      return false; // Если выполняется на сервере, токен недействителен
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return false;
    }

    const jwtHelper = new JwtHelperService();
    const isTokenExpired = jwtHelper.isTokenExpired(refreshToken);
    if (isTokenExpired) {
      localStorage.clear();
      return false;
    }
    return true;
  }

  // Проверка, невалиден ли accessToken
  isTokenNotValid(): boolean {
    return !this.isTokenValid();
  }

  // Получение ролей пользователя из декодированного токена
  get userRoles(): string[] {
    if (!this.isBrowser) {
      return []; // Если выполняется на сервере, возвращаем пустой массив
    }

    const token = this.getToken();
    if (token) {
      const jwtHelper = new JwtHelperService();
      const decodedToken = jwtHelper.decodeToken(token);
      console.log(decodedToken.authorities);
      return decodedToken.authorities || [];
    }
    return [];
  }

  // Очистка токенов из LocalStorage
  clearTokens(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
    }
  }
}
