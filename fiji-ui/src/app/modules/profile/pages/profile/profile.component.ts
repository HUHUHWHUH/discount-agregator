import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../../services/user/service/user.service';
import {HttpClient} from '@angular/common/http';
import {User} from '../../../../services/user/models/user';
import {UserUpdateRequest} from '../../../../services/user/models/user-update-request';
import {FormsModule} from '@angular/forms';
import {CommonModule, DatePipe, NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {TokenService} from '../../../../services/auth/token/token.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgIf,
    DatePipe,
    RouterLink
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  user: User | null = null;

  constructor(
    private userService: UserService,
    private router: Router,
    private tokenService: TokenService
  ) {}


  ngOnInit(): void {
    // Check if the user is authenticated
    if (!this.tokenService.isTokenValid()) {
      // If not authenticated, redirect to the login page
      this.router.navigate(['/auth/login']);
      return;
    }
    
    this.loadUser();
  }

  loadUser(): void {
    this.userService.getUser().subscribe({
      next: (user) => {
        this.user = user;
        console.log("User loaded:", user.email);
      },
      error: (err) => {
        console.error('Ошибка при загрузке пользователя:', err);
        // If we get an authentication error when loading user data, redirect to login
        if (err.status === 401 || err.status === 403) {
          this.tokenService.clearTokens();
          this.router.navigate(['/auth/login']);
        }
      },
    });
  }

  editProfile() {
    this.router.navigate(["edit-profile"])
  }

  showQR() {
    this.router.navigate(["\qr"]);
  }
}
