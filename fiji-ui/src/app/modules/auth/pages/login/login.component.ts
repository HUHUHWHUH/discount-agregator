import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {NgForOf, NgIf} from '@angular/common';
import {AuthenticationRequest} from '../../../../services/auth/models/authentication-request';
import {AuthenticationService} from '../../../../services/auth/services/authentication.service';
import {TokenService} from '../../../../services/auth/token/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  authRequest: AuthenticationRequest = {email: '', password: ''};
  errorMsg: Array<string> = [];

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private tokenService: TokenService
  ) {
  }

  login() {
    this.errorMsg = [];
    this.authService.authenticate({
      body: this.authRequest
    }).subscribe({
      next: (res) => {
        // Сохраняем токен и имя пользователя в LocalStorage и обновляем состояние
        this.tokenService.setToken(res.token as string);
        this.authService.setAuthStatus(true, res.username!, res.token!, res.refreshToken!);

        // Перенаправляем на домашнюю страницу
        this.router.navigate(['home']);
      },
      error: (err) => {
        console.log(err);
        if (err.error.validationErrors) {
          this.errorMsg = err.error.validationErrors;
        } else {
          this.errorMsg.push(err.error.error);
        }
      }
    });
  }

  register() {
    this.router.navigate(['auth/register']);
  }
}
