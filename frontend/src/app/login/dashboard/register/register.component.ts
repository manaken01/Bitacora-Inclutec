import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  constructor(private modalService: NgbModal, private router: Router) {}

  ngOnInit() {}

  openLg() {
    this.router.navigate(["dashboard/register/form"]);
  }
}
