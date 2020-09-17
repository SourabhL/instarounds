import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { HomeService } from "../../services/home.service";
import { NotificationService } from "../../notification/notification.service";
import { NavigationExtras, Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

export interface UserData {
  id: string;
  progress: string;
  name: string;
  color: string;
  admission: string;
  action: string;
}

/** Constants used to fill up our data base. */
const COLORS: string[] = [
  "maroon",
  "red",
  "orange",
  "yellow",
  "olive",
  "green",
  "purple",
  "fuchsia",
  "lime",
  "teal",
  "aqua",
  "blue",
  "navy",
  "black",
  "gray",
];
const NAMES: string[] = [
  "Maia",
  "Asher",
  "Olivia",
  "Atticus",
  "Amelia",
  "Jack",
  "Charlotte",
  "Theodore",
  "Isla",
  "Oliver",
  "Isabella",
  "Jasper",
  "Cora",
  "Levi",
  "Violet",
  "Arthur",
  "Mia",
  "Thomas",
  "Elizabeth",
];

@Component({
  selector: "app-ob-patients",
  styleUrls: ["./ob-patients.component.scss"],
  templateUrl: "./ob-patients.component.html",
})
export class ObPatientsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    "id",
    "progress",
    "name",
    "color",
    "admission",
    "action",
  ];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    this.dialog.open(DialogContentExampleDialog, dialogConfig);
  }
  patientsList = [];
  tempPatientsList = [];
  constructor(
    private loginSer: HomeService,
    private appService: NotificationService,
    private router: Router,
    public dialog: MatDialog
  ) {
    // Create 100 users
    const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
  }

  ngOnInit() {
    this.getPatients();
  }

  getPatients() {
    this.patientsList = [];
    this.tempPatientsList = [];
    // this.appService.showLoader();
    this.loginSer
      .fetchPatients(environment.api.obPatients, false)
      .subscribe((data: any) => {
        console.log(data.data);
        // this.appService.hideLoader();
        if (data._statusCode === "200") {
          this.patientsList = data.data.patientDetails;
          console.log(this.patientsList);
          this.patientsList.forEach((item: any) => {
            item.avatar = item.mstUsers.firstName.substring(0, 1);
            item.color = this.appService.getRandomColor();
          });
          this.tempPatientsList = this.patientsList;
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
      this.tempPatientsList = this.patientsList.filter((item: any) => {
        return (
          item.mstUsers.firstName.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    } else {
      this.tempPatientsList = this.patientsList;
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
}

/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
    " " +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
    ".";

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    color: COLORS[Math.round(Math.random() * (COLORS.length - 1))],
    admission: "IN",
    action: "view/edit",
  };
}
@Component({
  selector: "dialog-content-example-dialog",
  templateUrl: "dialog-content-example-dialog.html",
})
export class DialogContentExampleDialog {}
