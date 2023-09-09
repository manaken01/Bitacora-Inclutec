import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { UserLoginModel } from "./../models/userLogin.model";
import { IAppConfig, APP_CONFIG } from "../../app.config";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable()
export class LoginService {
  isLoggedIn: boolean;
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) public config: IAppConfig
  ) {
    this.isLoggedIn = false;
  }
  login(user): Observable<UserLoginModel> {
    const url = `${this.config.API_ENDPOINT_BITACORA}Users/login`;
    return this.http.post<UserLoginModel>(url, user, httpOptions);
  }

  logout(token) {
    const url = `${this.config.API_ENDPOINT_BITACORA}Users/logout?access_token=${token}`;
    return this.http.post<UserLoginModel>(url, token);
  }
}
