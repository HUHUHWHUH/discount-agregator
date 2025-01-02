export interface DiscountResponse {
  id?: number;
  name?: string; // Название предложения
  company?: string; // Название компании
  description?: string; // Описание предложения
  startDate?: string; // Дата начала (в формате ISO 8601)
  endDate?: string; // Дата окончания (в формате ISO 8601)
  discountCover?: string; // Обложка скидки
  active?: boolean; // Активно ли предложение
}
