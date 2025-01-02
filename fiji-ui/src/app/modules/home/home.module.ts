import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {httpTokenInterceptor} from '../../core/interceptors/interceptor/http-token.interceptor';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HomeRoutingModule
  ],
  providers: [
    HttpClient,
  ]
})
export class HomeModule { }
