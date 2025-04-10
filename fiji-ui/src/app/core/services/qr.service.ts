import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface QrCode {
  id: string;
  email: string;
  name: string;
  fijyCardNumber: string;
  institution: string;
  expiryDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class QRService {
  constructor(private apiService: ApiService) {}

  generateQR(): Observable<QrCode> {
    return this.apiService.post<QrCode>('/qr/generate');
  }

  validateQR(qrData: string): Observable<any> {
    return this.apiService.post('/qr/validate', { qrData });
  }

  getActiveQR(): Observable<QrCode> {
    return this.apiService.get<QrCode>('/qr/active');
  }

  invalidateQR(qrId: string): Observable<void> {
    return this.apiService.delete<void>(`/qr/${qrId}`);
  }
} 