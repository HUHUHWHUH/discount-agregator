import {DiscountResponse} from './discount-response';

export interface PageResponseDiscountResponse {
  content?: Array<DiscountResponse>;
  first?: boolean;
  last?: boolean;
  number?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
}
