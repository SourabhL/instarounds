import {
  Component,
  OnInit,
  Input,
  ViewChild,
  EventEmitter,
  Output,
} from "@angular/core";
import { HomeService } from "../../services/home.service";
import { NotificationService } from "../../notification/notification.service";
import { NavigationExtras, Router } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { environment } from "../../../environments/environment";
import { DataSource } from "@angular/cdk/table";
import { validate } from "json-schema";

export interface GynPatientsData {
  fullName: string;
  roomNumber: string;
  admissionStatus: string;
  actions: string;
}

@Component({
  selector: "app-gyn-patients",
  styleUrls: ["./gyn-patients.component.scss"],
  templateUrl: "./gyn-patients.component.html",
})
export class GynPatientsComponent implements OnInit {
  @Input() gynPatientsList: [];
  @Output() openDialog = new EventEmitter<any>();

  tempPatientsList = [];
  newGynPatientsList = [];
  displayedColumns: string[] = [
    "fullName",
    "roomNumber",
    "admissionStatus",
    "actions",
  ];
  dataSource: MatTableDataSource<GynPatientsData>;

  constructor(
    private loginSer: HomeService,
    private appService: NotificationService,
    private router: Router
  ) {
    //console.log(this.Message);
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  initializeValues() {
    this.newGynPatientsList = this.gynPatientsList;
    this.newGynPatientsList = this.newGynPatientsList.map((val) => ({
      ...val,
      fullName: `${val.mstUsers.firstName} ${val.mstUsers.lastName}`,
    }));
    this.dataSource = new MatTableDataSource(this.newGynPatientsList);
    this.tempPatientsList = this.gynPatientsList;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit() {
    this.initializeValues();
  }

  ngOnChanges() {
    console.log("Inside on changes");
    this.initializeValues();
  }

  bachAction() {
    this.router.navigate(["/home"]);
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openNewDialog(row) {
    console.log(row);
    this.openDialog.emit({ ...row });
  }
  searchHandler(event): void {
    const val = event.target.value;
    if (val && val.trim() !== "") {
      this.tempPatientsList = this.gynPatientsList.filter((item: any) => {
        return (
          item.mstUsers.firstName.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    } else {
      this.tempPatientsList = this.gynPatientsList;
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
      //  this.appService.hideLoader();
      if (data.status) {
        //this.getPatients();
      } else if (!data.status) {
        this.goToLoginScreen();
      } else {
        //  this.appService.hideLoader();
        this.appService.alert("!Error", data.message);
      }
    });
  }

  DischargePatient(item: any) {
    const userdata = {
      token: localStorage.getItem("deviceToken"),
      patientDetailsId: item.mstUsers.userId,
    };
    // this.appService.showLoader();
    this.loginSer.fetchDischargePatient(userdata).subscribe((data: any) => {
      console.log(data.data);
      // this.appService.hideLoader();
      if (data.status) {
        // this.getPatients();
      } else if (!data.status) {
        this.goToLoginScreen();
      } else {
        // this.appService.hideLoader();
        this.appService.alert("!Error", data.message);
      }
    });
  }

  viewPatientDetails() {}

  goToAddPatient() {
    const navigationExtras: NavigationExtras = {
      state: {
        patientType: "add",
        patientDetails: "",
      },
    };
    this.router.navigate(["addgynpatients"], navigationExtras);
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
