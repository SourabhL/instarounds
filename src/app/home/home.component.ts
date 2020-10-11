import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { first } from "rxjs/operators";
import { HomeService } from "../services/home.service";

declare var moment: any;

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  plotDetailsmonth: any;
  plotDetailsyear: any;
  plotDetailsdate: any;
  constructor(private router: Router, private homeService: HomeService) {}

  ngOnInit(): void {
    this.getPieDataAnalytics("month");
    this.getPieDataAnalytics("year");
    this.getPieDataAnalytics("date");
  }

  // getPatientCounts() {
  //   this.loginSer.fetchPatientCounts().then((data: any) => {
  //     setTimeout(() => {
  //       this.appService.hideLoader();
  //     }, 1000);
  //     console.log(data.data);
  //     if (data.status) {
  //       this.patientCount = data.data.obCount + data.data.gynCount;
  //       this.messagesCount = data.data.unReadMsgCount;
  //       this.obCount = data.data.obCount;
  //       this.gynCount = data.data.gynCount;
  //       this.getUserInfo();
  //     } else if (!data.status) {
  //       this.goToLoginScreen();
  //     } else {
  //       this.appService.hideLoader();
  //       this.appService.alert('!Error', data.message);
  //     }
  //   });
  // }
  //
  // getUserInfo() {
  //   this.loginSer.fetchUserInfo().then((data: any) => {
  //     console.log(data.data);
  //     if (data.status) {
  //       this.loginSer.userInfo = data.data;
  //       this.loginSer.userName = data.data.mstUsers.firstName;
  //       this.loginSer.userImage = data.data.mstUsers.userImage;
  //       this.getOutPatients();
  //     } else if (!data.status) {
  //       this.goToLoginScreen();
  //     } else {
  //       this.appService.alert('!Error', data.message);
  //     }
  //   });
  // }
  //
  // getOutPatients() {
  //   this.loginSer.fetchOUTPatients().then((data: any) => {
  //     console.log(data.data);
  //     if (data.status) {
  //       this.loginSer.outPatients = data.data.patientDetails;
  //       this.loginSer.outPatients.forEach((item: any) => {
  //         item.avatar = item.mstUsers.firstName.substring(0, 1);
  //         item.color = this.appService.getRandomColor();
  //       });
  //       this.loginSer.tempOutPatients = this.loginSer.outPatients;
  //       console.log(this.loginSer.tempOutPatients);
  //     } else if (!data.status) {
  //       this.goToLoginScreen();
  //     } else {
  //       this.appService.alert('!Error', data.message);
  //     }
  //   });
  // }
  //
  patientsTypeSelection() {
    this.router.navigateByUrl("/ob-patients");
  }

  goToPatients() {
    this.router.navigateByUrl("/ob-patients");
  }

  goToSchedulerPage() {
    this.router.navigateByUrl("/scheduler");
  }

  goToLoginScreen() {
    localStorage.setItem("deviceToken", "");
    localStorage.setItem("userData", "");
    localStorage.setItem("deviceId", "");
    this.router.navigateByUrl("/login");
  }

  goToAnlyticsPage() {
    this.router.navigateByUrl("/anlytics");
  }

  gotoDashboard() {
    this.router.navigateByUrl("/home");
  }

  getPieDataAnalytics(setPeriod) {
    const payload = {
      token: localStorage.getItem("deviceToken"),
      fromDate: "2012/01/06",
      toDate: "2020/07/04",
      byYrMn: setPeriod,
      statType: "avg",
      patientTypeId: "1",
      admissionStatus: "IN",
      hospitalID: "",
      gbs: "",
      procedureTypesId: "",
      inducedReason: "",
      babyInfo: "",
      babyGender: "",
      apgar: "",
      liveBirth: "",
      csecReason: "",
      chartType: "pie",
    };
    this.homeService
      .fetchAnlyticsData(payload)
      .pipe(first())
      .subscribe((data: any) => {
        console.log(data.data);
        // this.appService.hideLoader();
        if (data && data.data.status) {
          this.setPeriodData(data.data, setPeriod);
        } else {
          // this.appService.alert('!Error', data.message);
        }
      });
  }

  setPeriodData(data, period) {
    if (period === "month") {
      this.plotDetailsmonth = data;
    } else if (period === "year") {
      this.plotDetailsyear = data;
    } else {
      this.plotDetailsdate = data;
    }
  }
}
