import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationResponse } from '../../models/authentication-response';

export function refreshToken(
  http: HttpClient,
  rootUrl: string,
  params: { refreshToken: string }
): Observable<AuthenticationResponse> {
  return http.post<AuthenticationResponse>(`${rootUrl}/auth/refresh-token`, params);
}
