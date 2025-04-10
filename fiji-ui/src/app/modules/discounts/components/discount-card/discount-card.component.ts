import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountResponse } from '../../../../core/services/discount.service';

@Component({
  selector: 'app-discount-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './discount-card.component.html',
  styleUrls: ['./discount-card.component.scss']
})
export class DiscountCardComponent {
  @Input() discount!: DiscountResponse;
  
  // Helper method to get the discount cover image URL
  getDiscountCoverUrl(): string {
    if (this.discount.discountCover) {
      // If the cover is a full URL, return it as is
      if (this.discount.discountCover.startsWith('http')) {
        return this.discount.discountCover;
      }
      // Otherwise, assume it's a path relative to assets
      return `/assets/images/covers/${this.discount.discountCover}`;
    }
    // Fallback image - using a gradient as fallback instead of an image
    return 'none';
  }
  
  // Background color fallback when no image is available
  getBackgroundStyle(): any {
    if (!this.discount.discountCover) {
      return {
        'background-image': 'linear-gradient(135deg, #43a047 0%, #2e7d32 100%)',
        'background-size': 'cover'
      };
    }
    return {
      'background-image': `url(${this.getDiscountCoverUrl()})`,
      'background-size': 'cover'
    };
  }
} 