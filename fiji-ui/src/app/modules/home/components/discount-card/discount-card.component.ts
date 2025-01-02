import {Component, Input} from '@angular/core';
import {DiscountResponse} from '../../../../services/discount/models/discount-response';

@Component({
  selector: 'app-discount-card',
  standalone: true,
  imports: [],
  templateUrl: './discount-card.component.html',
  styleUrl: './discount-card.component.scss'
})
export class DiscountCardComponent {
  private _discount: DiscountResponse = {};

  get discount(): DiscountResponse {
    return this._discount;
  }

  @Input()
  set discount(value: DiscountResponse) {
    this._discount = value;
  }

  private _discountCover: string | undefined;

  get discountCover(): string | undefined {
    if(this._discount.discountCover) {
      //return 'data:image/jpg;base64, ' + this.discount.discountCover;
      var normalizedPath =  this._discount.discountCover.replace('//', '/');
      return '/assets/images/covers/' + normalizedPath;
    }
    return '/assets/images/covers/no_image.png';
  }
}
