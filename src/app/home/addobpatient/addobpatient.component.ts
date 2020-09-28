import { Component } from "@angular/core";
import { HomeService } from "../../services/home.service";
import { NotificationService } from "../../notification/notification.service";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";

declare var moment: any;

@Component({
  selector: "app-add-ob-patients",
  styleUrls: ["./addobpatient.component.scss"],
  templateUrl: "./addobpatient.component.html",
})
export class AddobpatientComponent {
  babyExpanded: any;
  bbayArrowicon: string;
  procedureType: any;
  inducedType = "no";
  modeTyp: any;
  babygendar = "M";
  inducedshow = false;
  babyType: any;
  babyAPGARLes = "<7";
  babyAPGARGa = ">7";
  reasonInducedType: any;
  customAlertOptions: any = {
    header: "Choose One",
    translucent: true,
  };

  hospitalList = [];
  procedureList = [];
  selectedProcedure = [];
  selectedOBProcedure: any;
  selectedGYNProcedure = [];
  csectionReasonList = [];
  cpModeList = [];
  inReason = [];
  babynicu: any;
  babyapgar: any;
  babylivebirth: any;
  babyvertet: any;
  patientType: any;
  patientAddType = "OB";
  gsList = [];
  physiciansList=["Prac User 1","Prac User 2"];
  physicianName="";

  minDate: any;
  maxDate: any;
  admitMinDate: any;
  updatePatient: any;
  patientDetails = {
    token: localStorage.getItem("deviceToken"),
    fname: "",
    lname: "",
    roomNo: "",
    hospitalID: "",
    procedureTypesId: "",
    desc: "",
    admitDate: "",
    groupName: "",
    patientTypeId: 1,
    disclaimerAccept: "",
    gbs: "",
    lmp: "",
    edd: "",
    gage: "",
    postpartumDate: "",
    postpartumDay: "",
    preop: "",
    csecReason: "",
    mode: "",
    induced: "",
    inducedReason: "",
    inducedReasonOthers: "",
    babyInfo: "",
    babyOtherInfo: "",
    birthWeight: "",
    babyBirthDate: "",
    babyGender: "",
    nicu: "",
    apgar: "",
    liveBirth: "",
    vertex: "",
    gsps: "",
    appointmentStartTime: "",
    appointmentEndTime: "",
  };
  gsWeeksList = [];
  cSectionReason = "";
  gsDaysList = [];
  gsDays :any;
  gsWeeks :any;
  gsdays = "";
  gspsg = "";
  gspst = "";
  gspsp = "";
  gspsa = "";
  gspsl = "";
  gagsValue = "";
  update = false;
  procUpdate = false;
  infoList = [];

