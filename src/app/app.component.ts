import { Component } from "@angular/core";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  loggedIn = false;
  title = "insta-rounds-web";
  constructor(
    private router: Router,
    private route: ActivatedRoute // private pickerController: PickerController
  ) {
    console.log("consfsdfsdf");
    if (localStorage.getItem("userEmail")) {
      this.loggedIn = true;
    }
  }

  // ************ Page Navigation ************
  gotoDashboardPage() {
    this.router.navigateByUrl("/home");
  }
  patientsTypeSelection() {
    this.router.navigateByUrl("/ob-patients");
  }
  goToOutPatient() {
    this.router.navigateByUrl("/out-patients");
  }
  goToSchedulerPage() {
    this.router.navigateByUrl("/scheduler");
  }

  goToAddPatient() {
    const navigationExtras: NavigationExtras = {
      state: {
        patientType: "add",
        patientDetails: "",
      },
    };
    this.router.navigateByUrl("/addobpatient", navigationExtras);
  }
  goToAnlyticsPage() {
    this.router.navigateByUrl("/anlytics");
  }
  goToUpdatePatient(item: any) {
    const navigationExtras: NavigationExtras = {
      state: {
        patientType: "update",
        patientDetails: item,
      },
    };
    this.router.navigate(["addobpatient"], navigationExtras);
  }
  goToLoginScreen() {
    localStorage.setItem("deviceToken", "");
    localStorage.setItem("userData", "");
    localStorage.setItem("deviceId", "");
    this.router.navigateByUrl("/login");
  }
}
