import { Component, OnInit, Injectable } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { HomeService } from "../../services/home.service";
import { first, map, tap } from "rxjs/operators";
import { pipe } from "rxjs";
import { AnalyticDataModel } from "../../model/analytic-data";
import { CsvDataService } from "./csv-data.service";

declare var moment: any;

@Component({
  selector: "app-anlytiks",
  templateUrl: "./anlytiks.component.html",
  styleUrls: ["./anlytiks.component.scss"],
})
@Injectable()
export class AnlytiksComponent<D> implements OnInit {
  customAlertOptions: any = {
    header: "Choose One",
    translucent: true,
  };
  graphType: string;
  patientTypeList = ["OB", "GYN"];
  patientStatusList = ["IN", "OUT"];
  babyAPGARLes = "<7";
  babyAPGARGa = ">7";
  EBLLes = "<100 cc";
  EBLGa = ">700 cc";
  minDate: any;
  fromDate: any;
  toDate: any;
  procedureType = "";
  analyticData = {
    patientTypeId: "OB",
    admissionStatus: "IN",
    url: "",
    fromDate: "",
    toDate: "",
    patientType: "",
    byYrMn: "month",
    hospitalID: "",
    gbs: "",
    procedureTypesId: "",
    babyInfo: "",
    babyGender: "",
    apgar: "",
    liveBirth: "",
    inducedReason: "",
    fcm: "",
    ebl: "",
    postop: "",
    statType: "avg",
    csecReason: "",
    procedureGYNTypesId: "",
  };
  hospitalList = [];
  obProcedureList = [];
  gynProcedureList = [];
  inReason = [];
  csectionReasonList = [];
  selectedInduse = [];
  selectedProcedure = [];
  plotDetails: any;

  constructor(private router: Router, private homeService: HomeService) {
    this.minDate = moment(Date.now()).format("YYYY-MM-DD");
    this.analyticData.toDate = moment(Date.now()).format("YYYY-MM-DD");
    const date = moment(Date.now()).subtract(180, "days");
    this.analyticData.fromDate = moment(date).format("YYYY-MM-DD");
  }

  ngOnInit(): void {
    this.graphType = "pie";
    this.getHospitals();
  }

  getHospitals() {
    // this.appService.showLoader();
    this.homeService.fetchHospitals().subscribe((data) => {
      if (data && data._statusCode === "200") {
        this.hospitalList = data.data.hospitalList;
        this.getProcedures();
      } else if (!data) {
        // this.appService.hideLoader();
        this.goToLoginScreen();
      } else {
        //  this.appService.hideLoader();
        // this.appService.alert('!Error', data.message);
      }
    });
  }

  changeGraphType() {
    this.getProcedures();
  }

  getProcedures() {
    this.homeService.fetchProcedures(1).subscribe((data: any) => {
      // this.homeService.fetchProcedures(1).pipe(map((data: any) => {
      console.log(data.data);
      if (data && data._statusCode === "200") {
        this.obProcedureList = data.data.procedureList.map((item) => {
          return {
            name: item.procedureName,
            colorCode: item.colorCode,
            description: item.description,
            id: item.id,
            procedureName: item.procedureName,
            updatedDate: item.updatedDate,
          };
        });

        this.inReason = data.data.inReason;
        this.csectionReasonList = data.data.csectionReasonList;
        this.getGYNProcedures();
        this.submitData();
      } else if (!data) {
        //  this.appService.hideLoader();
        this.goToLoginScreen();
      } else {
        // this.appService.hideLoader();
        // this.appService.alert('!Error', data.message);
      }
    });
  }

  getGYNProcedures() {
    this.homeService.fetchProcedures(2).subscribe((data: any) => {
      console.log(data.data);
      // this.appService.hideLoader();
      if (data && data._statusCode === "200") {
        this.gynProcedureList = data.data.procedureList;
      } else if (!data) {
        // this.appService.hideLoader();
        this.goToLoginScreen();
      } else {
        // this.appService.hideLoader();
        // this.appService.alert('!Error', data.message);
      }
    });
  }

