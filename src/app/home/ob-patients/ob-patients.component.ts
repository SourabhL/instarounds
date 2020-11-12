import { Component, Inject, OnInit, ViewChild } from "@angular/core";
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
import { AlertDialogComponent } from "../alert-dialog/alert-dialog.component";

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
  loading = false;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  // *** Open Dialog to Discharge Patient ***
  openDialog(patientRow) {
    console.log(patientRow);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      ...patientRow,
    };
    console.log(patientRow);
    const dialogRef = this.dialog.open(
      DialogContentExampleDialog,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((data) => {
      if (data && data.patient_id) {
        this.DischargePatient(data);
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

  openMessageDialog(message) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        message: message,
        buttonText: {
          cancel: "Ok",
        },
      },
    });
  }

  getPatients() {
    console.log("Into get patients");
    this.loading = true;
    this.obPatientsList = [];
    this.tempPatientsList = [];
    // this.appService.showLoader();
    this.loginSer
      .fetchPatients(environment.api.getPatientsNew, "census", 1)
      .then((data: any) => {
        console.log(data.status);
        //this.appService.hideLoader();
        if (data.status) {
          console.log("data.data..", data.data);
          this.obPatientsList = data.data
            .filter((val) => val.patient_type_id === 1)
            .map((val) => ({
              ...val,
              fullName: `${val.first_name} ${val.last_name}`,
              edd: (val.edd && moment(val.edd).format("MM/DD/YYYY")) || val.edd,
            }));
          this.gynPatientsList = data.data
            .filter((val) => val.patient_type_id === 2)
            .map((val) => ({
              ...val,
              fullName: `${val.first_name} ${val.last_name}`,
            }));

          this.dataSource = new MatTableDataSource(this.obPatientsList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.loading = false;
          console.log("obPatientsList..", this.obPatientsList);
          console.log("gynPatientsList..", this.gynPatientsList);
        } else if (!data.status) {
          this.goToLoginScreen();
        } else {
          //this.appService.alert("!Error", data.message);
          this.openMessageDialog("Error in Fetching Patients");
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
        return item.first_name.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    } else {
      this.tempPatientsList = this.obPatientsList;
    }
  }

  viewPatientDetails() {}

  gotoDashboardPage() {
    this.router.navigateByUrl("/home");
  }

  patientsTypeSelection() {
    this.router.navigateByUrl("/ob-patients");
  }
  goToPatients() {
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
        patientStatus: "census",
      },
    };
    this.router.navigateByUrl("/addupdatepatient", navigationExtras);
  }
  goToAnlyticsPage() {
    this.router.navigateByUrl("/anlytics");
  }

  goToUpdatePatient(item: any) {
    console.log(item);
    const navigationExtras: NavigationExtras = {
      state: {
        patientType: "update",
        patientDetails: item,
        patientStatus: "census",
      },
    };
    this.router.navigate(["addupdatepatient"], navigationExtras);
  }

  goToLoginScreen() {
    localStorage.setItem("deviceToken", "");
    localStorage.setItem("userData", "");
    localStorage.setItem("deviceId", "");
    this.router.navigateByUrl("/login");
  }

  DischargePatient(item: any) {
    console.log(item);
    try {
      this.loginSer
        .dischargePatientNew(environment.api.dischargePatientNew, {
          admission_status: "OUT",
          patient_id: item.patient_id,
        })
        .then((data: any) => {
          // this.appService.hideLoader();
          if (data.status) {
            this.getPatients();
            // this.appService.alert(
            //   "Success",
            //   "Patient Discharged Successfully."
            // );
            this.openMessageDialog("Patient Discharged Successfully.");
          } else if (!data.status) {
            this.goToLoginScreen();
          } else {
            //this.appService.hideLoader();
            this.appService.alert("!Error", data.message);
            this.openMessageDialog(data.message);
          }
        });
    } catch (error) {
      console.log(error);
    }
  }
}
@Component({
  selector: "dialog-content-example-dialog",
  templateUrl: "dialog-content-example-dialog.html",
})
export class DialogContentExampleDialog {
  constructor(
    private dialogRef: MatDialogRef<DialogContentExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ObPatientsData
  ) {}

  confirmDischarge(item) {
    console.log(item);
    this.dialogRef.close(item);
  }
  closeDischargeDialog() {
    this.dialogRef.close();
  }
}
