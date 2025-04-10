import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Discount } from '../../models/discount.model';
import { DiscountResponse } from '../../models/discount-response.model';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private apiUrl = `${environment.apiUrl}/discounts`;

  constructor(private http: HttpClient) {}

  getAllDiscounts(): Observable<DiscountResponse[]> {
    return this.http.get<DiscountResponse[]>(this.apiUrl);
  }

  getDiscountById(id: number): Observable<DiscountResponse> {
    return this.http.get<DiscountResponse>(`${this.apiUrl}/${id}`);
  }

  createDiscount(discount: Discount): Observable<DiscountResponse> {
    return this.http.post<DiscountResponse>(this.apiUrl, discount);
  }

  updateDiscount(id: number, discount: Discount): Observable<DiscountResponse> {
    return this.http.put<DiscountResponse>(`${this.apiUrl}/${id}`, discount);
  }

  deleteDiscount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getDiscountsByCategory(category: string): Observable<DiscountResponse[]> {
    return this.http.get<DiscountResponse[]>(`${this.apiUrl}/category/${category}`);
  }

  getActiveDiscounts(): Observable<DiscountResponse[]> {
    return this.http.get<DiscountResponse[]>(`${this.apiUrl}/active`);
  }
} 