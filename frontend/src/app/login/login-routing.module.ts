import { LoginComponent } from './login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Error404Component } from './error404/error404.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { AuthGuard } from '../auth.guard';

const routes: Routes = [{
  path: '',
  component: LoginComponent
}, {
  path: 'dashboard', 
  canActivate: [AuthGuard], 
  loadChildren: './dashboard/dashboard.module#DashboardModule'
  },
  {
    path: 'register', 
    component: RegisterUserComponent
  },
  {
    path: '**', 
    component: Error404Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
