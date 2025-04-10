import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { TokenService } from '../../services/auth/token/token.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface DiscountResponse {
  id: number;
  name: string;
  description: string;
  company: string;
  startDate: string;
  endDate: string;
  active: boolean;
  discountCover?: string;
  category: string;
}

export interface PageResponseDiscountResponse {
  content: DiscountResponse[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface Discount {
  id: string;
  company: string;
  description: string;
  discountValue: string;
  category: string;
  validFrom: Date;
  validTo: Date;
  terms?: string;
}

export interface DiscountCategory {
  id: string;
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private apiUrl = `${environment.apiUrl}/discounts`;

  constructor(
    private apiService: ApiService,
    private tokenService: TokenService
  ) {}

  private createAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    console.log('Using token for discount request:', token ? 'Present' : 'Not present');
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
      console.log('Added Authorization header for discount request');
    }

    return headers;
  }

  // Get all active discounts with pagination
  getAllDiscounts(page: number = 0, size: number = 10): Observable<PageResponseDiscountResponse> {
    console.log('Getting all discounts with pagination:', { page, size });
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.apiService.get<PageResponseDiscountResponse>('/discounts', params, this.createAuthHeaders());
  }

  // Get discounts by category with pagination
  getDiscountsByCategory(categoryId: string, page: number = 0, size: number = 10): Observable<PageResponseDiscountResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.apiService.get<PageResponseDiscountResponse>(`/discounts/category/${categoryId}`, params, this.createAuthHeaders());
  }

  // Get all company discounts with pagination
  getCompanyDiscounts(companyName: string, page: number = 0, size: number = 10): Observable<PageResponseDiscountResponse> {
    const params = new HttpParams()
      .set('companyName', companyName)
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.apiService.get<PageResponseDiscountResponse>('/discounts/company', params, this.createAuthHeaders());
  }

  // Get discount details by ID
  getDiscountDetails(id: number): Observable<DiscountResponse> {
    return this.apiService.get<DiscountResponse>(`/discounts/${id}`, new HttpParams(), this.createAuthHeaders());
  }

  // Activate a discount
  activateDiscount(id: number): Observable<string> {
    return this.apiService.put<string>(`/discounts/${id}/activate`, {}, this.createAuthHeaders());
  }

  // Deactivate a discount
  deactivateDiscount(id: number): Observable<string> {
    return this.apiService.put<string>(`/discounts/${id}/deactivate`, {}, this.createAuthHeaders());
  }

  // Upload discount cover image
  uploadDiscountCover(discountId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Remove Content-Type header as it will be set automatically for FormData
    const headers = this.createAuthHeaders().delete('Content-Type');
    
    return this.apiService.post<any>(`/discounts/cover/${discountId}`, formData, headers);
  }

  getCategories(): Observable<DiscountCategory[]> {
    return this.apiService.get<DiscountCategory[]>('/discounts/categories', new HttpParams(), this.createAuthHeaders());
  }

  // Partner-related endpoints
  submitPartnershipRequest(partnerData: any): Observable<any> {
    return this.apiService.post('/partners/apply', partnerData, this.createAuthHeaders());
  }

  updateDiscount(id: string, discountData: Partial<Discount>): Observable<Discount> {
    return this.apiService.put<Discount>(`/discounts/${id}`, discountData, this.createAuthHeaders());
  }

  // Search discounts by name
  searchDiscountsByName(name: string, page: number = 0, size: number = 10): Observable<PageResponseDiscountResponse> {
    const params = new HttpParams()
      .set('name', name)
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.apiService.get<PageResponseDiscountResponse>('/discounts/search', params, this.createAuthHeaders());
  }
} 