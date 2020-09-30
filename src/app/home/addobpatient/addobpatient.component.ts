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
  // physiciansList = ["Prac User 1", "Prac User 2"];
  // physicianName = "";

  selectedOBProcedure: any;
  selectedGYNProcedure = [];
  patientType: any; // add or update

  gsWeeksList = [];
  gsDaysList = [];
  gspsList = [];

  gsDays: any;
  gsWeeks: any;

  gspsg = "";
  gspst = "";
  gspsp = "";
  gspsa = "";
  gspsl = "";

  update = false;
  updatePatient: any;

  postPartumMinDate: any;
  postPartumMaxDate: any;
  admitMinDate: any;
  admitMaxDate: any;
  dateOfSurgeryMinDate: any;
  //gagsValue = "";
  //procUpdate = false;

  constructor(
    private homeService: HomeService,
    protected appService: NotificationService,
    private router: Router,
    private route: ActivatedRoute // private pickerController: PickerController
  ) {
    this.patientType = "add";

    this.postPartumMinDate = moment(Date.now()).format("YYYY-MM-DD");
    //this.postPartumMaxDate = moment(Date.now()).format("YYYY-MM-DD");

    const admindate = moment(Date.now()).subtract(30, "days");
    this.admitMinDate = moment(admindate).format("YYYY-MM-DD");
    this.admitMaxDate = moment(Date.now()).format("YYYY-MM-DD");
    this.gsWeeksList = Array.from({ length: 43 }, (v, k) => k.toString());
    this.gsDaysList = Array.from({ length: 7 }, (v, k) => k.toString());
    this.gspsList = Array.from({ length: 16 }, (v, k) => k.toString());
    this.dateOfSurgeryMinDate = moment(Date.now()).format("YYYY-MM-DD");

    this.getHospitals();
    const userData = JSON.parse(localStorage.getItem("userData"));
    this.patientDetails.groupName = userData.groupName;
    this.patientDetails.disclaimerAccept = userData.disclaimerAccept;
    if (userData.disclaimerAccept) {
      this.patientDetails.disclaimerAccept = "1";
    } else {
      this.patientDetails.disclaimerAccept = "0";
    }
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.patientType = this.router.getCurrentNavigation().extras.state.patientType;
        this.updatePatient = this.router.getCurrentNavigation().extras.state.patientDetails;
        this.getHospitals();
        console.log(this.updatePatient);
      }
    });
  }

  // ************ Page Navigation ****
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
    //console.log(item);
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
    // console.log("Inside..getHospitals.");

    this.homeService.fetchHospitals().subscribe((data) => {
      if (data && data._statusCode === "200") {
        this.hospitalList = data.data.hospitalList;
        //  console.log(this.hospitalList);
        this.getProcedures();
      } else if (!data) {
        // this.appService.hideLoader();
      } else {
        //  this.appService.hideLoader();
        // this.appService.alert('!Error', data.message);
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
        // this.homeService.fetchProcedures(1).pipe(map((data: any) => {
        // console.log(data.data);
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

          if (this.patientType === "update") {
            this.fillEditPatientFormDetails();
            this.update = true;
            //this.procUpdate = true;
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
    this.patientDetails.procedureTypesId = Array.isArray(value)
      ? value.join(",")
      : value;

    console.log(this.patientDetails.procedureTypesId);
  }

  // *** Admit Date ***
  updateAdmitDate(event: any) {
    this.patientDetails.admitDate = moment(event).format("YYYY-MM-DD");
  }

  // *** LMP Date Change ***
  updateLmpDate(event: any) {
    // console.log(this.patientDetails.lmp);
    const todaysDate = moment(new Date());
    const oDate = moment(event.target.value);
    const diffDays = todaysDate.diff(oDate, "days");
    let weeks = diffDays / 7;

    weeks = Math.abs(Math.round(weeks));
    let days = diffDays % 7;
    days = Math.abs(Math.round(days * 1) / 1);

    if (diffDays >= 0) {
      this.patientDetails.lmp = moment(event.target.value).format("YYYY-MM-DD");
      this.gsWeeks = weeks;
      this.gsDays = days;
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
      this.patientDetails.edd = moment(event.target.value).format("MM-DD-YYYY");
      console.log(weeks, days);
      this.gsWeeks = weeks;
      this.gsDays = days;
      const date = moment(event.target.value).subtract(280, "days");
      this.patientDetails.lmp = moment(date).format("MM-DD-YYYY");
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

  // **** Gestational Weeks & Days Change ****
  updateDatesOnWeeksChange() {
    const todaysDate = moment(new Date());
    this.patientDetails.lmp = moment(todaysDate)
      .subtract(this.gsWeeks, "weeks")
      .subtract(this.gsDays, "days")
      .format("MM-DD-YYYY");
    this.patientDetails.edd = moment(this.patientDetails.lmp)
      .add(280, "days")
      .format("MM-DD-YYYY");
  }

  // **** Baby: Birth Date ****
  updatebabyBirthDate(event: any) {
    this.patientDetails.babyBirthDate = moment(event).format("YYYY-MM-DD");
  }

  //*************** GYN Fields *****************/

  handleSurgeryDateChange(event: any) {
    console.log(event);
    this.patientDetails.surgeryDate = moment(event.target.value).format(
      "YYYY-MM-DD"
    );

    const oDate = moment(moment(event.target.value).format("YYYY-MM-DD"));
    const todaysDate = moment(moment(new Date()).format("YYYY-MM-DD"));
    const diffDays = oDate.diff(todaysDate, "days");
    this.patientDetails.preop = diffDays;
  }

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
      this.patientDetails.babyInfo = this.patientDetails.babyOtherInfo.toString();
    } else {
      if (this.patientDetails.babyInfo !== "") {
        this.patientDetails.babyInfo = this.patientDetails.babyInfo.toString();
      } else {
        this.patientDetails.babyInfo = "";
      }
    }

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
    } else {
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

  // **** Submit -- Update  Patient Details - API Call ****
  updatePatientForm() {
    this.getDetails();

    // *** UserId ***
    this.patientDetails[
      "userId"
    ] = this.updatePatient.mstUsers.userId.toString();
    // *** patientDetailsId ***
    this.patientDetails["patientDetailsId"] = this.updatePatient.id.toString();

    // Update Details
    this.homeService
      .submitPatientDetails("patient/updatePatient", this.patientDetails)
      .subscribe((data) => {
        console.log(data);
        // this.appService.hideLoader();
        if (data) {
          this.appService.success("Success", "OB Patient Update Successfully.");
          if (this.patientType === "add" || this.patientType === "update") {
            this.router.navigateByUrl("/ob-patients");
          } else {
            this.router.navigateByUrl("addschedulerappointment");
          }
        } else if (!data) {
          this.goToLoginScreen();
        } else {
          // this.appService.hideLoader();
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
    if (
      this.updatePatient.patientProceduresList &&
      this.updatePatient.patientProceduresList.length
    ) {
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

    // *** Admit Date ***
    if (this.updatePatient.admittedDate) {
      this.patientDetails.admitDate = moment(
        this.updatePatient.admittedDate
      ).format("YYYY-MM-DD");
    }
    console.log("admitDate", this.patientDetails.admitDate);
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
    }

    // **** gage ****
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

    if (this.updatePatient.gbs === null || this.updatePatient.gbs === "") {
      this.patientDetails.gbs = "";
    } else {
      this.patientDetails.gbs = this.updatePatient.gbs;
    }
    if (
      this.updatePatient.pcrList === null ||
      this.updatePatient.pcrList.length === 0
    ) {
      this.patientDetails.csecReason = "";
    } else {
      this.patientDetails.csecReason = this.updatePatient.pcrList[0].csReason.id.toString();
    }

    if (this.updatePatient.daysList && this.updatePatient.daysList.length) {
      this.updatePatient.daysList.forEach((info) => {
        const data = {
          expanded: false,
          arrowicon: "arrow-dropright-circle",
          date: info,
        };
        //this.infoList.push(data);
      });
    }

    if (this.updatePatient.preOp) {
      this.patientDetails.preop = this.updatePatient.preOp.toString();
    }

    if (this.updatePatient.pcpmList && this.updatePatient.pcpmList.length > 0) {
      this.updatePatient.pcpmList.forEach((proce) => {
        this.cpModeList.forEach((mode) => {
          if (proce.cpMode.id === mode.id) {
            mode.isChecked = true;
          }
        });
      });
    }

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
    console.log(this.gspsg);
    console.log(this.gspst);
    console.log(this.gspsp);
    console.log(this.gspsa);
    console.log(this.gspsl);
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

    if (this.updatePatient.birthWeight) {
      this.patientDetails.birthWeight = this.updatePatient.birthWeight;
    }

    if (this.updatePatient.babyBirthDate) {
      this.patientDetails.babyBirthDate = moment(
        this.updatePatient.babyBirthDate
      ).format("YYYY-MM-DD");
    }

    if (this.updatePatient.babyGender) {
      this.patientDetails.babyGender = this.updatePatient.babyGender;
    }

    if (this.updatePatient.nicu !== null) {
      if (this.updatePatient.nicu) {
        this.patientDetails.nicu = "true";
      } else {
        this.patientDetails.nicu = "false";
      }
    }

    if (this.updatePatient.apgar === null || this.updatePatient.apgar === "") {
      this.patientDetails.apgar = "";
    } else {
      this.patientDetails.apgar = this.updatePatient.apgar;
    }

    if (this.updatePatient.liveBirth !== null) {
      if (this.updatePatient.liveBirth) {
        this.patientDetails.liveBirth = "true";
      } else {
        this.patientDetails.liveBirth = "false";
      }
    }
    if (this.updatePatient.vertex !== null) {
      if (this.updatePatient.vertex) {
        this.patientDetails.vertex = "true";
      } else {
        this.patientDetails.vertex = "false";
      }
    }
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
}
