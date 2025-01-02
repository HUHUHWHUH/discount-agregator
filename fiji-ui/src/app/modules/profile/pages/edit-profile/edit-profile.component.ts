import { Component } from '@angular/core';
import {User} from '../../../../services/user/models/user';
import {UserService} from '../../../../services/user/service/user.service';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    FormsModule
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
  };
  isLoading: boolean = true; // Флаг для отображения загрузки

  constructor(private userService: UserService,
              private router: Router) {}

  ngOnInit(): void {
    this.loadUser();
  }

  // Загрузка данных профиля пользователя
  loadUser(): void {
    this.userService.getUser().subscribe({
      next: (user) => {
        this.user = user;
        console.log("=========" + user.email);
      },
      error: (err) => {
        console.error('Ошибка при загрузке пользователя:', err);
        //alert('Не удалось загрузить данные пользователя. Убедитесь, что вы авторизованы.');
      },
    });
  }

  // Сохранение изменений профиля
  saveProfile(): void {
    if (this.user) {
      this.userService.updateUser(this.user).subscribe({
        next: () => {
          alert('Профиль успешно обновлен!');
        },
        error: (error) => {
          console.error('Ошибка при сохранении профиля:', error);
          alert('Не удалось обновить профиль.');
        },
      });
    }
  }

  backToProfile() {
    this.router.navigate(["/profile"])
  }
}
