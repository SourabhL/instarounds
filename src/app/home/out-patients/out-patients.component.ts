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
import { AlertDialogComponent } from "../alert-dialog/alert-dialog.component";
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
      if (data.patient_id) {
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

  ngOnInit() {
    this.getPatients();
  }
  goToOutPatient() {
    this.router.navigateByUrl("/out-patients");
  }
  getPatients() {
    this.obPatientsList = [];
    this.tempPatientsList = [];
    this.loading = true;
    this.loginSer
      .fetchPatients(environment.api.getPatientsNew, "out", 1)
      .then((data: any) => {
        console.log(data.status);
        this.loading = false;
        //this.appService.hideLoader();
        if (data.status) {
          console.log("data.data..", data.data);
          this.obPatientsList = data.data
            .filter((val) => val.patient_type_id === 1)
            .map((val) => ({
              ...val,
              fullName: `${val.first_name} ${val.last_name}`,
              edd: (val.edd && moment(val.edd).format("MM/DD/YYYY")) || val.edd,
              discharge_date:
                (val.discharge_date &&
                  moment(val.discharge_date).format("MM/DD/YYYY")) ||
                val.discharge_date,
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

          console.log("obPatientsList..", this.obPatientsList);
          console.log("gynPatientsList..", this.gynPatientsList);
        } else if (!data.status) {
          this.goToLoginScreen();
        } else {
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
        return (
          item.mstUsers.firstName.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    } else {
      this.tempPatientsList = this.obPatientsList;
    }
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
        this.openMessageDialog("Error while Discharging Patient");
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

  goToPatients() {
    this.router.navigateByUrl("/ob-patients");
  }

  goToAddPatient() {
    const navigationExtras: NavigationExtras = {
      state: {
        patientType: "add",
        patientDetails: "",
        patientStatus: "discharged",
      },
    };
    this.router.navigate(["addupdatepatient"], navigationExtras);
  }
  goToAnlyticsPage() {
    this.router.navigateByUrl("/anlytics");
  }
  goToUpdatePatient(item: any) {
    const navigationExtras: NavigationExtras = {
      state: {
        patientType: "update",
        patientDetails: item,
        patientStatus: "discharged",
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
  reAdmitPatient(item: any) {
    console.log("Inside Parent reAdmitPatient");
    console.log(item);

    this.loginSer
      .reAdmitPatientNew({
        admission_status: "IN",
        patient_id: item.patient_id,
      })
      .then((data: any) => {
        //this.appService.hideLoader();
        if (data.status) {
          this.openMessageDialog("Patient Re-admitted Successfully.");
          this.getPatients();
        } else {
          // this.appService.hideLoader();
          //this.appService.alert("!Error", data.message);
          this.openMessageDialog("Error in Patient Re-admit.");
        }
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
