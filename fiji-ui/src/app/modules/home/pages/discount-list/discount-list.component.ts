import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DiscountService} from '../../../../services/discount/service/discount.service';
import {Router} from '@angular/router';
import {PageResponseDiscountResponse} from '../../../../services/discount/models/page-response-book-response';
import {NgForOf} from '@angular/common';
import {DiscountCardComponent} from '../../components/discount-card/discount-card.component';
import {timeout} from 'rxjs';

@Component({
  selector: 'app-discount-list',
  standalone: true,
  imports: [
    NgForOf,
    DiscountCardComponent
  ],
  templateUrl: './discount-list.component.html',
  styleUrl: './discount-list.component.scss'
})
export class DiscountListComponent implements OnInit {
  page = 0;
  size = 1;
  pages: any = [];
  discountResponse: PageResponseDiscountResponse = {};

  constructor(
    private discountService: DiscountService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
      this.findAllActiveDiscounts();
    }

  private findAllActiveDiscounts() {
    console.log("page = " + this.page);
    console.log('Fetching discounts...');
    this.discountService.findAllActiveDiscounts(this.page, this.size)
      .subscribe({
        next: (discounts) => {
          console.log('Discounts fetched:', discounts);
          this.discountResponse = discounts;
          this.pages = Array(this.discountResponse.totalPages)
            .fill(0)
            .map((x, i) => i);
          console.log("page = " + this.page);
        },
        error: (err) => {
          console.error('Error fetching discounts:', err);
        }
      });
  }

  goToFirstPage() {
    this.page = 0;
    setTimeout(() => {
      this.findAllActiveDiscounts(); // Вызываем метод только после обновления
    }, 0);
  }

  goToPreviousPage() {
    this.page--;
    setTimeout(() => {
      this.findAllActiveDiscounts(); // Вызываем метод только после обновления
    }, 0);
  }

  goToPage(index: number) {
    this.page = index;
    this.cdr.detectChanges(); // Принудительное обновление компонента
    setTimeout(() => {
      this.findAllActiveDiscounts(); // Вызываем метод только после обновления
    }, 0);
  }

  goToNextPage() {
    this.page++;
    setTimeout(() => {
      this.findAllActiveDiscounts(); // Вызываем метод только после обновления
    }, 0);
  }

  goToLastPage() {
    this.page = this.discountResponse.totalPages as number - 1;
    setTimeout(() => {
      this.findAllActiveDiscounts(); // Вызываем метод только после обновления
    }, 0);
  }

  isLastPage(): boolean {
    return this.page == this.discountResponse.totalPages as number - 1;
  }
}
