import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface AuthResponse {
  token: string;
  user: any;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiService: ApiService) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.getCurrentUser().subscribe();
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/login', credentials).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/register', userData).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Observable<any> {
    return this.apiService.get('/auth/me').pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return false;
    }

    try {
      // Decode the JWT token
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      
      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (tokenPayload.exp && tokenPayload.exp < currentTime) {
        // Token is expired, remove it
        this.logout();
        return false;
      }
      
      return true;
    } catch (e) {
      // If token is invalid (can't be decoded), remove it
      this.logout();
      return false;
    }
  }
} 