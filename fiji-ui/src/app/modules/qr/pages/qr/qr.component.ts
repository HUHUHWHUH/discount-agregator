import { Component, OnInit } from '@angular/core';
import { QrCodeService } from '../../../../services/qr/service/qr.service';
import { NgIf } from '@angular/common';
import { UserService } from '../../../../services/user/service/user.service';
import { User } from '../../../../services/user/models/user';
import {Router} from '@angular/router';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr.component.html',
  standalone: true,
  imports: [
    NgIf
  ],
  styleUrls: ['./qr.component.scss']
})
export class QrComponent implements OnInit {
  qrCodeUrl: string = '';
  user: User | null = null;

  constructor(
    private qrCodeService: QrCodeService,
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
        console.log('Пользователь загружен:', this.user.email);
        // Генерация QR-кода только после загрузки пользователя
        this.generateQRCode();
      },
      error: (err) => {
        console.error('Ошибка при загрузке пользователя:', err);
        alert('Не удалось загрузить данные пользователя. Убедитесь, что вы авторизованы.');
      },
    });
  }

  generateQRCode(): void {
    if (!this.user?.email) {
      console.error('Email пользователя отсутствует.');
      return;
    }

    console.log('Генерация QR-кода для email:', this.user.email);
    this.qrCodeService.generateQrCode(this.user.email).subscribe({
      next: (response) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.qrCodeUrl = reader.result as string;
        };
        reader.readAsDataURL(response);
      },
      error: (err) => {
        console.error('Ошибка при генерации QR-кода:', err);
        alert('Не удалось сгенерировать QR-код.');
      },
    });
  }

  backToProfile() {
    this.router.navigate(["\profile"]);
  }
}
