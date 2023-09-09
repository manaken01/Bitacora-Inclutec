import { Injectable } from '@angular/core';
import { EncryptService } from './encrypt.service';

@Injectable()
export class UserService {

  private isUserLoggedIn: any;

  constructor(private encrypt: EncryptService) {
    this.isUserLoggedIn = true;

  }
  setUserLoggedIn() {
    localStorage.setItem('loggedIn', this.isUserLoggedIn);
  }

  getUserLoggedIn() {
    return localStorage.getItem('loggedIn');
  }
}
