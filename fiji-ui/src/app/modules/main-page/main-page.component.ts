import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TokenService } from '../../services/auth/token/token.service';
import { CommonModule } from '@angular/common';

interface Discount {
  company: string;
  value: string;
  category: string;
}

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class MainPageComponent implements OnInit {
  isLoggedIn = false;
  partnershipForm: FormGroup;
  discounts: Discount[] = [];
  discountCategories: string[] = [];

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private fb: FormBuilder
  ) {
    this.partnershipForm = this.fb.group({
      companyName: ['', Validators.required],
      contactName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = this.tokenService.getToken() !== null;
    this.loadDiscounts();
  }

  loadDiscounts(): void {
    // Mock data - in a real app, this would come from a service
    if (this.isLoggedIn) {
      this.discounts = [
        { company: 'Amazon', value: '10% скидка', category: 'Покупки' },
        { company: 'Nike', value: '15% скидка', category: 'Покупки' },
        { company: 'Apple', value: 'Образовательные цены', category: 'Технологии' },
        { company: 'Dell', value: '12% скидка на ноутбуки', category: 'Технологии' },
        { company: 'Spotify', value: '50% скидка на Premium', category: 'Развлечения' },
        { company: 'Netflix', value: 'Скидка на базовый план', category: 'Развлечения' }
      ];
      
      // Extract unique categories
      this.discountCategories = [...new Set(this.discounts.map(discount => discount.category))];
    }
  }

  getDiscountsByCategory(category: string): Discount[] {
    return this.discounts.filter(discount => discount.category === category);
  }

  onSubmitPartnership(): void {
    if (this.partnershipForm.valid) {
      console.log('Partnership form submitted:', this.partnershipForm.value);
      // In a real app, you would send this to your backend
      alert('Спасибо за интерес к партнерству с нами! Мы свяжемся с вами в ближайшее время.');
      this.partnershipForm.reset();
    }
  }
} 