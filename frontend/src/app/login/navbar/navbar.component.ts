import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { APP_CONFIG, IAppConfig } from "../../../app.config";
import { EncryptService } from "../../services/encrypt.service";
import { LoginService } from "../../services/login.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
  providers: [EncryptService, LoginService],
})
export class NavbarComponent implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public navbarOpen = false;
  public navbarElements: any;
  public name: any;
  public lastname: any;
  constructor(
    @Inject(APP_CONFIG) public config: IAppConfig,
    private encryptService: EncryptService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit() {
    this.name = this.encryptService.desencrypt("name");
    this.lastname = this.encryptService.desencrypt("lastname").split(" ");
    this.navbarElements = this.config.NAVBAR_IETMS;
    this.handleRoleNav(this.navbarElements);
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * Toggles navBar
   */
  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  /**
   * Log out's user getting the accessToken the user created when he log in
   */
  logout() {
    const accessToken = this.encryptService.desencrypt("accessToken");
    const managementPath = {
      text: "Gestión",
      path: "management",
    };
    if (this.navbarElements.length <= 3) {
      this.config.NAVBAR_IETMS.splice(3, 0, managementPath);
    }
    this.navbarElements = this.config.NAVBAR_IETMS;
    this.loginService
      .logout(accessToken)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (response) => {
          return this.router.navigate(["login"]);
        },
        (error) => {
          return this.router.navigate(["login"]);
        }
      );
  }

  /**
   * If the users role its not administrator the management option y delete from the items o
   * f the navbar
   * @param navELement
   */
  handleRoleNav(navELement) {
    const userRole = this.encryptService.desencrypt("role");
    if (userRole != "Administrador") {
      navELement.splice(3, 1);
    }
  }
}
