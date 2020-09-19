import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { HomeService } from "../../services/home.service";
import { NotificationService } from "../../notification/notification.service";
import { NavigationExtras, Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";

export interface ObPatientsData {
  fullName: string;
  roomNumber: string;
  gsPs: string;
  edd: string;
  admissionStatus: string;
  actions: string;
}
declare var moment: any;
@Component({
  selector: "app-ob-patients",
  styleUrls: ["./ob-patients.component.scss"],
  templateUrl: "./ob-patients.component.html",
})
export class ObPatientsComponent implements OnInit {
  displayedColumns: string[] = [
    "fullName",
    "roomNumber",
    "gsPs",
    "edd",
    "admissionStatus",
    "actions",
  ];
  dataSource: MatTableDataSource<ObPatientsData>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  openDialog(patientRow) {
    console.log(patientRow);
    this.dialog.open(DialogContentExampleDialog, {
      data: {
        ...patientRow,
      },
    });
  }
  obPatientsList = [];
  gynPatientsList = [];
  tempPatientsList = [];
  constructor(
    private loginSer: HomeService,
    private appService: NotificationService,
    private router: Router,
    public dialog: MatDialog
  ) {
    // // Assign the data to the data source for the table to render
    // this.dataSource = new MatTableDataSource(this.patientsList);
  }

  ngOnInit() {
    this.getPatients();
  }

  getPatients() {
    this.obPatientsList = [];
    this.tempPatientsList = [];
    // this.appService.showLoader();
    this.loginSer
      .fetchPatients(environment.api.showPatients, "census")
      .subscribe((data: any) => {
        // this.appService.hideLoader();
        if (data._statusCode === "200") {
          this.obPatientsList = data.data.obPatientsList;
          this.gynPatientsList = data.data.gynPatientsList;
          this.obPatientsList = data.data.obPatientsList.map((val) => ({
            ...val,
            fullName: `${val.mstUsers.firstName} ${val.mstUsers.lastName}`,
            edd: (val.edd && moment(val.edd).format("YYYY-MM-DD")) || val.edd,
          }));
          this.dataSource = new MatTableDataSource(this.obPatientsList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          this.obPatientsList.forEach((item: any) => {
            item.avatar = item.mstUsers.firstName.substring(0, 1);
            item.color = this.appService.getRandomColor();
          });
          this.tempPatientsList = this.obPatientsList;
        } else if (!data.status) {
          this.goToLoginScreen();
        } else {
          this.appService.error("!Error", data.message);
        }
      });
  }

  bachAction() {
    this.router.navigate(["/home"]);
  }

  searchHandler(event): void {
    const val = event.target.value;
    if (val && val.trim() !== "") {
      this.tempPatientsList = this.obPatientsList.filter((item: any) => {
        return (
          item.mstUsers.firstName.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    } else {
      this.tempPatientsList = this.obPatientsList;
    }
  }

  unAdmitPatient(item: any) {
    const userdata = {
      token: localStorage.getItem("deviceToken"),
      patientDetailsId: item.mstUsers.userId,
    };
    // this.appService.showLoader();
    this.loginSer.fetchUnAdimtPatient(userdata).subscribe((data: any) => {
      console.log(data.data);
      //this.appService.hideLoader();
      if (data.status) {
        this.getPatients();
      } else if (!data.status) {
        this.goToLoginScreen();
      } else {
        // this.appService.hideLoader();
        this.appService.alert("!Error", data.message);
      }
    });
  }

  viewPatientDetails() {}

  gotoDashboardPage() {
    this.router.navigateByUrl("/home");
  }

  patientsTypeSelection() {
    this.router.navigateByUrl("/ob-patients");
  }
  goToOutPatient() {
    this.router.navigateByUrl("/out-patients");
  }
  goToAddPatient() {
    const navigationExtras: NavigationExtras = {
      state: {
        patientType: "add",
        patientDetails: "",
      },
    };
    this.router.navigate(["addobpatient"], navigationExtras);
  }

  goToUpdatePatient(item: any) {
    console.log(item);
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
@Component({
  selector: "dialog-content-example-dialog",
  templateUrl: "dialog-content-example-dialog.html",
})
export class DialogContentExampleDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ObPatientsData,
    private loginSer: HomeService,
    private appService: NotificationService
  ) {}
  DischargePatient(item: any) {
    console.log(item);
    const userdata = {
      token: localStorage.getItem("deviceToken"),
      patientDetailsId: item.mstUsers.userId,
    };
    // this.appService.showLoader();
    this.loginSer.fetchDischargePatient(userdata).subscribe((data: any) => {
      console.log(data.data);
      // this.appService.hideLoader();
      // if (data.status) {
      //   this.getPatients();
      // } else if (!data.status) {
      //   this.goToLoginScreen();
      // } else {
      //   //  this.appService.hideLoader();
      //   this.appService.alert("!Error", data.message);
      // }
    });
  }
}
