import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
} from "@angular/core";
import { HomeService } from "../../services/home.service";
import { NotificationService } from "../../notification/notification.service";
import { NavigationExtras, Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogConfig,
} from "@angular/material/dialog";

declare var moment: any;
export interface OutPatientsData {
  fullName: string;
  roomNumber: string;
  gsPs: string;
  edd: string;
  admissionStatus: string;
  actions: string;
}

@Component({
  selector: "app-out-patients",
  styleUrls: ["./out-patients.component.scss"],
  templateUrl: "./out-patients.component.html",
})
export class OutPatientsComponent implements OnInit {
  displayedColumns: string[] = [
    "fullName",
    "roomNumber",
    "gsPs",
    "edd",
    "admissionStatus",
    "actions",
  ];
  dataSource: MatTableDataSource<OutPatientsData>;

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
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      ...patientRow,
    };

    console.log(patientRow);
    const dialogRef = this.dialog.open(DialogContentOutDialog, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      console.log("Dialog output:", data);
      if (data.id) {
        this.reAdmitPatient(data);
      }
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
  goToOutPatient() {
    this.router.navigateByUrl("/out-patients");
  }
  getPatients() {
    this.obPatientsList = [];
    this.tempPatientsList = [];

    // this.appService.showLoader();
    this.loginSer
      .fetchOutPatients(environment.api.getOutPatients)
      .subscribe((data: any) => {
        console.log(data);
        // this.appService.hideLoader();
        if (data._statusCode === "200") {
          console.log("data.data.patientsList...", data.data);
          this.obPatientsList = data.data.patientDetails
            .filter((val) => val.patientTypes.type == "OB")
            .map((val) => ({
              ...val,
              fullName: `${val.mstUsers.firstName} ${val.mstUsers.lastName}`,
              edd: (val.edd && moment(val.edd).format("MM/DD/YYYY")) || val.edd,
              dischargeDate:
                (val.dischargeDate &&
                  moment(val.dischargeDate).format("MM/DD/YYYY")) ||
                val.edd,
            }));

          this.gynPatientsList = data.data.patientDetails
            .filter((val) => val.patientTypes.type == "GYN")
            .map((val) => ({
              ...val,
              fullName: `${val.mstUsers.firstName} ${val.mstUsers.lastName}`,
            }));
          console.log("this.obPatientsList...", this.obPatientsList);
          // this.obPatientsList = data.data.patientDetails;
          // this.gynPatientsList = data.data.gynPatientsList;
          // this.obPatientsList = data.data.obPatientsList.map((val) => ({
          //   ...val,
          //   fullName: `${val.mstUsers.firstName} ${val.mstUsers.lastName}`,
          // }));
          this.dataSource = new MatTableDataSource(this.obPatientsList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.obPatientsList.forEach((item: any) => {
            item.avatar = item.mstUsers.firstName.substring(0, 1);
            item.color = this.appService.getRandomColor();
          });
          this.tempPatientsList = this.obPatientsList;
        } else if (!data.status) {
          console.log("go to login screen");
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

  DischargePatient(item: any) {
    const userdata = {
      token: localStorage.getItem("deviceToken"),
      patientDetailsId: item.mstUsers.userId,
    };
    //this.appService.showLoader();
    this.loginSer.fetchDischargePatient(userdata).subscribe((data: any) => {
      console.log(data.data);
      // this.appService.hideLoader();
      if (data.status) {
        this.getPatients();
      } else if (!data.status) {
        this.goToLoginScreen();
      } else {
        //  this.appService.hideLoader();
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
  reAdmitPatient(item: any) {
    console.log("Inside Parent reAdmitPatient");
    console.log(item);
    const userdata = {
      token: localStorage.getItem("deviceToken"),
      patientDetailsId: item.id,
    };
    // this.appService.showLoader();
    this.loginSer.fetchReAdmitPatient(userdata).subscribe((data: any) => {
      console.log(data.data);
      this.getPatients();
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
@Component({
  selector: "dialog-content-out-dialog",
  templateUrl: "dialog-content-out-dialog.html",
})
export class DialogContentOutDialog {
  constructor(
    private dialogRef: MatDialogRef<DialogContentOutDialog>,
    @Inject(MAT_DIALOG_DATA) public data: OutPatientsData
  ) {}

  confirmReAdmit(item) {
    console.log(item);
    this.dialogRef.close(item);
  }
  closeReAdmitDialog() {
    this.dialogRef.close();
  }
}