  onAnlyticsChange(event: any) {
    this.analyticData.patientTypeId = event;
  }

  onPatientStatusChange(event: any) {
    this.analyticData.admissionStatus = event;
  }

  updateFromDate(event: any) {
    this.analyticData.fromDate = moment(event.target.value).format(
      "YYYY-MM-DD"
    );
  }

  updateToDate(event: any) {
    this.analyticData.toDate = moment(event.target.value).format("YYYY-MM-DD");
  }

  onbyChange(event: any) {
    this.analyticData.byYrMn = event;
  }

  onStatisticalChange(event: any) {
    this.analyticData.statType = event;
  }

  onhospitalChange(event: any) {
    this.analyticData.hospitalID = event;
  }

  onGBSChange(event: any) {
    this.analyticData.gbs = event;
  }

  onProcedureChange(event: any) {
    this.analyticData.procedureTypesId = event;
    this.obProcedureList.forEach((proce) => {
      if (proce.id === Number(event)) {
        this.procedureType = proce.procedureName;
      }
    });
  }

  onGYNProcedureChange(event: any) {
    this.selectedProcedure = event;
    this.selectedProcedure.forEach((proce, index) => {
      if (index === 0) {
        this.analyticData.procedureGYNTypesId = proce;
      } else {
        this.analyticData.procedureGYNTypesId =
          this.analyticData.procedureGYNTypesId + "," + proce;
      }
    });
    if (this.selectedProcedure.length === 0) {
      this.analyticData.procedureGYNTypesId = "";
    }
    console.log(this.analyticData.procedureGYNTypesId);
  }

  CSectionReasonChange(event: any) {
    this.analyticData.csecReason = event;
  }

  inducedreasionTypeselect(event: any) {
    this.selectedInduse = event;
    this.selectedInduse.forEach((proce, index) => {
      if (index === 0) {
        this.analyticData.inducedReason = proce;
      } else {
        this.analyticData.inducedReason =
          this.analyticData.inducedReason + "," + proce;
      }
    });
    if (this.selectedInduse.length === 0) {
      this.analyticData.inducedReason = "";
    }
    console.log(this.analyticData.inducedReason);
  }

  onBabyTypeChange(event: any) {
    this.analyticData.babyInfo = event;
  }

  onBabySexChange(event: any) {
    this.analyticData.babyGender = event;
  }

  onBabyApgarChange(event: any) {
    this.analyticData.apgar = event;
  }

  onlivebirthChange(event: any) {
    this.analyticData.liveBirth = event;
  }

  onpostopChange(event: any) {
    this.analyticData.postop = event;
  }

  onEblChange(event: any) {
    this.analyticData.ebl = event;
  }

  onCatheterChange(event: any) {
    this.analyticData.fcm = event;
  }

  getAnalytics() {
    if (this.analyticData.patientTypeId === "") {
      //  this.appService.alert('!Warning', 'Please enter patieny type.');
    } else if (this.analyticData.admissionStatus === "") {
      // this.appService.alert('!Warning', 'Please enter patient status.');
    } else if (this.analyticData.fromDate === "") {
      // this.appService.alert('!Warning', 'Please enter from date.');
    } else if (this.analyticData.toDate === "") {
      // this.appService.alert('!Warning', 'Please enter to date.');
    } else {
      const time1 = moment(this.analyticData.fromDate).format("YYYY-MM-DD");
      const time2 = moment(this.analyticData.toDate).format("YYYY-MM-DD");
      if (time1 > time2) {
        // this.appService.alert('!Warning', 'Please enter the from date is less than to date.');
      } else {
        this.submitData();
      }
    }
  }

