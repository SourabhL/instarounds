import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  Input,
} from "@angular/core";
import { isSameDay, isSameMonth, addMinutes } from "date-fns";
import { Subject } from "rxjs";
//import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from "angular-calendar";

import { SchedulerAddPatientComponent } from "./scheduler-add-pat.component";
import { Router } from "@angular/router";
import { HomeService } from "../../services/home.service";
import { NotificationService } from "../../notification/notification.service";
import { MatTableDataSource, MatSort, MatPaginator } from "@angular/material";
import { environment } from "../../../environments/environment";
const colors: any = {
  red: {
    primary: "#ad2121",
    secondary: "#FAE3E3",
  },
  blue: {
    primary: "#1e90ff",
    secondary: "#D1E8FF",
  },
  yellow: {
    primary: "#e3bc08",
    secondary: "#FDF1BA",
  },
};

export interface PatientsData {
  fullName: string;
  patientType: string;
  room_number: string;
  actions: string;
}

declare var moment: any;
@Component({
  selector: "app-scheduler-appointment",
  styleUrls: ["./scheduler-appointment.component.scss"],
  templateUrl: "./scheduler-appointment.component.html",
})
export class SchedulerAppointment {
  displayedColumns: string[] = [
    "fullName",
    "patientType",
    "room_number",
    "actions",
  ];
  dataSource: MatTableDataSource<PatientsData>;
  @Input() event: any;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(
    paginator: MatPaginator
  ) {
    if (!(this.dataSource && this.dataSource.paginator)) {
      this.dataSource.paginator = paginator;
    }
  }

  @ViewChild(MatSort, { static: false }) set matSort(sort: MatSort) {
    if (!(this.dataSource && this.dataSource.sort)) {
      this.dataSource.sort = sort;
    }
  }
  patientsList = [];
  tempPatientsList = [];
  addPat = false;
  date: any;
  selectedDate: any;

  appointmentStartTimes: any;
  appointmentEndTimes: any;
  selectedRowIndex = -1;

  patientDetails = {
    fullName: "",
    patientType: "",
    roomNumber: "",
  };
  constructor(
    private router: Router,
    private loginSer: HomeService,
    private appService: NotificationService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
    console.log("User....", this.event);

    this.appointmentStartTimes = moment(this.event.date).format(
      "YYYY-MM-DDThh:mm"
    );

    this.appointmentEndTimes = moment(
      addMinutes(new Date(this.appointmentStartTimes), 30)
    ).format("YYYY-MM-DDThh:mm");

    console.log("this.appointmentEndTimes", this.appointmentEndTimes);
  }

  ionViewDidEnter() {
    //this.getSchedulerData();
  }
  ngAfterViewInit() {
    this.getPatients();
    // If the user changes the sort order, reset back to the first page.
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getRecord(row) {
    console.log("Selected row...", row);
    this.selectedRowIndex = row.fullName;

    this.patientDetails.fullName = row.fullName;
    this.patientDetails.patientType = row.patientType;
    this.patientDetails.roomNumber = row.room_number;
  }

  async getPatients() {
    console.log("Into get patients");

    this.patientsList = [];
    this.tempPatientsList = [];
    // this.appService.showLoader();
    this.loginSer
      .fetchPatients(environment.api.getPatientsNew, "census", 1)
      .then((data: any) => {
        console.log(data.status);
        //this.appService.hideLoader();
        if (data.status) {
          console.log("data.data..", data.data);
          this.patientsList = data.data.map((val) => ({
            ...val,
            fullName: `${val.first_name} ${val.last_name}`,
            patientType: val.patient_type_id == 1 ? "OB" : "GYN",
            edd: (val.edd && moment(val.edd).format("MM/DD/YYYY")) || val.edd,
          }));
          this.tempPatientsList = this.patientsList.map((val) => ({
            ...val,
            fullName: val.fullName,
            patientType: val.patientType,
            room_number: val.room_number,
          }));
          this.dataSource = new MatTableDataSource(this.tempPatientsList);
          console.log(this.dataSource);
          // this.dataSource.paginator = this.paginator;
          //this.dataSource.sort = this.sort;
          if (!this.dataSource.paginator) {
            this.dataSource.paginator = this.matPaginator;
          }
          if (!this.dataSource.sort) {
            this.dataSource.sort = this.matSort;
          }
          // if (this.dataSource.paginator) {
          //   this.dataSource.paginator.firstPage();
          // }
        } else if (!data.status) {
          this.goToLoginScreen();
        } else {
          //this.appService.alert("!Error", data.message);
          //this.openMessageDialog("Error in Fetching Patients");
        }
      });
  }

  // ****** Navigation ************

  gotoDashboardPage() {
    this.router.navigateByUrl("/home");
  }

  goToPatients() {
    this.router.navigateByUrl("/ob-patients");
  }
  goToSchedulerPage() {
    this.router.navigateByUrl("/scheduler");
  }

  goToAnlyticsPage() {
    this.router.navigateByUrl("/anlytics");
  }

  goToLoginScreen() {
    localStorage.setItem("deviceToken", "");
    localStorage.setItem("userData", "");
    localStorage.setItem("deviceId", "");
    this.router.navigateByUrl("/login");
  }

  goToAddPatient() {
    //this.addPat = true;
    //close();
    //this.modalService.open(this.modalAdd, { size: "lg" });
    this.modalService.open(SchedulerAddPatientComponent, {
      size: "lg",
    });
  }
  goToUpdatePatient(row) {
    console.log("goToUpdatePatient row...", row);

    const modalRef = this.modalService.open(SchedulerAddPatientComponent, {
      size: "lg",
      backdrop: "static",
    });

    modalRef.componentInstance.patient = row;

    modalRef.result.then(
      (data) => {
        console.log("On Close...");
      },
      (reason) => {
        console.log("On Dismiss...");
        this.getPatients();
      }
    );
  }
}

// @Component({
//   template: `
//     <div class="modal-header">
//       <h4 class="modal-title">Hi there!</h4>
//       <button
//         type="button"
//         class="close"
//         aria-label="Close"
//         (click)="activeModal.dismiss('Cross click')"
//       >
//         <span aria-hidden="true">&times;</span>
//       </button>
//     </div>
//     <div class="modal-body">
//       <p>Hello, World!</p>
//       <p>
//         <button class="btn btn-lg btn-outline-primary" (click)="open()">
//           Launch demo modal
//         </button>
//       </p>
//     </div>
//     <div class="modal-footer">
//       <button
//         type="button"
//         class="btn btn-outline-dark"
//         (click)="activeModal.close('Close click')"
//       >
//         Close
//       </button>
//     </div>
//   `,
// })
// export class NgbdModal1Content {
//   constructor(
//     private modalService: NgbModal,
//     public activeModal: NgbActiveModal
//   ) {}

//   open() {
//     this.modalService.open(SchedulerAddPatientComponent, {
//       size: "lg",
//     });
//   }
// }
