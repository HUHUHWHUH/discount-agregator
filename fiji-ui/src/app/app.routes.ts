import { Routes } from '@angular/router';
import {LoginComponent} from './modules/auth/pages/login/login.component';
import {RegisterComponent} from './modules/auth/pages/register/register.component';
import {ProfileComponent} from './modules/profile/pages/profile/profile.component';
import {EditProfileComponent} from './modules/profile/pages/edit-profile/edit-profile.component';
import {QrComponent} from './modules/qr/pages/qr/qr.component';
import {UserInformationComponent} from './modules/qr/pages/user-information/user-information.component';

export const routes: Routes = [
  {
    path: 'auth/login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: "full"
  },
  {
    path: 'auth/register',
    component: RegisterComponent
  },
  {
    path: 'home',
    //component: HomeComponent
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'edit-profile',
    component: EditProfileComponent
  },
  {
    path: 'qr',
    component: QrComponent
  },
  {
    path: 'user-information/:email',
    component: UserInformationComponent
  }
];
