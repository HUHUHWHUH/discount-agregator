import { Component } from '@angular/core';
import {User} from '../../../../services/user/models/user';
import {UserService, PasswordUpdateRequest} from '../../../../services/user/service/user.service';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {TokenService} from '../../../../services/auth/token/token.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {
  user: User = {
    firstname: '',
    lastname: '',
    dateOfBirth: '',
    email: '',
    university: '',
    phoneNumber: '',
  };
  isLoading: boolean = true; // Флаг для отображения загрузки
  
  // Fields for password change
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  
  // Password visibility toggles
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  
  // Password strength indicators
  passwordStrengthPercent: number = 0;
  passwordStrengthText: string = '';
  passwordStrengthClass: string = '';
  
  // Password requirements
  passwordLength: boolean = false;
  passwordHasUpper: boolean = false;
  passwordHasNumber: boolean = false;

  constructor(private userService: UserService,
              private router: Router,
              private tokenService: TokenService) {}

  ngOnInit(): void {
    // Check if the user is authenticated
    if (!this.tokenService.isTokenValid()) {
      // If not authenticated, redirect to the login page
      this.router.navigate(['/auth/login']);
      return;
    }
    
    this.loadUser();
  }

  // Загрузка данных профиля пользователя
  loadUser(): void {
    this.userService.getUser().subscribe({
      next: (user) => {
        this.user = user;
        this.isLoading = false;
        console.log('User data loaded:', user.email);
      },
      error: (err) => {
        console.error('Ошибка при загрузке пользователя:', err);
        this.isLoading = false;
        
        // If we get an authentication error when loading user data, redirect to login
        if (err.status === 401 || err.status === 403) {
          this.tokenService.clearTokens();
          this.router.navigate(['/auth/login']);
        }
      },
    });
  }

  // Check password strength
  checkPasswordStrength(): void {
    const password = this.newPassword;
    
    // Check requirements
    this.passwordLength = password.length >= 8;
    this.passwordHasUpper = /[A-Z]/.test(password);
    this.passwordHasNumber = /[0-9]/.test(password);
    
    // Calculate strength
    let strength = 0;
    
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 15;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20; // Special chars
    
    // Set strength indicators
    this.passwordStrengthPercent = strength;
    
    if (strength < 40) {
      this.passwordStrengthText = 'Слабый';
      this.passwordStrengthClass = 'weak';
    } else if (strength < 70) {
      this.passwordStrengthText = 'Средний';
      this.passwordStrengthClass = 'medium';
    } else {
      this.passwordStrengthText = 'Сильный';
      this.passwordStrengthClass = 'strong';
    }
  }
  
  // Reset password fields
  resetPasswordFields(): void {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordStrengthPercent = 0;
    this.passwordStrengthText = '';
    this.passwordStrengthClass = '';
    this.passwordLength = false;
    this.passwordHasUpper = false;
    this.passwordHasNumber = false;
  }
  
  // Change password without updating other profile information
  changePasswordOnly(): void {
    if (!this.currentPassword) {
      alert('Пожалуйста, введите ваш текущий пароль');
      return;
    }
    
    if (!this.newPassword) {
      alert('Пожалуйста, введите новый пароль');
      return;
    }
    
    if (this.newPassword !== this.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    
    // Create a minimal user object with just the password
    const passwordUpdate: PasswordUpdateRequest = {
      password: this.newPassword,
      currentPassword: this.currentPassword
    };
    
    this.userService.updatePassword(passwordUpdate).subscribe({
      next: () => {
        alert('Пароль успешно обновлен!');
        this.resetPasswordFields();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error updating password:', error);
        
        if (error.status === 400 && error.error?.message) {
          alert(error.error.message);
        } else if (error.status === 401) {
          alert('Неверный текущий пароль');
        } else {
          alert('Не удалось обновить пароль. Пожалуйста, попробуйте позже.');
        }
        
        // If we get an authentication error when saving profile, redirect to login
        if (error.status === 401 || error.status === 403) {
          this.tokenService.clearTokens();
          this.router.navigate(['/auth/login']);
        }
      }
    });
  }

  // Сохранение изменений профиля
  saveProfile(): void {
    if (this.user) {
      // Check if password change was requested
      if (this.newPassword) {
        if (this.newPassword !== this.confirmPassword) {
          alert('Новый пароль и подтверждение не совпадают');
          return;
        }
        
        if (!this.currentPassword) {
          alert('Для изменения пароля требуется текущий пароль');
          return;
        }
        
        // Add current and new password to the update request
        this.user.password = this.newPassword;
        // Note: In a real application, you should send the current password separately for verification
      }
      
      this.userService.updateUser(this.user).subscribe({
        next: () => {
          alert('Профиль успешно обновлен!');
          if (this.newPassword) {
            this.resetPasswordFields();
          }
          this.router.navigate(['/profile']);
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          alert('Не удалось обновить профиль. ' + (error.error?.message || 'Пожалуйста, попробуйте снова.'));
          
          // If we get an authentication error when saving profile, redirect to login
          if (error.status === 401 || error.status === 403) {
            this.tokenService.clearTokens();
            this.router.navigate(['/auth/login']);
          }
        },
      });
    }
  }

  backToProfile() {
    this.router.navigate(["/profile"])
  }
}
