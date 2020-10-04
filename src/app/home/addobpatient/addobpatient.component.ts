import { Component, ViewChild } from "@angular/core";
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
  patientDetails = {
    token: localStorage.getItem("deviceToken"),
    fname: "",
    lname: "",
    roomNo: "",
    hospitalID: "",
    patientTypeId: "1",
    procedureTypesId: "",
    admitDate: "",
    groupName: "",
    disclaimerAccept: "",
    //OB
    lmp: "",
    edd: "",
    // OB- Postpartum
    postpartumDate: "",
    postpartumDay: "",
    //OB - C-Section
    csecReason: "",
    mode: "",
    induced: "",
    inducedReason: "",
    inducedReasonOthers: "",
    cSectionReasonOther: "",
    //Baby Info
    babyInfo: "",
    babyOtherInfo: "",
    birthWeight: "",
    babyBirthDate: "",
    babyGender: "",
    nicu: "",
    apgar: "",
    liveBirth: "",
    vertex: "",
    // Gestational Age
    gage: "", // Weeks|Days
    gsps: "", // G|T|P|A|L
    gbs: "", // GBS - +/-

    // GYN
    surgeryDate: "",
    surgeon: "",
    preop: "",
    ebl: "",
    complications: "",
    fcm: "",
    postop: "",
    // Appointment
    appointmentStartTime: "",
    appointmentEndTime: "",
    desc: "",
  };

  // *** Field Options List ***
  hospitalList = []; // Hospital
  procedureList = []; // Procedure
  csectionReasonList = []; // C-Section Reason
  cpModeList = []; // C-Section Mode
  inReason = []; // Induced Reason
  gsWeeksList = [];
  gsDaysList = [];
  gspsList = [];
  // physiciansList = ["Prac User 1", "Prac User 2"];
  // physicianName = "";

  selectedOBProcedure: any;
  selectedGYNProcedure = [];
  selectedCSectionReason = [];
  patientPertinentInfoList = [];
  patientType: any; // add or update
  patientStatus: any; //census or discharged
  gsDays: any;
  gsWeeks: any;
  gspsg = "";
  gspst = "";
  gspsp = "";
  gspsa = "";
  gspsl = "";

  update = false;
  updatePatient: any;

  isCSectionOthrReason = false;
  panelOpenState = false;
  lmpMaxDate: any;
  postPartumMinDate: any;
  postPartumMaxDate: any;
  admitMinDate: any;
  admitMaxDate: any;
  dateOfSurgeryMinDate: any;

  constructor(
    private homeService: HomeService,
    protected appService: NotificationService,
    private router: Router,
    private route: ActivatedRoute // private pickerController: PickerController
  ) {
    this.patientType = "add";

    // *** Set groupName and disclaimerAccept ***
    const userData = JSON.parse(localStorage.getItem("userData"));
    this.patientDetails.groupName = userData.groupName;
    if (userData.disclaimerAccept) {
      this.patientDetails.disclaimerAccept = "1";
    } else {
      this.patientDetails.disclaimerAccept = "0";
    }

    // **** Min and Max Dates for Datepicker ****
    this.postPartumMinDate = moment(Date.now()).format("YYYY-MM-DD");
    //this.postPartumMaxDate = moment(Date.now()).format("YYYY-MM-DD");
    const admindate = moment(Date.now()).subtract(30, "days");
    this.admitMinDate = moment(admindate).format("YYYY-MM-DD");
    this.admitMaxDate = moment(Date.now()).format("YYYY-MM-DD");

    // OB - mix-max dates
    this.lmpMaxDate = moment(Date.now()).format("YYYY-MM-DD");

    this.dateOfSurgeryMinDate = moment(Date.now()).format("YYYY-MM-DD");

    // *** Get Details from Route queryParams - for Update ***
    this.route.queryParams.subscribe((params) => {
      //patientStatus

      if (this.router.getCurrentNavigation().extras.state) {
        console.log(this.router.getCurrentNavigation().extras.state);
        this.patientType = this.router.getCurrentNavigation().extras.state.patientType;
        this.patientStatus = this.router.getCurrentNavigation().extras.state.patientStatus;
        this.updatePatient = this.router.getCurrentNavigation().extras.state.patientDetails;
        if (this.updatePatient.patientTypes) {
          this.patientDetails.patientTypeId = this.updatePatient.patientTypes.id.toString();
        }
      }
    });

    // *** Fill Details in the Form - for patient to update ***
    if (this.patientType === "update") {
      this.fillEditPatientFormDetails();
      this.update = true;
    }

    // *** Set Options List in Dropdowns ***
    this.gsWeeksList = Array.from({ length: 43 }, (v, k) => k.toString());
    this.gsDaysList = Array.from({ length: 7 }, (v, k) => k.toString());
    this.gspsList = Array.from({ length: 16 }, (v, k) => k.toString());
    this.getHospitals();
  }

  // ************ Page Navigation ************
  gotoDashboardPage() {
    this.router.navigateByUrl("/home");
  }
  patientsTypeSelection() {
    if (this.patientStatus && this.patientStatus === "discharged")
      this.router.navigateByUrl("/out-patients");
    else this.router.navigateByUrl("/ob-patients");
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

  // **************** GET fields Option List ****************

  // Get Hospitals Dropdown Options
  getHospitals() {
    this.homeService.fetchHospitals().subscribe((data) => {
      if (data && data._statusCode === "200") {
        this.hospitalList = data.data.hospitalList;
        this.getProcedures();
      } else {
        this.appService.alert("!Error", data.message);
      }
    });
  }

  /************* Fetch Dropdown Options for: ****************
   *  - Procedures
   *  - C-Section:
   *    - Reason List
   *    - Mode
   *  - Induced Reason
   */
  getProcedures() {
    this.homeService
      .fetchProcedures(parseInt(this.patientDetails.patientTypeId))
      .subscribe((data: any) => {
        if (data && data._statusCode === "200") {
          // *** Procedures ***
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
          //this.patientDetails.procedureTypesId = "";
          // *** C-Section - Reason List ***
          this.csectionReasonList = data.data.csectionReasonList;

          // *** C-Section - Mode  ***
          this.cpModeList = data.data.cpModeList.map((item) => ({
            ...item,
            isChecked: false,
          }));

          // *** Induced Reason  ***
          this.inReason = data.data.inReason.map((item) => ({
            ...item,
            isChecked: false,
          }));
        } else {
          this.appService.alert("!Error", data.message);
        }
      });
  }

  // ************ Fields On Change Handlers ***************

  // *** Hospital Change ***
  handleHospitalChange(event: any) {
    this.patientDetails.hospitalID = event;
  }

  // *** OB - C-Section Mode Change ***
  handleModeChange() {
    this.patientDetails.mode = this.cpModeList
      .filter((val) => val.isChecked)
      .map((val) => val.id)
      .join(",");
  }

  // *** OB - C-Section Induced Reason Change ***
  handleInducedReasonChange() {
    this.patientDetails.inducedReason = this.inReason
      .filter((val) => val.isChecked)
      .map((val) => val.id)
      .join(",");
  }

  onEblChange(value) {
    console.log(value);
  }

  // *** Patient Type ***
  onPatientTypeChange() {
    this.getProcedures();
  }

  // *** Procedure ***
  onProcedureChange(value: any) {
    console.log(this.selectedGYNProcedure, value);
    this.patientDetails.procedureTypesId = Array.isArray(value)
      ? value.length
        ? value.join(",")
        : ""
      : value;

    console.log(this.patientDetails.procedureTypesId);
  }

  // *** Admit Date ***
  updateAdmitDate(event: any) {
    this.patientDetails.admitDate = moment(event).format("YYYY-MM-DD");
  }

  // *** LMP Date Change ***
  updateLmpDate(event: any) {
    console.log(event);
    this.patientDetails.lmp = moment(event).format("YYYY-MM-DD");
    // console.log(this.patientDetails.lmp);
    const todaysDate = moment(new Date());
    const oDate = moment(event.target.value);
    const diffDays = todaysDate.diff(oDate, "days");
    let weeks = diffDays / 7;

    weeks = Math.abs(Math.round(weeks));
    let days = diffDays % 7;
    days = Math.abs(Math.round(days * 1) / 1);

    console.log(weeks, days, diffDays);
    if (diffDays >= 0) {
      // this.patientDetails.lmp = moment(event.target.value).format("YYYY-MM-DD");
      this.gsWeeks = weeks.toString();
      this.gsDays = days.toString();
      const date = moment(event.target.value).add(280, "days");
      this.patientDetails.edd = moment(date).format("YYYY-MM-DD");
      //this.patientDetails.gage = weeks + " weeks" + " " + days + " days";
      this.patientDetails.gage = weeks + "|" + days;
    } else {
      this.appService.error("!Warning", "The LMP should not be after today.");
    }
  }

  // *** EDD Date Change ***
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
      this.patientDetails.edd = moment(event.target.value).format("YYYY-MM-DD");
      console.log(weeks, days);
      this.gsWeeks = weeks;
      this.gsDays = days;
      const date = moment(event.target.value).subtract(280, "days");
      this.patientDetails.lmp = moment(date).format("YYYY-MM-DD");
    } else {
      this.appService.warning("!Warning", "The EDD should not be before week.");
    }
  }

  // **** Postpartum Date Change ****
  updatePostPatumDate(event: any) {
    //this.patientDetails.preop = moment(event).format("YYYY-MM-DD");
    this.patientDetails.postpartumDate = moment(event.target.value).format(
      "YYYY-MM-DD"
    );
    const oDate = moment(moment(event.target.value).format("YYYY-MM-DD"));
    const todaysDate = moment(moment(new Date()).format("YYYY-MM-DD"));
    const diffDays = oDate.diff(todaysDate, "days");

    this.patientDetails.postpartumDay = diffDays;
  }

  // *** C-Section Reason Change ***
  onCSectionReasonChange(value: any) {
    console.log(this.selectedCSectionReason, value);
    this.isCSectionOthrReason = value[value.length - 1] === 13;
    this.patientDetails.csecReason = Array.isArray(value)
      ? value.length
        ? value.join(",")
        : ""
      : value;

    console.log(this.patientDetails.csecReason);
  }

  // **** Gestational Weeks & Days Change ****
  updateDatesOnWeeksChange() {
    const todaysDate = moment(new Date());
    this.patientDetails.lmp = moment(todaysDate)
      .subtract(parseInt(this.gsWeeks), "weeks")
      .subtract(parseInt(this.gsDays), "days")
      .format("YYYY-MM-DD");
    console.log("updateDatesOnWeeksChange");
    console.log(this.patientDetails.lmp);

    this.patientDetails.edd = moment(this.patientDetails.lmp)
      .add(280, "days")
      .format("YYYY-MM-DD");
  }

  // **** Baby: Birth Date ****
  updatebabyBirthDate(event: any) {
    this.patientDetails.babyBirthDate = moment(event).format("YYYY-MM-DD");
  }

  //*************** GYN Fields *****************/

  setPreOpDiagnosis(value) {
    const surgeryDate = moment(moment(value).format("YYYY-MM-DD"));
    const todaysDate = moment(moment(new Date()).format("YYYY-MM-DD"));
    const diffDays = surgeryDate.diff(todaysDate, "days");
    this.patientDetails.preop = diffDays;
  }

  handleSurgeryDateChange(event: any) {
    console.log(event);
    this.patientDetails.surgeryDate = moment(event.target.value).format(
      "YYYY-MM-DD"
    );

    this.setPreOpDiagnosis(this.patientDetails.surgeryDate);
  }

  // updatePostDate(event: any) {
  //   this.patientDetails.postpartumDate = moment(event.target.value).format(
  //     "YYYY-MM-DD"
  //   );
  //   const admission = moment(event.detail.value).format("YYYY-MM-DD");
  //   const discharge = moment(Date.now()).format("YYYY-MM-DD");
  //   const start = moment(admission, "YYYY-MM-DD");
  //   const end = moment(discharge, "YYYY-MM-DD");
  //   if (this.update) {
  //     this.update = false;
  //     if (
  //       this.updatePatient.preOp === null ||
  //       this.updatePatient.preOp === ""
  //     ) {
  //       this.patientDetails.preop = "";
  //     } else {
  //       this.patientDetails.preop = this.updatePatient.preOp.toString();
  //     }
  //   } else {
  //     this.patientDetails.preop = moment
  //       .duration(start.diff(end))
  //       .asDays()
  //       .toString();
  //   }
  // }

  // **** Set final values from selected Form Values to be submitted ****
  getDetails() {
    this.patientDetails.hospitalID = this.patientDetails.hospitalID.toString();
    this.patientDetails.birthWeight = this.patientDetails.birthWeight.toString();
    this.patientDetails.procedureTypesId = this.patientDetails.procedureTypesId.toString();
    if (this.patientType === "add" || this.patientType === "update") {
      this.patientDetails.admitDate = moment(
        this.patientDetails.admitDate
      ).format("MM-DD-YYYY");
    } else {
      this.patientDetails.admitDate = "";
    }

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

    if (this.patientDetails.induced !== "true") {
      this.patientDetails.inducedReason = "";
    }

    if (this.patientDetails.babyInfo === "3") {
      this.patientDetails.babyInfo = this.patientDetails.babyInfo.toString();
    } else {
      if (this.patientDetails.babyInfo !== "") {
        this.patientDetails.babyInfo = this.patientDetails.babyInfo.toString();
      } else {
        this.patientDetails.babyInfo = "";
      }
    }

    this.patientDetails.surgeryDate = moment(
      this.patientDetails.surgeryDate
    ).format("MM-DD-YYYY");

    console.log(this.patientDetails);
  }

  // **** On Save Button Click ****
  savePatientDetails() {
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
    } else if (this.patientDetails.admitDate === "") {
      this.appService.warning("!Warning", "Please Fill Date Of Admit.");
    } else if (this.patientDetails.desc === "") {
      this.appService.warning("!Warning", "Please enter Pertinent Info");
    } else {
      console.log("this.patientType...", this.patientType);
      if (this.patientType === "update") {
        this.updatePatientForm();
      } else if (this.patientType === "add") {
        this.submitPatientDetails();
      } else {
        this.submitPatientDetails();
      }
    }
  }

  // **** Submit --ADD  Patient Details - API Call ****
  submitPatientDetails() {
    this.getDetails();

    Object.keys(this.patientDetails).forEach(
      (key) =>
        (this.patientDetails[key] === null ||
          this.patientDetails[key] === "") &&
        delete this.patientDetails[key]
    );
    console.log(this.patientDetails);

    // this.appService.showLoader();
    this.homeService
      .submitPatientDetails("patient/addpat", this.patientDetails)
      .subscribe((data) => {
        // console.log(data.data);
        // this.appService.hideLoader();
        if (data) {
          this.appService.success("Success", "OB Patient Add Successfully.");
          if (this.patientType === "add" || this.patientType === "update") {
            //this.router.navigateByUrl("/ob-patients");
            this.patientsTypeSelection();
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

  // **** Submit -- Update  Patient Details - API Call ****
  updatePatientForm() {
    this.getDetails();
    console.log("Inside,,,updatePatientForm");
    // *** UserId ***
    this.patientDetails[
      "userId"
    ] = this.updatePatient.mstUsers.userId.toString();
    // *** patientDetailsId ***
    this.patientDetails["patientDetailsId"] = this.updatePatient.id.toString();

    // Update Details
    this.homeService
      .updatePatientDetails("patient/updatePatient", this.patientDetails)
      .subscribe((data) => {
        console.log(data);

        if (data) {
          this.appService.success("Success", "OB Patient Update Successfully.");
          if (this.patientType === "add" || this.patientType === "update") {
            //this.router.navigateByUrl("/ob-patients");
            this.patientsTypeSelection();
          } else {
            this.router.navigateByUrl("addschedulerappointment");
          }
        } else if (!data) {
          this.goToLoginScreen();
        } else {
          this.appService.error("!Error", "");
        }
      });
  }

  // **** Fill Details in the form, for Patient to be edited ****
  fillEditPatientFormDetails() {
    // *** First Name - Last Name ***
    this.patientDetails.fname = this.updatePatient.mstUsers.firstName;
    this.patientDetails.lname = this.updatePatient.mstUsers.lastName;

    // *** Room No ***
    if (this.updatePatient.roomNumber) {
      this.patientDetails.roomNo = this.updatePatient.roomNumber;
    }
    // *** Hospital ID ***
    this.patientDetails.hospitalID = this.updatePatient.hospital.id;

    // *** Procedures ***
    console.log(this.updatePatient.patientProceduresList);
    if (
      this.updatePatient.patientProceduresList &&
      this.updatePatient.patientProceduresList.length
    ) {
      this.updatePatient.patientProceduresList.forEach((proce, index) => {
        this.selectedGYNProcedure.push(proce.procedureTypes.id);
        if (index === 0) {
          this.selectedOBProcedure = proce.procedureTypes.id;
          this.patientDetails.procedureTypesId = proce.procedureTypes.id.toString();
        } else {
          this.patientDetails.procedureTypesId =
            this.patientDetails.procedureTypesId +
            "," +
            proce.procedureTypes.id.toString();
        }
      });
    }
    console.log(this.patientDetails.procedureTypesId);
    console.log(this.selectedGYNProcedure);
    // *** Admit Date ***
    if (this.updatePatient.admittedDate) {
      this.patientDetails.admitDate = moment(
        this.updatePatient.admittedDate
      ).format("YYYY-MM-DD");
    }

    console.log("admitDate", this.patientDetails.admitDate);

    // ********************** OB ***********************

    // *** LMP - EDD ***
    if (this.updatePatient.lmp) {
      this.patientDetails.lmp = moment(this.updatePatient.lmp).format(
        "YYYY-MM-DD"
      );
    }
    if (this.updatePatient.edd) {
      this.patientDetails.edd = moment(this.updatePatient.edd).format(
        "YYYY-MM-DD"
      );
    }
    console.log("lmp", this.patientDetails.lmp);
    console.log("edd", this.patientDetails.edd);

    // *** Postpartum Date ***
    if (this.updatePatient.postDate) {
      this.patientDetails.postpartumDate = moment(
        this.updatePatient.postDate
      ).format("YYYY-MM-DD");

      const oDate = moment(
        moment(this.patientDetails.postpartumDate).format("YYYY-MM-DD")
      );
      const todaysDate = moment(moment(new Date()).format("YYYY-MM-DD"));
      const diffDays = oDate.diff(todaysDate, "days");

      this.patientDetails.postpartumDay = diffDays;
    }

    // **** gage => weeks | days ****
    if (this.updatePatient.gage) {
      const gabs = this.updatePatient.gage.split("|");

      this.gsWeeks = gabs[0];
      this.gsDays = gabs[1];

      this.patientDetails.gage = this.updatePatient.gage;
    }

    if (this.updatePatient.induced !== null) {
      if (this.updatePatient.induced) {
        this.patientDetails.induced = "true";
      } else {
        this.patientDetails.induced = "false";
      }
    }

    // **** gbs => +ve | -ve | Unknown ****
    if (this.updatePatient.gbs === null || this.updatePatient.gbs === "") {
      this.patientDetails.gbs = "";
    } else {
      this.patientDetails.gbs = this.updatePatient.gbs;
    }

    // ********* C-Section **************

    if (this.updatePatient.pcrList && this.updatePatient.pcrList.length) {
      this.updatePatient.pcrList.forEach((proce, index) => {
        this.selectedCSectionReason.push(proce.csReason.id);
        if (index === 0) {
          this.patientDetails.csecReason = proce.csReason.id.toString();
        } else {
          this.patientDetails.csecReason =
            this.patientDetails.csecReason + "," + proce.csReason.id.toString();
        }
      });
    }

    if (
      this.updatePatient.patientProceduresList &&
      this.updatePatient.patientProceduresList.length
    ) {
      this.updatePatient.patientProceduresList.forEach((proce, index) => {
        this.selectedGYNProcedure.push(proce.procedureTypes.id);
        if (index === 0) {
          this.selectedOBProcedure = proce.procedureTypes.id;
          this.patientDetails.procedureTypesId = proce.procedureTypes.id.toString();
        } else {
          this.patientDetails.procedureTypesId =
            this.patientDetails.procedureTypesId +
            "," +
            proce.procedureTypes.id.toString();
        }
      });
    }

    // *** Mode ***
    console.log(this.cpModeList);
    console.log(this.updatePatient.pcpmList);
    if (this.updatePatient.pcpmList && this.updatePatient.pcpmList.length > 0) {
      this.updatePatient.pcpmList.forEach((proce) => {
        this.cpModeList.forEach((mode) => {
          if (proce.cpMode.id === mode.id) {
            mode.isChecked = true;
          }
        });
      });
    }

    // **** Induced Reason ****
    if (this.updatePatient.pirList && this.updatePatient.pirList.length > 0) {
      this.updatePatient.pirList.forEach((pir) => {
        this.inReason.forEach((resion) => {
          if (pir.ir.id === resion.id) {
            resion.isChecked = true;
          }
          if (pir.ir.irName === "Other") {
            //this.reasonInducedType = pir.ir.irName;
            this.patientDetails.inducedReasonOthers = pir.inducedReasonOthers;
          }
        });
      });
    }

    // **** GTPAL ****
    if (this.updatePatient.gsPs === null || this.updatePatient.gsPs === "") {
      this.patientDetails.gsps = "";
    } else {
      this.patientDetails.gsps = this.updatePatient.gsPs;
      const gbs = this.updatePatient.gsPs.split("|");
      if (gbs.length === 5) {
        this.gspsg = gbs[0];
        this.gspst = gbs[1];
        this.gspsp = gbs[2];
        this.gspsa = gbs[3];
        this.gspsl = gbs[4];
      } else if (gbs.length === 4) {
        this.gspsg = gbs[0];
        this.gspst = gbs[1];
        this.gspsp = gbs[2];
        this.gspsa = gbs[3];
      } else if (gbs.length === 3) {
        this.gspsg = gbs[0];
        this.gspst = gbs[1];
        this.gspsp = gbs[2];
      } else if (gbs.length === 2) {
        this.gspsg = gbs[0];
        this.gspst = gbs[1];
      } else if (gbs.length === 1) {
        this.gspsg = gbs[0];
      }
    }

    // ************* Baby Info *****************
    if (this.updatePatient.babyInfo) {
      if (
        this.updatePatient.babyInfo === 1 ||
        this.updatePatient.babyInfo === 2
      ) {
        this.patientDetails.babyInfo = this.updatePatient.babyInfo.toString();
      } else {
        this.patientDetails.babyInfo = "3";
        this.patientDetails.babyOtherInfo =
          this.updatePatient.babyInfo.toString() || "";
      }
    }

    // Birth Weight
    if (this.updatePatient.birthWeight) {
      this.patientDetails.birthWeight = this.updatePatient.birthWeight;
    }

    // Birth Date
    if (this.updatePatient.babyBirthDate) {
      this.patientDetails.babyBirthDate = moment(
        this.updatePatient.babyBirthDate
      ).format("YYYY-MM-DD");
    }

    // Baby Gender
    if (this.updatePatient.babyGender) {
      this.patientDetails.babyGender = this.updatePatient.babyGender;
    }

    // NICU
    if (this.updatePatient.nicu !== null) {
      if (this.updatePatient.nicu) {
        this.patientDetails.nicu = "true";
      } else {
        this.patientDetails.nicu = "false";
      }
    }

    // APGAR
    if (this.updatePatient.apgar === null || this.updatePatient.apgar === "") {
      this.patientDetails.apgar = "";
    } else {
      this.patientDetails.apgar = this.updatePatient.apgar;
    }

    // Live Birth
    if (this.updatePatient.liveBirth !== null) {
      if (this.updatePatient.liveBirth) {
        this.patientDetails.liveBirth = "true";
      } else {
        this.patientDetails.liveBirth = "false";
      }
    }

    // Vertex
    if (this.updatePatient.vertex !== null) {
      if (this.updatePatient.vertex) {
        this.patientDetails.vertex = "true";
      } else {
        this.patientDetails.vertex = "false";
      }
    }

    // *********************** GYN ****************************

    // *** Date of Surgery ***
    if (this.updatePatient.surgeryDate) {
      this.patientDetails.surgeryDate = moment(
        this.updatePatient.surgeryDate
      ).format("YYYY-MM-DD");
    }

    // *** performingSurgeon ***
    if (this.updatePatient.performingSurgeon) {
      this.patientDetails.surgeon = this.updatePatient.performingSurgeon;
    }

    // *** Pre-Op Diagnosis ***
    if (this.updatePatient.preOp) {
      this.patientDetails.preop = this.updatePatient.preOp.toString();
    }
    // *** EBL ***
    if (this.updatePatient.ebl) {
      this.patientDetails.ebl = this.updatePatient.ebl;
    }

    // *** Complications ***
    if (this.updatePatient.complications) {
      this.patientDetails.complications = this.updatePatient.complications;
    }

    // *** Foley Catheter ***
    if (this.updatePatient.fcm) {
      this.patientDetails.fcm = this.updatePatient.fcm;
    }

    // *** postOpAntibiotics ***
    this.patientDetails.postop = this.updatePatient.postOpAntibiotics;
    console.log(this.updatePatient.patientPertinentInfoList);

    // ********* Appointment Dates *******************
    this.patientDetails.appointmentStartTime = this.updatePatient.appointmentDate;

    // ********* Pertinent Info *******************
    this.patientPertinentInfoList =
      (this.updatePatient.patientPertinentInfoList &&
        this.updatePatient.patientPertinentInfoList[0]) ||
      [];
  }
}