  constructor(
    private homeService: HomeService,
    protected appService: NotificationService,
    private router: Router,
    private route: ActivatedRoute // private pickerController: PickerController
  ) {
    this.patientType="add";
    this.getWeeksAndDaya();
    this.babyExpanded = false;
    this.bbayArrowicon = "arrow-dropright-circle";
    this.minDate = moment(Date.now()).format("YYYY-MM-DD");
    this.maxDate = moment(Date.now()).format("YYYY-MM-DD");
    const admindate = moment(Date.now()).subtract(30, "days");
    this.admitMinDate = moment(admindate).format("YYYY-MM-DD");
    this.gsWeeksList = Array.from({ length: 43 }, (v, k) => k);
    this.gsDaysList = Array.from({ length: 7 }, (v, k) => k);
    this.getHospitals();
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.patientType = this.router.getCurrentNavigation().extras.state.patientType;
        this.updatePatient = this.router.getCurrentNavigation().extras.state.patientDetails;
        this.getHospitals();

        const userData = JSON.parse(localStorage.getItem("userData"));
        this.patientDetails.groupName = userData.groupName;
        this.patientDetails.disclaimerAccept = userData.disclaimerAccept;
        if (userData.disclaimerAccept) {
          this.patientDetails.disclaimerAccept = "1";
        } else {
          this.patientDetails.disclaimerAccept = "0";
        }
      }
    });
  }

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
    this.router.navigateByUrl("/addobpatient", navigationExtras);
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
      },
    };
    this.router.navigate(["addobpatient"], navigationExtras);
  }

  updatePatientDetails() {
    this.patientDetails.fname = this.updatePatient.mstUsers.firstName;
    this.patientDetails.lname = this.updatePatient.mstUsers.lastName;
    if (this.updatePatient.gage === null || this.updatePatient.gage === "") {
      this.patientDetails.gage = "";
    } else {
      const gabs = this.updatePatient.gage.split("|");
      this.patientDetails.gage = gabs[0] + "weeks" + " " + gabs[0] + "days";
    }
    if (
      this.updatePatient.roomNumber === null ||
      this.updatePatient.roomNumber === ""
    ) {
      this.patientDetails.roomNo = "";
    } else {
      this.patientDetails.roomNo = this.updatePatient.roomNumber;
    }
    this.patientDetails.hospitalID = this.updatePatient.hospital.id.toString();

    if (
      this.updatePatient.admittedDate === null ||
      this.updatePatient.admittedDate === ""
    ) {
      this.patientDetails.admitDate = "";
    } else {
      this.patientDetails.admitDate = moment(
        this.updatePatient.admittedDate
      ).format("YYYY-MM-DD");
    }

    if (this.updatePatient.lmp === null || this.updatePatient.lmp === "") {
      this.patientDetails.lmp = "";
    } else {
      this.patientDetails.lmp = moment(this.updatePatient.lmp).format(
        "YYYY-MM-DD"
      );
    }

    if (this.updatePatient.edd === null || this.updatePatient.edd === "") {
      this.patientDetails.edd = "";
    } else {
      this.patientDetails.edd = moment(this.updatePatient.edd).format(
        "YYYY-MM-DD"
      );
    }

    if (
      this.updatePatient.postDate === null ||
      this.updatePatient.postDate === ""
    ) {
      this.patientDetails.postpartumDate = "";
    } else {
      this.patientDetails.postpartumDate = moment(
        this.updatePatient.postDate
      ).format("YYYY-MM-DD");
    }

    if (this.updatePatient.preOp === null || this.updatePatient.preOp === "") {
      this.patientDetails.preop = "";
    } else {
      this.patientDetails.preop = this.updatePatient.preOp.toString();
    }

    if (
      this.updatePatient.babyBirthDate === null ||
      this.updatePatient.babyBirthDate === ""
    ) {
      this.patientDetails.babyBirthDate = "";
    } else {
      this.patientDetails.babyBirthDate = moment(
        this.updatePatient.babyBirthDate
      ).format("YYYY-MM-DD");
    }
    if (this.updatePatient.gbs === null || this.updatePatient.gbs === "") {
      this.patientDetails.gbs = "";
    } else {
      this.patientDetails.gbs = this.updatePatient.gbs.toString();
    }
    if (
      this.updatePatient.pcrList === null ||
      this.updatePatient.pcrList.length === 0
    ) {
      this.patientDetails.csecReason = "";
    } else {
      this.patientDetails.csecReason = this.updatePatient.pcrList[0].csReason.id.toString();
    }
    if (this.updatePatient.patientProceduresList.length > 0) {
      this.updatePatient.patientProceduresList.forEach((proce, index) => {
        this.selectedGYNProcedure.push(proce.procedureTypes.id.toString());
        if (index === 0) {
          this.patientDetails.procedureTypesId = proce.procedureTypes.id.toString();
        } else {
          this.patientDetails.procedureTypesId =
            this.patientDetails.procedureTypesId +
            "," +
            proce.procedureTypes.id.toString();
        }
      });
    }
    if (this.updatePatient.daysList.length > 0) {
      this.updatePatient.daysList.forEach((info) => {
        const data = {
          expanded: false,
          arrowicon: "arrow-dropright-circle",
          date: info,
        };
        this.infoList.push(data);
      });
    }

    if (this.updatePatient.pcpmList.length > 0) {
      this.updatePatient.pcpmList.forEach((proce) => {
        this.cpModeList.forEach((mode) => {
          if (proce.cpMode.id === mode.id) {
            mode.isChecked = true;
          }
        });
      });
    }

    if (this.updatePatient.pirList.length > 0) {
      this.updatePatient.pirList.forEach((pir) => {
        this.inReason.forEach((resion) => {
          if (pir.ir.id === resion.id) {
            resion.isChecked = true;
          }
          if (pir.ir.irName === "Other") {
            this.reasonInducedType = pir.ir.irName;
            this.patientDetails.inducedReasonOthers = pir.inducedReasonOthers;
          }
        });
      });
    }

    if (this.updatePatient.gsPs === null || this.updatePatient.gsPs === "") {
      this.patientDetails.gsps = "";
    } else {
      this.patientDetails.gsps = this.updatePatient.gsPs;
      const gbs = this.updatePatient.gsPs.split("|");
      if (gbs.length === 5) {
        this.gspsg = gbs[0].toString();
        this.gspst = gbs[1].toString();
        this.gspsp = gbs[2].toString();
        this.gspsa = gbs[3].toString();
        this.gspsl = gbs[4].toString();
      } else if (gbs.length === 4) {
        this.gspsg = gbs[0].toString();
        this.gspst = gbs[1].toString();
        this.gspsp = gbs[2].toString();
        this.gspsa = gbs[3].toString();
      } else if (gbs.length === 3) {
        this.gspsg = gbs[0].toString();
        this.gspst = gbs[1].toString();
        this.gspsp = gbs[2].toString();
      } else if (gbs.length === 2) {
        this.gspsg = gbs[0].toString();
        this.gspst = gbs[1].toString();
      } else if (gbs.length === 1) {
        this.gspsg = gbs[0].toString();
      }
    }

    if (
      this.updatePatient.babyInfo === null ||
      this.updatePatient.babyInfo === ""
    ) {
      this.patientDetails.babyInfo = "";
    } else {
      if (
        this.updatePatient.babyInfo === 1 ||
        this.updatePatient.babyInfo === 2
      ) {
        this.patientDetails.babyInfo = this.updatePatient.babyInfo.toString();
      } else {
        this.patientDetails.babyInfo = "Other";
        this.patientDetails.babyOtherInfo = this.updatePatient.babyInfo.toString();
      }
    }

    if (
      this.updatePatient.birthWeight === null ||
      this.updatePatient.birthWeight === ""
    ) {
      this.patientDetails.birthWeight = "";
    } else {
      this.patientDetails.birthWeight = this.updatePatient.birthWeight;
    }
    if (
      this.updatePatient.babyGender === null ||
      this.updatePatient.babyGender === ""
    ) {
      this.patientDetails.babyGender = "";
    } else {
      this.patientDetails.babyGender = this.updatePatient.babyGender;
    }

    if (this.updatePatient.apgar === null || this.updatePatient.apgar === "") {
      this.patientDetails.apgar = "";
    } else {
      this.patientDetails.apgar = this.updatePatient.apgar;
    }

    if (this.updatePatient.apgar === null || this.updatePatient.apgar === "") {
      this.patientDetails.apgar = "";
    } else {
      this.patientDetails.apgar = this.updatePatient.apgar;
    }

    if (this.updatePatient.induced !== null) {
      if (this.updatePatient.induced) {
        this.patientDetails.induced = "YES";
      } else {
        this.patientDetails.induced = "NO";
      }
    }

    if (this.updatePatient.nicu !== null) {
      if (this.updatePatient.nicu) {
        this.patientDetails.nicu = "YES";
      } else {
        this.patientDetails.nicu = "NO";
      }
    }

    if (this.updatePatient.liveBirth !== null) {
      if (this.updatePatient.liveBirth) {
        this.patientDetails.liveBirth = "YES";
      } else {
        this.patientDetails.liveBirth = "NO";
      }
    }
    if (this.updatePatient.vertex !== null) {
      if (this.updatePatient.vertex) {
        this.patientDetails.vertex = "YES";
      } else {
        this.patientDetails.vertex = "NO";
      }
    }
  }

  onPatientTypeChange(patientType) {
    this.patientDetails.patientTypeId = patientType === "OB" ? 1 : 2;
    this.getProcedures();
  }

  getHospitals() {
    console.log("Inside..getHospitals.");
    // this.appService.showLoader();
    this.homeService.fetchHospitals().subscribe((data) => {
      if (data && data._statusCode === "200") {
        this.hospitalList = data.data.hospitalList;
        console.log(this.hospitalList);
        this.getProcedures();
      } else if (!data) {
        // this.appService.hideLoader();
      } else {
        //  this.appService.hideLoader();
        // this.appService.alert('!Error', data.message);
      }
    });
  }

  getProcedures() {
    this.homeService
      .fetchProcedures(this.patientDetails.patientTypeId)
      .subscribe((data: any) => {
        // this.homeService.fetchProcedures(1).pipe(map((data: any) => {
        console.log(data.data);
        if (data && data._statusCode === "200") {
          this.procedureList = data.data.procedureList.map((item) => {
            return {
              name: item.procedureName,
              colorCode: item.colorCode,
              description: item.description,
              id: item.id,
              procedureName: item.procedureName,
              updatedDate: item.updatedDate,
            };
          });
          if (this.patientType === "update") {
            this.updatePatientDetails();
            this.update = true;
            this.procUpdate = true;
          }
        } else if (!data) {
          //  this.appService.hideLoader();
          // this.goToLoginScreen();
        } else {
          // this.appService.hideLoader();
          // this.appService.alert('!Error', data.message);
        }
      });
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

  expandbabysection(item: any): void {
    if (item) {
      this.babyExpanded = false;
      this.bbayArrowicon = "arrow-dropright-circle";
    } else {
      this.babyExpanded = true;
      this.bbayArrowicon = "arrow-dropdown-circle";
    }
  }
  onhospitalChange(event: any) {
    this.patientDetails.hospitalID = event.target.value;
  }

  onGBSChange(event: any) {
    this.patientDetails.gbs = event.target.value;
  }

  onProcedureChange(event: any) {
    console.log(event);
    this.patientDetails.procedureTypesId = event;
    this.procedureList.forEach((proce) => {
      if (proce.id === Number(this.patientDetails.procedureTypesId)) {
        this.procedureType = proce.procedureName;
      }
    });
  }

  CSectionReasonChange(event: any) {
    this.patientDetails.csecReason = event.target.value;
  }
  updateLmpDate(event: any) {
    console.log(this.patientDetails.lmp);
    const todaysDate = moment(new Date());
    const oDate = moment(event.target.value);
    const diffDays = todaysDate.diff(oDate, "days");
    let weeks = diffDays / 7;

    weeks = Math.abs(Math.round(weeks));
    let days = diffDays % 7;
    days =  Math.abs(Math.round(days * 1) / 1);

    if (diffDays >= 0) {
      this.patientDetails.lmp = moment(event.target.value).format("YYYY-MM-DD");
      this.gsWeeks = weeks;
      this.gsDays = days;
      const date = moment(event.target.value).add(280, "days");
      this.patientDetails.edd = moment(date).format("YYYY-MM-DD");
      this.patientDetails.gage = weeks + " weeks" + " " + days + " days";
      this.gagsValue = weeks + "|" + days;
    } else {
      this.appService.error("!Warning", "The LMP should not be after today.");
    }
  }
  updateEddDate(event: any) {
    console.log(event);
    const todaysDate = moment(new Date());
    const oDate = moment(event.target.value);
    const diffDays = oDate.diff(todaysDate, "days");
    const dateOf = moment(event.target.value).subtract(280, "days");
    const diffDays1 = dateOf.diff(todaysDate, "days");

    let weeks = diffDays1 / 7;
    weeks = Math.abs(Math.round(weeks));

    let days = diffDays1 % 7;
    days = Math.abs(Math.round(days * 1) / 1);

    if (diffDays >= -7) {
      this.patientDetails.edd = moment(event.target.value).format();
      console.log(weeks,days);
      this.gsWeeks = weeks;
      this.gsDays = days;
      const date = moment(event.target.value).subtract(280, "days");
      this.patientDetails.lmp = moment(date).format();
    } else {
      this.appService.warning("!Warning", "The EDD should not be before week.");
    }
  }
  updateDatesOnWeeksChange() {
    const todaysDate = moment(new Date());
    this.patientDetails.lmp = moment(todaysDate).subtract(this.gsWeeks,"weeks").subtract(this.gsDays,"days").format();
    this.patientDetails.edd = moment(this.patientDetails.lmp).add(280, "days").format();
  }
  updateDatesOnDaysChange() {
    const todaysDate = moment(new Date());
    this.patientDetails.lmp = moment(todaysDate).subtract(this.gsWeeks,"weeks").subtract(this.gsDays,"days").format();
    this.patientDetails.edd = moment(this.patientDetails.lmp).add(280, "days").format();
  }
  updatePostDate(event: any) {
    this.patientDetails.postpartumDate = moment(event.target.value).format(
      "YYYY-MM-DD"
    );
    const admission = moment(event.detail.value).format("YYYY-MM-DD");
    const discharge = moment(Date.now()).format("YYYY-MM-DD");
    const start = moment(admission, "YYYY-MM-DD");
    const end = moment(discharge, "YYYY-MM-DD");
    if (this.update) {
      this.update = false;
      if (
        this.updatePatient.preOp === null ||
        this.updatePatient.preOp === ""
      ) {
        this.patientDetails.preop = "";
      } else {
        this.patientDetails.preop = this.updatePatient.preOp.toString();
      }
    } else {
      this.patientDetails.preop = moment
        .duration(start.diff(end))
        .asDays()
        .toString();
    }
  }
  updatePostPatumDate(event: any) {
    this.patientDetails.preop = moment(event.target.value).format("YYYY-MM-DD");
  }
  updateAdmitDate(event: any) {
    this.patientDetails.admitDate = moment(event.target.value).format(
      "YYYY-MM-DD"
    );
  }
  updatebabyAdmitDate(event: any) {
    this.patientDetails.babyBirthDate = moment(event.target.value).format(
      "YYYY-MM-DD"
    );
  }
  cSectionCanges(event: any) {}
  inducedTypeselect(event: any) {
    this.patientDetails.induced = event.target.value;
    if (event.target.value === "YES") {
      this.inducedshow = true;
    } else {
      this.inducedshow = false;
    }
  }

  inducedreasionTypeselect(item: any) {
    if (item.irName === "Other" && item.isChecked) {
      this.reasonInducedType = item.irName;
    } else if (item.irName === "Other" && item.isChecked === false) {
      this.reasonInducedType = "";
    }
  }

  babyTypeSelect(event: any) {
    this.patientDetails.babyInfo = event.target.value;
  }

  babygendarTypeSelect(event: any) {
    this.patientDetails.babyGender = event.target.value;
  }

  babynicuTypeSelect(event: any) {
    this.patientDetails.nicu = event.target.value;
  }

  babyapgarTypeSelect(event: any) {
    this.patientDetails.apgar = event.target.value;
  }

  babylivebirthTypeSelect(event: any) {
    this.patientDetails.liveBirth = event.target.value;
  }

  babyvertetTypeSelect(event: any) {
    this.patientDetails.vertex = event.target.value;
  }
  gChange(event: any) {
    this.gspsg = event.target.value;
  }
  tChange(event: any) {
    this.gspst = event.target.value;
  }
  pChange(event: any) {
    this.gspsp = event.target.value;
  }
  aChange(event: any) {
    this.gspsa = event.target.value;
  }
  lChange(event: any) {
    this.gspsl = event.target.value;
  }

  savePatientDetails() {
    console.log(this.patientDetails);
    console.log(this.patientType);
    if (
      this.patientDetails.fname.length <= 2 ||
      this.patientDetails.fname === ""
    ) {
      this.appService.warning(
        "!Warning",
        "Please enter at least 3 characters in FirstName."
      );
    } else if (this.patientDetails.fname.length > 20) {
      this.appService.warning(
        "!Warning",
        "Please enter no more than 15 characters in FirstName."
      );
    } else if (this.patientDetails.lname.length > 20) {
      this.appService.warning(
        "!Warning",
        "Please enter no more than 15 characters in LastName."
      );
    } else if (
      this.patientDetails.lname.length <= 2 ||
      this.patientDetails.lname === ""
    ) {
      this.appService.warning(
        "!Warning",
        "Please enter at least 3 characters in LastName."
      );
    } else if (this.patientDetails.roomNo === "") {
      this.appService.warning("!Warning", "Please enter RoomNo");
    } else if (this.patientDetails.hospitalID === "") {
      this.appService.warning("!Warning", "Please select Hospital");
    } else if (this.patientDetails.procedureTypesId === "") {
      this.appService.warning("!Warning", "Please select Procedure");
    } else {
      console.log("in else",this.patientType);
      if (this.patientType === "update") {
        if (this.patientDetails.admitDate === "") {
          this.appService.warning("!Warning", "Please Fill Date Of Admit.");
        } else {
          this.updatePatientForm();
        }
      } else if (this.patientType === "add") {
        if (this.patientDetails.admitDate === "") {
          this.appService.warning("!Warning", "Please Fill Date Of Admit.");
        } else {
          this.submitPatientDetails();
        }
      } else {
        this.submitPatientDetails();
      }
    }
  }
  submitPatientDetails() {
    this.getDetails();
    // this.appService.showLoader();
    this.homeService
      .submitPatientDetails("patient/addpat", this.patientDetails)
      .subscribe((data) => {
        // console.log(data.data);
        // this.appService.hideLoader();
        if (data) {
          this.appService.success("Success", "OB Patient Add Successfully.");
          if (this.patientType === "add" || this.patientType === "update") {
            this.router.navigateByUrl("/ob-patients");
          } else {
            this.router.navigateByUrl("addschedulerappointment");
          }
        } else if (!data) {
          this.goToLoginScreen();
        } else {
          console.log(this.appService.error);
          // this.appService.hideLoader();
          this.appService.error("!Error", "");
        }
      });
  }

  updatePatientForm() {
    this.getDetails();
    this.patientDetails[
      "userId"
    ] = this.updatePatient.mstUsers.userId.toString();
    this.patientDetails["patientDetailsId"] = this.updatePatient.id.toString();
    // console.log(this.patientDetails);
    // this.appService.showLoader();
    this.homeService
      .submitPatientDetails("patient/addPatient", this.patientDetails)
      .subscribe((data) => {
        console.log(data);
        // this.appService.hideLoader();
        if (data) {
          this.appService.success("Success", "OB Patient Update Successfully.");
          this.router.navigateByUrl("obpatients");
        } else if (!data) {
          this.goToLoginScreen();
        } else {
          // this.appService.hideLoader();
          this.appService.error("!Error", "");
        }
      });
  }

  getDetails() {
    if (this.patientType === "add" || this.patientType === "update") {
      this.patientDetails.admitDate = moment(
        this.patientDetails.admitDate
      ).format("MM-DD-YYYY");
    } else {
      this.patientDetails.admitDate = "";
    }
    this.patientDetails.roomNo = this.patientDetails.roomNo.toString();

    if (this.patientDetails.lmp !== "") {
      this.patientDetails.lmp = moment(this.patientDetails.lmp).format(
        "MM-DD-YYYY"
      );
    }
    if (this.patientDetails.edd !== "") {
      this.patientDetails.edd = moment(this.patientDetails.edd).format(
        "MM-DD-YYYY"
      );
    }
    if (this.patientDetails.postpartumDate !== "") {
      this.patientDetails.postpartumDate = moment(
        this.patientDetails.postpartumDate
      ).format("MM-DD-YYYY");
    }
    if (this.patientDetails.babyBirthDate !== "") {
      this.patientDetails.babyBirthDate = moment(
        this.patientDetails.babyBirthDate
      ).format("MM-DD-YYYY");
    }

    this.cpModeList.forEach((section) => {
      if (section.isChecked) {
        if (this.patientDetails.mode.length > 0) {
          this.patientDetails.mode =
            this.patientDetails.mode + "," + section.id.toString();
        } else {
          this.patientDetails.mode = section.id.toString();
        }
      }
    });
    this.patientDetails.gsps =
      this.gspsg +
      "|" +
      this.gspst +
      "|" +
      this.gspsp +
      "|" +
      this.gspsa +
      "|" +
      this.gspsl;
    this.inReason.forEach((induceds) => {
      if (induceds.isChecked) {
        if (this.patientDetails.inducedReason.length > 0) {
          this.patientDetails.inducedReason =
            this.patientDetails.inducedReason + "," + induceds.id.toString();
        } else {
          this.patientDetails.inducedReason = induceds.id.toString();
        }
      }
    });
    this.patientDetails.birthWeight = this.patientDetails.birthWeight.toString();
    if (this.patientDetails.babyInfo === "Other") {
      this.patientDetails.babyInfo = this.patientDetails.babyOtherInfo.toString();
    } else {
      if (this.patientDetails.babyInfo !== "") {
        this.patientDetails.babyInfo = this.patientDetails.babyInfo.toString();
      } else {
        this.patientDetails.babyInfo = "";
      }
    }
    if (this.patientDetails.induced === "YES") {
      this.patientDetails.induced = "true";
    } else {
      this.patientDetails.induced = "false";
    }
    if (this.patientDetails.nicu === "YES") {
      this.patientDetails.nicu = "true";
    } else {
      this.patientDetails.nicu = "false";
    }
    if (this.patientDetails.liveBirth === "YES") {
      this.patientDetails.liveBirth = "true";
    } else {
      this.patientDetails.liveBirth = "false";
    }
    if (this.patientDetails.vertex === "YES") {
      this.patientDetails.vertex = "true";
    } else {
      this.patientDetails.vertex = "false";
    }
    this.patientDetails.gage = this.gagsValue;
    console.log(this.patientDetails);
  }

  getWeeksAndDaya() {
    for (let i = 0; i <= 42; i++) {
      if (i <= 15) {
        this.gsList.push(i.toString());
      }
    }
  }

  // async getGastalAge() {
  //   this.gsdays = [
  //     { text: "0 day", value: "0" },
  //     { text: "1 day", value: "0" },
  //     { text: "2 days", value: "2" },
  //     { text: "3 days", value: "3" },
  //     { text: "4 days", value: "4" },
  //     { text: "5 days", value: "5" },
  //     { text: "6 days", value: "6" },
  //   ];

  //   this.gsWeeks = [
  //     { text: "0 Weeks", value: "0" },
  //     { text: "1 Week", value: "1" },
  //     { text: "2 Weeks", value: "2" },
  //     { text: "3 Weeks", value: "3" },
  //     { text: "4 Weeks", value: "4" },
  //     { text: "5 Weeks", value: "5" },
  //     { text: "6 Weeks", value: "6" },
  //     { text: "7 Weeks", value: "7" },
  //     { text: "8 Weeks", value: "8" },
  //     { text: "9 Weeks", value: "9" },
  //     { text: "10 Weeks", value: "10" },
  //     { text: "11 Weeks", value: "11" },
  //     { text: "12 Weeks", value: "12" },
  //     { text: "13 Weeks", value: "13" },
  //     { text: "14 Weeks", value: "14" },
  //     { text: "15 Weeks", value: "15" },
  //     { text: "16 Weeks", value: "16" },
  //     { text: "17 Weeks", value: "17" },
  //     { text: "18 Weeks", value: "18" },
  //     { text: "19 Weeks", value: "19" },
  //     { text: "20 Weeks", value: "20" },
  //     { text: "21 Weeks", value: "21" },
  //     { text: "22 Weeks", value: "22" },
  //     { text: "23 Weeks", value: "23" },
  //     { text: "24 Weeks", value: "24" },
  //     { text: "25 Weeks", value: "25" },
  //     { text: "26 Weeks", value: "26" },
  //     { text: "27 Weeks", value: "27" },
  //     { text: "28 Weeks", value: "28" },
  //     { text: "29 Weeks", value: "29" },
  //     { text: "30 Weeks", value: "30" },
  //     { text: "31 Weeks", value: "31" },
  //     { text: "32 Weeks", value: "32" },
  //     { text: "33 Weeks", value: "33" },
  //     { text: "34 Weeks", value: "34" },
  //     { text: "35 Weeks", value: "35" },
  //     { text: "36 Weeks", value: "36" },
  //     { text: "37 Weeks", value: "37" },
  //     { text: "38 Weeks", value: "38" },
  //     { text: "39 Weeks", value: "39" },
  //     { text: "40 Weeks", value: "40" },
  //     { text: "41 Weeks", value: "41" },
  //     { text: "42 Weeks", value: "42" },
  //   ];

  //   // const picker = await this.pickerController.create({
  //   //   buttons: [
  //   //     {
  //   //       text: 'Cancel',
  //   //       role: 'cancel'
  //   //     },
  //   //     {
  //   //       text: 'Confirm',
  //   //       handler: (value) => {
  //   //         console.log(`Got Value ${value}`, value);
  //   //         this.patientDetails.gage = value.weeks.text + ' ' + value.days.text;
  //   //         this.gagsValue = value.weeks.value + '|' + value.days.value;
  //   //       }
  //   //     }
  //   //   ],
  //   //   columns: [
  //   //     {
  //   //       name: 'weeks',
  //   //       options: this.gsWeeks
  //   //     },
  //   //     {
  //   //       name: 'days',
  //   //       options: this.gsdays
  //   //     },
  //   //   ]
  //   // });
  //   // await picker.present();
  // }

  goToLoginScreen() {
    localStorage.setItem("deviceToken", "");
    localStorage.setItem("userData", "");
    localStorage.setItem("deviceId", "");
    this.router.navigateByUrl("/login");
  }
}
