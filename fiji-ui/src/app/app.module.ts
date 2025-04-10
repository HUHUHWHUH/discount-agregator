import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';

// Services
import { ApiService } from './core/services/api.service';
import { AuthService } from './core/services/auth.service';
import { StudentService } from './core/services/student.service';
import { DiscountService } from './core/services/discount.service';
import { QRService } from './core/services/qr.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    ApiService,
    AuthService,
    StudentService,
    DiscountService,
    QRService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { } 