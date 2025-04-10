import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  institution: string;
  enrollmentYear: number;
  graduationYear: number;
  fijyCardNumber?: string;
  dateOfBirth: Date;
  phoneNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private apiService: ApiService) {}

  getCurrentStudent(): Observable<Student> {
    return this.apiService.get<Student>('/students/current');
  }

  updateStudent(studentData: Partial<Student>): Observable<Student> {
    return this.apiService.put<Student>('/students', studentData);
  }

  getFijyCard(): Observable<any> {
    return this.apiService.get('/students/fijy-card');
  }

  requestFijyCard(studentData: any): Observable<any> {
    return this.apiService.post('/students/fijy-card/request', studentData);
  }
} 