import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from '../../services/auth/token/token.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {
    console.log('ApiService initialized with URL:', this.apiUrl);
  }

  private createHeaders(customHeaders?: HttpHeaders): HttpHeaders {
    const token = this.tokenService.getToken();
    console.log('Current auth token:', token ? 'Present' : 'Not present');
    
    let headers = customHeaders || new HttpHeaders();
    
    // Ensure we have Content-Type
    if (!headers.has('Content-Type')) {
      headers = headers.set('Content-Type', 'application/json');
    }

    // Add Authorization if we have a token
    if (token && !headers.has('Authorization')) {
      headers = headers.set('Authorization', `Bearer ${token}`);
      console.log('Added Authorization header');
    }

    return headers;
  }

  get<T>(path: string, params: HttpParams = new HttpParams(), headers?: HttpHeaders): Observable<T> {
    console.log('Making GET request to:', `${this.apiUrl}${path}`);
    return this.http.get<T>(`${this.apiUrl}${path}`, {
      headers: this.createHeaders(headers),
      params
    });
  }

  post<T>(path: string, body: any = {}, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${path}`, body, {
      headers: this.createHeaders(headers)
    });
  }

  put<T>(path: string, body: any = {}, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${path}`, body, {
      headers: this.createHeaders(headers)
    });
  }

  delete<T>(path: string, headers?: HttpHeaders): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${path}`, {
      headers: this.createHeaders(headers)
    });
  }
} 