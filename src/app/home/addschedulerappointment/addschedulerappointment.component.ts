import { Component } from "@angular/core";
import { NotificationService } from "../../notification/notification.service";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { HomeService } from "../../services/home.service";
import { environment } from "../../../environments/environment";

declare var moment: any;

@Component({
  selector: "app-add-scheduler-appointment",
  styleUrls: ["./addschedulerappointment.component.scss"],
  templateUrl: "./addschedulerappointment.component.html",
})
export class AddschedulerappointmentComponent {
  appointmentType: any;
  pageTitle = "Appointment";
  minDate: any;
  isEditing = true;
  patientName = "";
  appointmentData = {
    token: localStorage.getItem("deviceToken"),
    startTime: "",
    endTime: "",
    appDate: "",
    comments: "",
    surgeon: "",
    patientId: "",
    apptId: "",
  };
  addorupadte: any;
  details: any;
  patientsList = [];
  selectedUser: any;
  infoList = [];
  constructor(
    private appService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    // public modalController: ModalController,
    private homeService: HomeService
  ) {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.appointmentType = this.router.getCurrentNavigation().extras.state.appointmentType;
        this.addorupadte = this.router.getCurrentNavigation().extras.state.addorupadte;
        if (this.appointmentType === "obpatient") {
          this.pageTitle = "OB Appointment";
        } else if (this.appointmentType === "gynpatient") {
          this.pageTitle = "GYN Appointment";
        }
        if (this.addorupadte === "update") {
          this.details = this.router.getCurrentNavigation().extras.state.details;
          this.updateDetails();
        }
      }
    });
    this.minDate = moment(Date.now()).format("YYYY-MM-DD");
    console.log(this.minDate);
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.getPatientList();
  }

  updateDetails() {
    this.appointmentData.appDate = moment(this.details.appDate).format(
      "YYYY-MM-DD hh:mm a"
    );
    this.appointmentData.endTime = moment(this.details.endTime).format(
      "YYYY-MM-DD hh:mm a"
    );
    this.appointmentData.startTime = moment(this.details.startTime).format(
      "YYYY-MM-DD hh:mm a"
    );
    this.patientName =
      this.details.mstUsersByUserPatientTypeId.firstName +
      " " +
      this.details.mstUsersByUserPatientTypeId.lastName;
    this.appointmentData.surgeon = this.details.performingSurgeon;
    this.appointmentData.patientId = this.details.mstUsersByUserPatientTypeId.userId;
    this.appointmentData.apptId = this.details.id;

    if (this.details.daysList.length > 0) {
      this.details.daysList.forEach((info) => {
        const data = {
          expanded: false,
          arrowicon: "arrow-dropright-circle",
          date: info,
        };
        this.infoList.push(data);
      });
    }
  }

  updateStartDate(event: any) {
    const date = moment(event.target.value).format("YYYY-MM-DD hh:mm a");
    this.appointmentData.endTime = moment(date)
      .add(1, "hours")
      .format("YYYY-MM-DD hh:mm a");
  }

  updateEndDate(event: any) {
    const date = moment(event.target.value).format("YYYY-MM-DD hh:mm a");
    this.appointmentData.startTime = moment(date)
      .subtract(1, "hours")
      .format("YYYY-MM-DD hh:mm a");
  }
  searchPatient() {
    this.appService.warning(
      "",
      "You can search for an existing patient by typing their name in the text field."
    );
  }
  addPatient() {
    if (this.appointmentType === "obpatient") {
      const navigationExtras: NavigationExtras = {
        state: {
          patientType: "schedule",
          patientDetails: "",
        },
      };
      this.router.navigate(["addobpatient"], navigationExtras);
    } else if (this.appointmentType === "gynpatient") {
      const navigationExtras: NavigationExtras = {
        state: {
          patientType: "schedule",
          patientDetails: "",
        },
      };
      this.router.navigate(["addgynpatients"], navigationExtras);
    }
  }

  async getPatient() {
    if (this.addorupadte !== "update") {
      //   const modal = await this.modalController.create({
      //     component: UserslistPage,
      //     componentProps: {
      //       patientType: this.appointmentType,
      //       usersData: this.patientsList,
      //       patientName: this.patientName
      //     }
      //   });
      //   modal.onDidDismiss()
      //     .then((data: any) => {
      //       this.patientName = data.data.userName;
      //       this.selectedUser = data.data.userData;
      //     });
      //   return await modal.present();
    }
  }

  saveAppointment() {
    if (this.patientName.length === 0) {
      this.appService.warning("!Warning", "Please Enter PatientName.");
    } else if (!this.checkUser(this.patientName)) {
      this.appService.warning("!Warning", "Patient not Registered.");
    } else if (this.appointmentData.startTime.length === 0) {
      this.appService.warning("!Warning", "Please Enter StartTime.");
    } else if (this.appointmentData.endTime.length === 0) {
      this.appService.warning("!Warning", "Please Enter Endtime.");
    } else if (this.appointmentData.surgeon.length === 0) {
      this.appService.warning("!Warning", "Please Enter SurgenName.");
    } else {
      this.submitAppointment();
    }
  }

  submitAppointment() {
    this.appointmentData.startTime = moment(
      this.appointmentData.startTime
    ).format("MM-DD-YYYY HH:MM");
    this.appointmentData.endTime = moment(this.appointmentData.endTime).format(
      "MM-DD-YYYY HH:MM"
    );
    this.appointmentData.appDate = moment(
      this.appointmentData.startTime
    ).format("MM-DD-YYYY HH:MM");
    let url: any;
    if (this.addorupadte === "update") {
      url = "apt/patientApptUpdate";
    } else {
      url = "apt/patientAppointment";
      this.appointmentData.patientId = this.selectedUser.mstUsers.userId;
    }
    // this.appService.showLoader();
    this.homeService
      .submitPatientDetails("patient/addPatient", this.appointmentData)
      .subscribe((data) => {
        console.log(data);
        // this.appService.hideLoader();
        if (data) {
          if (this.addorupadte === "update") {
            this.appService.success(
              "Success",
              "Appointment Update Successfully."
            );
          } else {
            this.appService.success("Success", "Appointment Add Successfully.");
          }
          this.router.navigateByUrl("scheduler");
        } else if (!data) {
          this.goToLoginScreen();
        } else {
          // this.appService.hideLoader();
          this.appService.error("!Error", "");
        }
      });
  }

  getPatientList() {
    this.patientsList = [];
    // this.appService.showLoader();
    let url: any;
    if (this.appointmentType === "obpatient") {
      url = "patient/obpatients?";
    } else {
      url = environment.api.gynPatients;
    }

    // this.homeService.fetchPatients(url, true).subscribe((data) => {
    //   console.log(data.data);
    //   // this.appService.hideLoader();
    //   if (data.status) {
    //     this.patientsList = data.data.patientDetails;
    //   } else if (!data.status) {
    //     this.goToLoginScreen();
    //   } else {
    //    //  this.appService.hideLoader();
    //     this.appService.error('!Error', data.message);
    //   }
    // });
  }

  checkUser(username: string) {
    let isRegister = false;
    this.patientsList.forEach((item: any) => {
      const name = item.mstUsers.firstName + item.mstUsers.lastName;
      if (name.toLowerCase() === username.replace(/\s/g, "").toLowerCase()) {
        isRegister = true;
      }
    });
    return isRegister;
  }

  expandItem(item): void {
    if (item.expanded) {
      item.expanded = false;
      item.arrowicon = "arrow-dropright-circle";
    } else {
      item.expanded = true;
      item.arrowicon = "arrow-dropdown-circle";
    }
  }

  goToLoginScreen() {
    localStorage.setItem("deviceToken", "");
    localStorage.setItem("userData", "");
    localStorage.setItem("deviceId", "");
    this.router.navigateByUrl("/login");
  }
}
