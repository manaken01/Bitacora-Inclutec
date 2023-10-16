import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { FormGroup } from "@angular/forms";
import { PendingModel } from "../models/pending.model";
import { registerUser } from "../models/registerUser.model";
import { IAppConfig, APP_CONFIG } from "../../app.config";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

const headers = new HttpHeaders().set("Content-Type", "application/json");

@Injectable()
export class UserService {
  constructor(
    private http: HttpClient,
    private httpClient: HttpClient,
    @Inject(APP_CONFIG) public config: IAppConfig
  ) {}

  /**
   * Gets all users
   */
  getUsers(): Observable<PendingModel[]> {
    const url = `${this.config.API_ENDPOINT_BITACORA}Users`;
    return this.http.get<PendingModel[]>(url, httpOptions);
  }

  /**
   * Gets the info of a user
   * @param idUser
   */
  getInfoUser(idUser: number): Observable<any> {
    const url = `${this.config.API_ENDPOINT_BITACORA}Users/${idUser}`;
    return this.http.get<any>(url, httpOptions);
  }

  /**
   * Gets the info on the units
   * @param idUnit
   */
  getInfoUnit(idUnit: number): Observable<PendingModel[]> {
    const url = `${this.config.API_ENDPOINT_BITACORA}Units/${idUnit}`;
    return this.http.get<PendingModel[]>(url, httpOptions);
  }

  /**
   * Updates a users data
   * @param userDate
   */
  putUserInfo(userDate): Observable<registerUser[]> {
    const url = `${this.config.API_ENDPOINT_BITACORA}Users/updateUser`;
    return this.http.post<registerUser[]>(url, userDate);
  }

  /**
   * Updates the user password
   * @param oldPassword
   * @param newPassword
   * @param token
   */
  changePassword(oldPassword, newPassword, token) {
    const modelData = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };
    const params = `access_token=${token}`;
    const url = `${this.config.API_ENDPOINT_BITACORA}Users/change-password?${params}`;
    return this.http.post<any>(url, modelData, httpOptions);
  }
 
  /**
   * Gets the projects the users its not working on
   */
  otherProjects(idUser) {
    const params = `idUser=${idUser}`;
    const url = `${this.config.API_ENDPOINT_BITACORA}ProjectsByUsers/userProjectsPending?${params}`;
    return this.http.get<any>(url, httpOptions);
  }

  /**
   * Sends a email request to the bitacora's administrator for permition to work in a project
   * @param idUser
   * @param project
   */
  projectRequest(idUser, project) {
    const params = `idUser=${idUser}&projectName=${project}`;
    const url = `${this.config.API_ENDPOINT_BITACORA}Users/sendRequestProject?${params}`;
    return this.http.get<any>(url, httpOptions);
  }


  /**
   * Sends an email with a temporary password
   * @param email
   */
  newPassword(email: string): Observable<any> {
    const params = `email=${email}`;
    const url = `${this.config.API_ENDPOINT_BITACORA}Users/resetPassword?${params}`;
    return this.http.get<any>(url, httpOptions); 
  }
  

  /**
   * Post a new user
   * @param user
   */
  postRegisterUser(user: registerUser): Observable<registerUser> {
    user.typeUser = "Colaborador";
    user.isActive = 1;
    user.idUnitFk = 2;
    return this.httpClient.post<registerUser>(
      `${this.config.API_ENDPOINT_BITACORA}Users`,
      user
    );
  }

  /**
   * Gets all the disabilities
   */
  getDisabilities(): Observable<any[]> {
    const url = `${this.config.API_ENDPOINT_BITACORA}Disabilities`;
    return this.http.get<any[]>(url, httpOptions);
  }

  /**
   * Validates if the user has any disabilities
   * @param idUser
   */
  validateUserDisabilities(idUser) {
    const filter = {
      where: { idUsersFk: idUser },
    };
    const params = new HttpParams().set("filter", JSON.stringify(filter));
    const url = `${this.config.API_ENDPOINT_BITACORA}DisabilitiesByUsers`;
    const options = { Headers: headers, params: params };
    return this.http.get<any>(url, options);
  }

  /**
   * Post a user and its disability into disabilities by users
   * @param idUser
   * @param idDisability
   */
  postUsersDisability(idUser, idDisability) {
    const body = {
      id: 0,
      idUsersFk: idUser,
      idDisabilitiesFk: idDisability,
    };
    const url = `${this.config.API_ENDPOINT_BITACORA}DisabilitiesByUsers`;
    return this.http.post<any[]>(url, body);
  }

  /**
   * Deletes an users disability
   * @param idUserByDisability
   */
  deleteUserByDisability(idUserByDisability) {
    const url = `${this.config.API_ENDPOINT_BITACORA}DisabilitiesByUsers/${idUserByDisability}`;
    return this.http.delete<any[]>(url);
  }

  /**
   * Verifieds the email of the user
   * @param uid
   * @param token
   */
  getConfirmUser(uid, token) {
    const url = `${this.config.API_ENDPOINT_BITACORA}Users/confirm?uid=${uid}&token=${token}`;
    return this.http.get(url, httpOptions);
  }

  /**
   * Gets all the data from all users
   */
  getAllUsersData() {
    const url = `${this.config.API_ENDPOINT_BITACORA}Users`;
    return this.http.get(url, httpOptions);
  }

  /**
   * Checks if the password are equal
   * @param passwordKey
   * @param passwordConfirmationKey
   */
  checkIfMatchingPasswords(
    passwordKey: string,
    passwordConfirmationKey: string
  ) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({
          notEquivalent: true,
        });
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }
}
