export interface DiscountRequest {
  id?: number; // ID может быть необязательным для новых скидок
  name: string; // Название предложения
  company: string; // Компания
  description: string; // Описание
  startDate: string; // Дата начала (в формате ISO 8601)
  endDate: string; // Дата окончания (в формате ISO 8601)
  active: boolean; // Активность
}
