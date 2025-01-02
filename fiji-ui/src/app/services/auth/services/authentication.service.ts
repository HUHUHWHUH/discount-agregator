/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { authenticate } from '../fn/authentication/authenticate';
import { Authenticate$Params } from '../fn/authentication/authenticate';
import { AuthenticationResponse } from '../models/authentication-response';
import { confirm } from '../fn/authentication/confirm';
import { Confirm$Params } from '../fn/authentication/confirm';
import { register } from '../fn/authentication/register';
import { Register$Params } from '../fn/authentication/register';

@Injectable({ providedIn: 'root' })
export class AuthenticationService extends BaseService {
  private isAuthenticated = false; // Хранит статус авторизации
  private userName: string | null | undefined; // Имя пользователя
  private token: string | null = null;
  private refreshToken: string | null = null; // Добавляем поле для хранения refresh токена

  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);

    this.restoreAuthStatus();
  }

  // При логине сохраняем и access token, и refresh token
  login(params: Authenticate$Params): Observable<AuthenticationResponse> {
    return this.authenticate(params).pipe(
      map((response) => {
        this.setAuthStatus(true, response.username!, response.token!, response.refreshToken!);
        return response;
      })
    );
  }

  // Метод для обновления токенов
  refreshTokenMethod(): Observable<AuthenticationResponse> {
    const refreshToken = this.refreshToken;

    if (!refreshToken) {
      throw new Error('Refresh token not available');
    }

    return this.http.post<AuthenticationResponse>(`${this.rootUrl}/refresh-token`, { refreshToken }).pipe(
      map((response) => {
        // После успешного обновления токенов, сохраняем новые токены
        this.setAuthStatus(true, response.username!, response.token!, response.refreshToken!);
        return response;
      })
    );
  }

  // Логика для выхода из системы
  logout(): void {
    this.isAuthenticated = false;
    this.userName = null;
    this.token = null;
    this.refreshToken = null; // Очищаем refresh token

    // Удаляем данные из LocalStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('refreshToken'); // Удаляем refresh token
    }
  }

  // Восстановление статуса авторизации из LocalStorage
  restoreAuthStatus(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedToken = localStorage.getItem('token');
      const storedUserName = localStorage.getItem('userName');
      const storedRefreshToken = localStorage.getItem('refreshToken'); // Восстанавливаем refresh token

      if (storedToken && storedUserName && storedRefreshToken) {
        this.token = storedToken;
        this.userName = storedUserName;
        this.refreshToken = storedRefreshToken; // Восстанавливаем refresh token
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
      }
    }
  }

  // Устанавливаем статус авторизации и сохраняем токены
  setAuthStatus(isAuthenticated: boolean, userName: string, token: string, refreshToken: string): void {
    this.isAuthenticated = isAuthenticated;
    this.userName = userName;
    this.token = token;
    this.refreshToken = refreshToken;

    // Проверка, что код выполняется в браузере
    if (typeof window !== 'undefined' && window.localStorage) {
      // Сохраняем данные в LocalStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userName', userName);
      localStorage.setItem('refreshToken', refreshToken); // Сохраняем refresh token
    }
  }

  getAuthStatus(): boolean {
    return this.isAuthenticated;
  }

  getToken(): string | null {
    return this.token;
  }

  getUserName(): string | null | undefined {
    return this.userName;
  }

  // Прочие методы
  register$Response(params: Register$Params, context?: HttpContext): Observable<StrictHttpResponse<{ }>> {
    return register(this.http, this.rootUrl, params, context);
  }

  register(params: Register$Params, context?: HttpContext): Observable<{ }> {
    return this.register$Response(params, context).pipe(
      map((r: StrictHttpResponse<{ }>): { } => r.body)
    );
  }

  authenticate$Response(params: Authenticate$Params, context?: HttpContext): Observable<StrictHttpResponse<AuthenticationResponse>> {
    return authenticate(this.http, this.rootUrl, params, context);
  }

  authenticate(params: Authenticate$Params, context?: HttpContext): Observable<AuthenticationResponse> {
    return this.authenticate$Response(params, context).pipe(
      map((r: StrictHttpResponse<AuthenticationResponse>): AuthenticationResponse => r.body)
    );
  }

  confirm$Response(params: Confirm$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return confirm(this.http, this.rootUrl, params, context);
  }

  confirm(params: Confirm$Params, context?: HttpContext): Observable<void> {
    return this.confirm$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }
}
