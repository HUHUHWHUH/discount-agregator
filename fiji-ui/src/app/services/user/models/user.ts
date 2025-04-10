export interface User {
  firstname: string;
  lastname: string;
  dateOfBirth: string; // ISO-формат даты (например, '1990-01-01')
  email: string;
  university: string;
  phoneNumber: string;
  password?: string; // Пароль можно сделать необязательным
}
