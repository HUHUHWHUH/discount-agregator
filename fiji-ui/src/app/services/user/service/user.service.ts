import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {User} from '../models/user';
import {UserUpdateRequest} from '../models/user-update-request';

// Interface for password update request
export interface PasswordUpdateRequest {
  password: string;
  currentPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8222/api/users'; // URL контроллера

  constructor(private http: HttpClient) {}

  /**
   * Извлекает токен из localStorage
   */
  private getToken(): string | null {
    if(typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    console.log(localStorage.getItem('token'));
    return null;
  }

  /**
   * Создает заголовок с авторизацией
   */
  private createAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (!token) {
      throw new Error('Пользователь не авторизован: токен отсутствует.');
    }
    console.log("from create headers" + token);
    return new HttpHeaders({
      Authorization: `Bearer` + token,
    });
  }

  /**
   * Получить данные пользователя
   */
  getUser(): Observable<User> {
    const headers = this.createAuthHeaders();
    var resp = this.http.get<User>(`${this.apiUrl}/getuser`);
    console.log("here");
    return resp;
  }

  /**
   * Обновить данные пользователя
   * @param updateRequest Данные для обновления
   */
  updateUser(updateRequest: UserUpdateRequest): Observable<string> {
    const headers = this.createAuthHeaders();
    return this.http.put<string>(`${this.apiUrl}/update`, updateRequest, { headers });
  }
  
  /**
   * Update only the user's password
   * @param passwordUpdate Object containing the new password and current password
   */
  updatePassword(passwordUpdate: PasswordUpdateRequest): Observable<string> {
    const headers = this.createAuthHeaders();
    return this.http.put<string>(`${this.apiUrl}/update-password`, passwordUpdate, { headers });
  }
}
