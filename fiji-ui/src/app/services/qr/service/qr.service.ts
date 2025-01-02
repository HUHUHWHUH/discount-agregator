// qr-code.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {

  private apiUrl = 'http://localhost:8222/api/qr/generate';

  constructor(private http: HttpClient) { }

  generateQrCode(email: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}?email=${email}`, { responseType: 'blob' });
  }
}
