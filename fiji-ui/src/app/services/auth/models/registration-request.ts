/* tslint:disable */
/* eslint-disable */
export interface RegistrationRequest {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  dateOfBirth?: string; // ISO-формат даты (например, '1990-01-01')
  university?: string;
  phoneNumber?: string;
}
