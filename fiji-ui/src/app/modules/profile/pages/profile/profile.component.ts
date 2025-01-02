import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../../services/user/service/user.service';
import {HttpClient} from '@angular/common/http';
import {User} from '../../../../services/user/models/user';
import {UserUpdateRequest} from '../../../../services/user/models/user-update-request';
import {FormsModule} from '@angular/forms';
import {CommonModule, NgIf} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgIf
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  user: User | null = null;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.loadUser();
  }

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

  editProfile() {
    this.router.navigate(["edit-profile"])
  }

  showQR() {
    this.router.navigate(["\qr"]);
  }
}
