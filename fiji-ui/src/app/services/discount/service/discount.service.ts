import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DiscountRequest } from '../models/discount-request';
import { DiscountResponse } from '../models/discount-response';
import { PageResponseDiscountResponse } from '../models/page-response-book-response';

@Injectable({
  providedIn: 'root',
})
export class DiscountService {
  private apiUrl = 'http://localhost:8222/discounts'; // URL Spring Boot-сервиса

  constructor(private http: HttpClient) {}

  // Сохранить новую скидку
  saveDiscount(discount: DiscountRequest): Observable<number> {
    return this.http.post<number>(this.apiUrl, discount);
  }

  // Получить скидку по ID
  findDiscountById(discountId: number): Observable<DiscountResponse> {
    return this.http.get<DiscountResponse>(`${this.apiUrl}/${discountId}`);
  }

  // Получить все активные скидки
  findAllActiveDiscounts(page: number, size: number): Observable<PageResponseDiscountResponse> {
    // Убираем кэширование, просто делаем запрос
    return this.http.get<PageResponseDiscountResponse>(this.apiUrl, {
      params: { page: page.toString(), size: size.toString() },
    });
  }

  // Активировать скидку
  activateOffer(id: number): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/${id}/activate`, {});
  }

  // Деактивировать скидку
  deactivateOffer(id: number): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/${id}/deactivate`, {});
  }

  // Получить все скидки компании
  findAllCompanyDiscounts(
    companyName: string,
    page: number = 0,
    size: number = 10
  ): Observable<{ content: DiscountResponse[] }> {
    const params = new HttpParams()
      .set('companyName', companyName)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<{ content: DiscountResponse[] }>(`${this.apiUrl}/company`, { params });
  }

  // Загрузить изображение обложки скидки
  uploadDiscountCoverPicture(discountId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}/cover/${discountId}`, formData);
  }
}
