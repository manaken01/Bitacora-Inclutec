import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-management",
  templateUrl: "./management.component.html",
  styleUrls: ["./management.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ManagementComponent implements OnInit {
  /**
   * Management constructor
   * @param router
   */
  constructor(private router: Router) {}

  ngOnInit() {}

  /**
   * Redirects to the project view
   */
  redirectToProject() {
    return this.router.navigate(["dashboard/management/project"]);
  }
}
