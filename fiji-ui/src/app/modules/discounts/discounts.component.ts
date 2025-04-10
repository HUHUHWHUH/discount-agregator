import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/auth/services/authentication.service';
import { TokenService } from '../../services/auth/token/token.service';
import { DiscountService, DiscountResponse, PageResponseDiscountResponse } from '../../core/services/discount.service';
import { DiscountCardComponent } from './components/discount-card/discount-card.component';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-discounts',
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, DiscountCardComponent]
})
export class DiscountsComponent implements OnInit {
  discounts: DiscountResponse[] = [];
  filteredDiscounts: DiscountResponse[] = [];
  isAuthorized: boolean = false;
  isLoading: boolean = true;
  isLoadingDiscounts: boolean = false;
  error: string | null = null;
  
  // Search
  searchQuery: string = '';
  
  // Filter
  showFilterDropdown: boolean = false;
  activeFilters: string[] = [];
  categories: string[] = [
    'Food & Drink',
    'Shopping',
    'Entertainment',
    'Education',
    'Health & Beauty',
    'Services'
  ];
  
  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  constructor(
    private discountService: DiscountService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAuthorization();
    this.loadDiscounts();
  }

  // Filter methods
  toggleFilterDropdown(): void {
    this.showFilterDropdown = !this.showFilterDropdown;
  }

  toggleFilter(category: string): void {
    const index = this.activeFilters.indexOf(category);
    if (index === -1) {
      this.activeFilters.push(category);
    } else {
      this.activeFilters.splice(index, 1);
    }
    this.applyFilters();
  }

  clearFilters(): void {
    this.activeFilters = [];
    this.applyFilters();
  }

  private applyFilters(): void {
    if (this.activeFilters.length === 0) {
      this.filteredDiscounts = this.discounts;
    } else {
      this.filteredDiscounts = this.discounts.filter(discount => 
        this.activeFilters.some(filter => 
          discount.category?.toLowerCase() === filter.toLowerCase()
        )
      );
    }
  }

  private checkAuthorization(): void {
    this.isAuthorized = this.tokenService.isTokenValid();
    if (!this.isAuthorized) {
      this.router.navigate(['/login']);
    }
  }

  private loadDiscounts(): void {
    this.isLoading = true;
    this.isLoadingDiscounts = true;
    this.error = null;

    this.discountService.getAllDiscounts(this.currentPage, this.pageSize).subscribe({
      next: (response: PageResponseDiscountResponse) => {
        if (response.content) {
          this.discounts = response.content;
          this.filteredDiscounts = this.discounts;
          this.totalElements = response.totalElements || 0;
          this.totalPages = response.totalPages || 0;
        }
        this.isLoading = false;
        this.isLoadingDiscounts = false;
        this.applyFilters(); // Apply any active filters after loading
      },
      error: (err) => {
        this.error = 'Failed to load discounts. Please try again later.';
        this.isLoading = false;
        this.isLoadingDiscounts = false;
        console.error('Error loading discounts:', err);
      }
    });
  }

  // Search methods
  onSearch(): void {
    this.isLoadingDiscounts = true;
    this.error = null;

    // If search query is empty, load all discounts
    if (!this.searchQuery.trim()) {
      this.loadDiscounts();
      return;
    }

    this.discountService.searchDiscountsByName(this.searchQuery.trim(), this.currentPage, this.pageSize)
      .subscribe({
        next: (response: PageResponseDiscountResponse) => {
          if (response.content) {
            this.discounts = response.content;
            this.totalElements = response.totalElements;
            this.totalPages = response.totalPages;
            
            if (this.discounts.length === 0) {
              this.error = 'No discounts found matching your search.';
              this.filteredDiscounts = [];
            } else {
              this.error = null;
              this.applyFilters(); // Apply any active filters to search results
            }
          }
          this.isLoadingDiscounts = false;
        },
        error: (error) => {
          console.error('Error searching discounts:', error);
          this.error = 'Failed to search discounts. Please try again later.';
          this.isLoadingDiscounts = false;
        }
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    if (this.searchQuery.trim()) {
      this.onSearch();
    } else {
      this.loadDiscounts();
    }
  }

  viewDiscountDetails(discountId: number): void {
    if (!this.isAuthorized) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.router.navigate(['/discounts', discountId]);
  }
  
  // Navigation methods
  navigateToMainPage(): void {
    this.router.navigate(['/']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
  
  // Pagination methods
  isFirstPage(): boolean {
    return this.currentPage === 0;
  }

  isLastPage(): boolean {
    return this.currentPage === this.totalPages - 1;
  }

  goToFirstPage(): void {
    if (!this.isFirstPage()) {
      this.onPageChange(0);
    }
  }

  goToPreviousPage(): void {
    if (!this.isFirstPage()) {
      this.onPageChange(this.currentPage - 1);
    }
  }

  goToNextPage(): void {
    if (!this.isLastPage()) {
      this.onPageChange(this.currentPage + 1);
    }
  }

  goToLastPage(): void {
    if (!this.isLastPage()) {
      this.onPageChange(this.totalPages - 1);
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.onPageChange(page);
    }
  }

  retryLoad(): void {
    this.error = null;
    this.loadDiscounts();
  }
} 