  submitData() {
    if (this.analyticData.patientTypeId === "OB") {
      this.analyticData.patientType = "1";
    } else if (this.analyticData.patientTypeId === "GYN") {
      this.analyticData.patientType = "2";
    }
    const obDetails = {
      token: localStorage.getItem("deviceToken"),
      fromDate: moment(this.analyticData.fromDate).format("YYYY/MM/DD"),
      toDate: moment(this.analyticData.toDate).format("YYYY/MM/DD"),
      byYrMn: this.analyticData.byYrMn,
      statType: this.analyticData.statType,
      patientTypeId: this.analyticData.patientType,
      admissionStatus: this.analyticData.admissionStatus,
      hospitalID: this.analyticData.hospitalID.toString(),
      gbs: this.analyticData.gbs,
      procedureTypesId: this.analyticData.procedureTypesId.toString(),
      inducedReason: this.analyticData.inducedReason[0],
      babyInfo: this.analyticData.babyInfo[0],
      babyGender: this.analyticData.babyGender[0],
      apgar: this.analyticData.apgar[0],
      liveBirth: this.analyticData.liveBirth[0],
      csecReason: this.analyticData.csecReason,
      chartType: "pie",
    };

    const gynDetails = {
      token: localStorage.getItem("deviceToken"),
      fromDate: moment(this.analyticData.fromDate).format("YYYY/MM/DD"),
      toDate: moment(this.analyticData.toDate).format("YYYY/MM/DD"),
      byYrMn: this.analyticData.byYrMn,
      statType: this.analyticData.statType,
      patientTypeId: this.analyticData.patientType,
      admissionStatus: this.analyticData.admissionStatus,
      hospitalID: this.analyticData.hospitalID.toString(),
      postop: this.analyticData.postop,
      ebl: this.analyticData.ebl,
      fcm: this.analyticData.fcm,
      procedureTypesId: this.analyticData.procedureGYNTypesId,
      chartType: "pie",
    };

    let obj = {};
    if (this.analyticData.patientTypeId === "OB") {
      obj = obDetails;
    } else if (this.analyticData.patientTypeId === "GYN") {
      obj = gynDetails;
    }
    this.plotDetails = "";
    this.homeService
      .fetchAnlyticsData(obj)
      .pipe(first())
      .subscribe((data: any) => {
        console.log(data.data);
        // this.appService.hideLoader();
        if (data.data.status) {
          this.plotDetails = data.data;
        } else if (!data.data.status) {
          this.goToLoginScreen();
        } else {
          // this.appService.alert('!Error', data.message);
        }
      });
  }

  goToLoginScreen() {
    localStorage.setItem("deviceToken", "");
    localStorage.setItem("userData", "");
    localStorage.setItem("deviceId", "");
    this.router.navigateByUrl("/login");
  }

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

  downloadCSV() {
    const payload = {
      token: localStorage.getItem("deviceToken"),
      fromDate: "2012/01/01",
      toDate: "2019/12/31",
      patientTypeId: "1",
      patientStatus: "OUT",
      chartType: "pie",
      statType: "count",
    };
    this.homeService
      .downloadCSV(payload)
      .pipe(first())
      .subscribe((data: any) => {
        console.log(data);
        const items = data.data.bar.map((item: any) => {
          return {
            adYear: item.adYear,
            ptCount: item.ptCount,
          };
        });
        CsvDataService.exportToCsv("result-set.csv", [], items, null);
      });
  }
  downloadFile1(data: any) {
    const blob = new Blob([data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }

  downloadFile(data: any) {}

  clear() {
    this.analyticData = {
      patientTypeId: "",
      admissionStatus: "",
      url: "",
      fromDate: "",
      toDate: "",
      patientType: "",
      byYrMn: "",
      hospitalID: "",
      gbs: "",
      procedureTypesId: "",
      babyInfo: "",
      babyGender: "",
      apgar: "",
      liveBirth: "",
      inducedReason: "",
      fcm: "",
      ebl: "",
      postop: "",
      statType: "",
      csecReason: "",
      procedureGYNTypesId: "",
    };
  }
}
