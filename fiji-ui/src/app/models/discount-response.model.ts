export interface DiscountResponse {
  id: number;
  name: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  category: string;
  termsAndConditions: string;
  createdAt: string;
  updatedAt: string;
  qrCodeUrl: string;
} 