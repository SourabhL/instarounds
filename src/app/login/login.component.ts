import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";
import { first } from "rxjs/operators";
import { NotificationService } from "../notification/notification.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    protected appService: NotificationService
  ) {}

  username: string = "prac3@prac.com";
  password: string = "ganga";
  showSpinner: false;

  ngOnInit() {}

  login(): void {
    const loginDetails = {
      email: this.username,
      password: this.password,
      deviceType: "1",
      deviceToken: "1400BCF7-E3FF-48EE-997A-59F887135D57",
    };
    this.authenticationService.login(loginDetails).then((data: any) => {
      console.log("UserData :", data);

      if (data.status) {
        //localStorage.setItem('deviceToken', data.data.token);
        localStorage.setItem("userData", JSON.stringify(data.data));
        localStorage.setItem("userEmail", this.username);
        localStorage.setItem("medical_group_id", data.data.medical_group_id);
        this.router.navigate(["/home"]);
      } else if (!data.status) {
        this.appService.alert("!Error", "Please enter valid credentials.");
      } else {
        this.appService.alert("!Error", data.message);
      }
    });
  }
}
