import { Component } from "@angular/core";
import { HomeService } from "../../services/home.service";
import { NotificationService } from "../../notification/notification.service";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { DataSource } from "@angular/cdk/collections";
import { AlertDialogComponent } from "../alert-dialog/alert-dialog.component";
import { MatDialogRef, MatDialog, MatDialogConfig } from "@angular/material";
declare var moment: any;

@Component({
  selector: "app-add-ob-patients",
  styleUrls: ["./addobpatient.component.scss"],
  templateUrl: "./addobpatient.component.html",
})
export class AddobpatientComponent {
  patientDetails = {
    medical_group_id: localStorage.getItem("medical_group_id"),
    first_name: "",
    last_name: "",
    room_number: "",
    hospital_id: "",
    patient_type_id: "1", //1,2
    gbs: "", // 0,1,2,3
    admitted_date: "",

    procedure_id: [],

    //OB - Antepartum
    lmp: "",
    edd: "",

    // OB- Postpartum
    postpartum_date: "",
    postpartum_day: "",

    //OB - C-Section
    c_section_id: [], //[]
    csection_reason_other: "",
    cp_mode_id: [],
    induced: "",
    ir_id: [],
    induced_reason_others: "",
    //Baby Info
    baby: {
      baby_info: "",
      baby_other_info: 0,
      baby_list: [],
    },

    gage: "", // Weeks|Days
    gravida: 0,
    term: 0,
    preterm: 0,
    abortions: 0,
    living: 0,
    pertinent_info: "",
    // //Baby Info
    babyInfo: "",
    babyOtherInfo: "",
    birthWeight: "",
    babyBirthDate: "",
    babyGender: "",
    nicu: "",
    apgar: "",
    liveBirth: "",
    vertex: "",

    // GYN
    other_procedure: "",
    surgery_date: "",
    performing_surgeon: "",
    ebl: "",
    complications: "",
    fcm: "",
    pre_op: "",
    post_op_antibiotics: "",
    appointmentStartTime: "",
    appointmentEndTime: "",
  };

  // *** Field Options List ***
  hospitalList = []; // Hospital
  procedureList = []; // Procedure
  csectionReasonList = []; // C-Section Reason
  cpModeList = []; // C-Section Mode
  inReason = []; // Induced Reason
  gList = [];
  gspsList = [];
  gsWeeksList = [];
  gsDaysList = [];

  // **** Min and Max Dates for Datepicker ****
  admitMinDate: any;
  admitMaxDate: any;
  lmpMaxDate: any;
  postPartumMinDate: any;
  postPartumMaxDate: any;
  maxBirthDate: any;
  minBirthDate: any;
  dateOfSurgeryMinDate: any;
  dateOfSurgeryMaxDate: any;

  // *** Selected Field Values ***
  procedureName = "";
  selectedOBProcedure: any;
  selectedGYNProcedure = [];
  selectedCSectionReason = [];
  patientPertinentInfoList = [];
  isOtherir_id = false;
  isCSectionOthrReason = false;
  isOtherGYNProcedureSelected = false;
  isOtherInducedReason = false;
  patientType: any; // add or update
  patientStatus: any; //census or discharged
  gsDays: any;
  gsWeeks: any;
  gspsg = "";
  gspst = "";
  gspsp = "";
  gspsa = "";
  gspsl = "";

  updatePatient: any;
  panelOpenState = false;

  displayedColumns = ["firstName", "updatedDate", "pertinentInfo"];
  dataSource = new ExampleDataSource(this.patientPertinentInfoList);

  constructor(
    private homeService: HomeService,
    protected appService: NotificationService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute // private pickerController: PickerController
  ) {
    this.patientType = "add";

    // *** Set medical_group_id ***
    const medical_group_id = localStorage.getItem("medical_group_id");
    this.patientDetails.medical_group_id = medical_group_id;

    // *** Get Details from Route queryParams - for Update ***
    this.route.queryParams.subscribe((params) => {
      //patientStatus

      if (this.router.getCurrentNavigation().extras.state) {
        console.log(this.router.getCurrentNavigation().extras.state);
        this.patientType = this.router.getCurrentNavigation().extras.state.patientType;
        this.patientStatus = this.router.getCurrentNavigation().extras.state.patientStatus;
        this.updatePatient = this.router.getCurrentNavigation().extras.state.patientDetails;
        if (this.updatePatient.patient_type_id) {
          this.patientDetails.patient_type_id = this.updatePatient.patient_type_id.toString();
        }
      }
    });

    this.getPatientCateogoryValues();
  }
  public constructDialog<T>(
    TCtor: new (...args: any[]) => T,
    data: any
  ): MatDialogRef<T, any> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(TCtor, dialogConfig);
    return dialogRef;
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

  /************* Fetch Dropdown Options for: ****************
   *  - Procedures
   *  - C-Section:
   *    - Reason List
   *    - Mode
   *  - Induced Reason
   */
  getDropdownOptionsList(patient_type_id) {
    console.log("Into getDropdownOptionsList");
    // this.appService.showLoader();
    this.patientDetails.procedure_id = [];
    this.homeService
      .fetchDropdownOptionsList(patient_type_id)
      .then((data: any) => {
        console.log(data);
        if (data.status) {
          // this.appService.hideLoader();
          this.hospitalList = data.hospitalList;
          this.procedureList = data.procedureList;
          this.csectionReasonList = data.csectionReasonList;
          this.cpModeList = data.cpModeList;
          this.inReason = data.inducedReasonList;

          this.cpModeList.forEach((mode) => {
            mode.isChecked = false;
          });

          this.inReason.forEach((reason) => {
            reason.isChecked = false;
          });

          // *** Fill Details in the Form - for patient to update ***
          if (this.patientType === "update") {
            this.fillEditPatientFormDetails();
          }
        } else if (!data.status) {
          //this.goToLoginScreen();
        } else {
          this.openMessageDialog("Error while Fetching Dropdown Options.");
        }
      });
  }

  // **** Get Dropdown Option and Min and Max Dates ****
  getPatientCateogoryValues() {
    console.log("Into getPatientCateogoryValues");
    this.getDropdownOptionsList(this.patientDetails.patient_type_id);

    // **** Min and Max Dates for Datepicker ****

    const todaysDate = moment(Date.now()).format("YYYY-MM-DD");

    // Admit Dates
    const admindate = moment(Date.now()).subtract(30, "days");
    this.admitMinDate = moment(admindate).format("YYYY-MM-DD");
    this.admitMaxDate = todaysDate;
    // OB fields
    if (this.patientDetails.patient_type_id === "1") {
      // *** Set Options List in Dropdowns ***
      this.gList = Array.from({ length: 21 }, (v, k) => k.toString());
      this.gspsList = Array.from({ length: 16 }, (v, k) => k.toString());
      this.gsWeeksList = Array.from({ length: 43 }, (v, k) => k.toString());
      this.gsDaysList = Array.from({ length: 7 }, (v, k) => k.toString());

      // OB -LMP -max date
      this.lmpMaxDate = todaysDate;

      // OB - Postpartum Min Date
      this.postPartumMaxDate = todaysDate;
      const postPartumMin = moment(Date.now()).subtract(5, "days");
      this.postPartumMinDate = moment(postPartumMin).format("YYYY-MM-DD");

      // Set Default postpartum_date
      this.patientDetails.postpartum_date = todaysDate;

      // Set Default postpartum_day
      const oDate = moment(this.patientDetails.postpartum_date);
      const diffDays = moment(todaysDate).diff(oDate, "days");
      this.patientDetails.postpartum_day = Math.abs(diffDays).toString();

      // Baby BirthDate
      this.maxBirthDate = todaysDate;
      const birthDateMin = moment(Date.now()).subtract(5, "days");
      this.minBirthDate = moment(birthDateMin).format("YYYY-MM-DD");
    } else if (this.patientDetails.patient_type_id === "2") {
      // GYN - Date of Surgery - Min Date
      const surgeryMinDate = moment(Date.now()).subtract(30, "days");
      this.dateOfSurgeryMinDate = moment(surgeryMinDate).format("YYYY-MM-DD");
      this.dateOfSurgeryMaxDate = todaysDate;
      // Set current date as  default value for surgery_date
      this.patientDetails.surgery_date = todaysDate;
    }
    //this.patientDetails = { ...this.updatePatient };
  }

  update(el: any, pertinentInfo: string) {
    console.log(el);
    console.log("pertinentInfo...", pertinentInfo);
    if (pertinentInfo == null) {
      return;
    }

    const pertinentInfoUpdate = {
      token: localStorage.getItem("deviceToken"),
      pertinentInfo: pertinentInfo,
      patientPertinentInfoId: el.patientPertinentInfoId,
    };

    // Update Details
    this.homeService
      .updatePatientPertinentInfo(pertinentInfoUpdate)
      .subscribe((data) => {
        console.log(data);
      });

    // copy and mutate
    const copy = this.dataSource.data().slice();
    console.log(copy);
    el.pertinentInfo = pertinentInfo;
    this.dataSource.update(copy);
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

  // ************ Fields On Change Handlers ***************

  // *** Hospital Change ***
  handleHospitalChange(event: any) {
    this.patientDetails.hospital_id = event;
  }

  // *** OB - C-Section Mode Change ***
  handleModeChange() {
    console.log(this.cpModeList);
    this.patientDetails.cp_mode_id = this.cpModeList
      .filter((val) => val.isChecked)
      .map((val) => {
        return val.mode_id;
      });
  }

  // *** Patient Type ***
  onPatientTypeChange() {
    this.getDropdownOptionsList(this.patientDetails.patient_type_id);
  }

  // *** Procedure ***
  onProcedureChange(event: any) {
    if (this.patientDetails.patient_type_id === "1") {
      this.procedureList.forEach((val) => {
        if (val.procedure_id === this.patientDetails.procedure_id) {
          this.procedureName = val.procedure_name;
        }
      });
    } else if (this.patientDetails.patient_type_id === "2") {
      this.patientDetails.procedure_id = event.target.value;
      this.isOtherGYNProcedureSelected = false;
      this.procedureList.some((val) => {
        if (
          event.target.value.includes(val.procedure_id) &&
          val.procedure_name === "Other"
        ) {
          console.log("Other found");
          this.isOtherGYNProcedureSelected = true;
          return true;
        }
      });
    }
  }

  onInducedReasonChange(item: any) {
    console.log(item);
    this.patientDetails.ir_id = this.inReason
      .filter((val) => val.isChecked)
      .map((val) => {
        if (!this.isOtherInducedReason && val.ir_name === "Other") {
          this.isOtherInducedReason = true;
        } else if (this.isOtherInducedReason && val.ir_name !== "Other") {
          this.isOtherInducedReason = false;
        }
        return val.ir_id;
      });
  }

  // *** Admit Date ***
  updateadmitted_date(event: any) {
    this.patientDetails.admitted_date = moment(event).format("YYYY-MM-DD");
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
      //this.appService.error("!Warning", "The LMP should not be after today.");
      this.openMessageDialog("The LMP should not be after today.");
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
      //this.appService.warning("!Warning", "The EDD should not be before week.");
      this.openMessageDialog("The EDD should not be before week.");
    }
  }

  // **** Postpartum Date Change ****
  updatePostPatumDate(event: any) {
    //this.patientDetails.pre_op = moment(event).format("YYYY-MM-DD");
    this.patientDetails.postpartum_date = moment(event.target.value).format(
      "YYYY-MM-DD"
    );
    const oDate = moment(moment(event.target.value).format("YYYY-MM-DD"));
    const todaysDate = moment(moment(new Date()).format("YYYY-MM-DD"));
    const diffDays = oDate.diff(todaysDate, "days");

    this.patientDetails.postpartum_day = diffDays;
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

    this.patientDetails.gage = this.gsWeeks + "|" + this.gsDays;
  }

  // **** Baby: Birth Date ****
  onBabyInfoChange(value) {
    console.log("onBabyInfoChange...", value);
    console.log("Before List...", this.patientDetails.baby.baby_list);
    if (!isNaN(value)) {
      if (value > this.patientDetails.baby.baby_list.length) {
        for (
          let i = this.patientDetails.baby.baby_list.length;
          i < value;
          i++
        ) {
          this.patientDetails.baby.baby_list.push({
            baby_id: i + 1,
            birth_weight: "",
            baby_birth_date: "",
            baby_gender: "",
            nicu: "",
            apgar: "",
            live_birth: "",
            vertex: "",
            open: false,
          });
        }
      } else {
        this.patientDetails.baby.baby_list = this.patientDetails.baby.baby_list.slice(
          0,
          value
        );
      }
      this.patientDetails.baby.baby_list[0].open = true;
    }
    console.log("After List...", this.patientDetails.baby.baby_list);
  }

  //*************** GYN Fields *****************/

  setpre_opDiagnosis(value) {
    const surgery_date = moment(moment(value).format("YYYY-MM-DD"));
    const todaysDate = moment(moment(new Date()).format("YYYY-MM-DD"));
    const diffDays = surgery_date.diff(todaysDate, "days");
    this.patientDetails.pre_op = diffDays;
  }

  handlesurgery_dateChange(event: any) {
    console.log(event);
    this.patientDetails.surgery_date = moment(event.target.value).format(
      "YYYY-MM-DD"
    );

    this.setpre_opDiagnosis(this.patientDetails.surgery_date);
  }

  // **** Set final values from selected Form Values to be submitted ****
  getDetails() {
    // *** Admit Date ***
    if (this.patientType === "add" || this.patientType === "update") {
      if (this.patientDetails.admitted_date) {
        this.patientDetails.admitted_date = moment(
          this.patientDetails.admitted_date
        ).format("MM-DD-YYYY");
      }
    } else {
      this.patientDetails.admitted_date = "";
    }

    //*** LMP ****
    if (this.patientDetails.lmp !== "") {
      this.patientDetails.lmp = moment(this.patientDetails.lmp).format(
        "MM-DD-YYYY"
      );
    }
    //*** EDD ****
    if (this.patientDetails.edd !== "") {
      this.patientDetails.edd = moment(this.patientDetails.edd).format(
        "MM-DD-YYYY"
      );
    }
    //*** Postpartum Date ****
    if (this.patientDetails.postpartum_date !== "") {
      this.patientDetails.postpartum_date = moment(
        this.patientDetails.postpartum_date
      ).format("MM-DD-YYYY");
    }
  }

  // **** On Save Button Click ****
  savePatientDetails() {
    if (
      this.patientDetails.first_name.length <= 2 ||
      this.patientDetails.first_name === ""
    ) {
      this.openMessageDialog(
        "Please enter at least 3 characters in FirstName."
      );
    } else if (this.patientDetails.first_name.length > 20) {
      this.openMessageDialog(
        "Please enter no more than 15 characters in FirstName."
      );
    } else if (this.patientDetails.last_name.length > 20) {
      this.openMessageDialog(
        "Please enter no more than 15 characters in LastName."
      );
    } else if (
      this.patientDetails.last_name.length <= 2 ||
      this.patientDetails.last_name === ""
    ) {
      this.openMessageDialog("Please enter at least 3 characters in LastName.");
    } else if (this.patientDetails.room_number === "") {
      this.openMessageDialog("Please enter Room Number");
    } else if (this.patientDetails.hospital_id === "") {
      this.openMessageDialog("Please select Hospital");
    } else if (!this.patientDetails.procedure_id.length) {
      this.openMessageDialog("Please select Procedure");
    } else if (
      this.patientDetails.admitted_date === "" &&
      this.patientDetails.appointmentStartTime === "" &&
      this.patientDetails.appointmentEndTime === ""
    ) {
      this.openMessageDialog("Please Fill Date Of Admit or Appointment Date.");
    } else if (this.patientDetails.pertinent_info === "") {
      this.openMessageDialog("Please enter Pertinent Info");
    } else {
      console.log("this.patientType...", this.patientType);
      if (this.patientType === "update") {
        this.updatePatientDetails();
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

    this.homeService
      .submitPatientDetailsNew(environment.api.createPatientNew, {
        ...this.patientDetails,
        patient_type_id: Number(this.patientDetails.patient_type_id),
        procedure_id: !Array.isArray(this.patientDetails.procedure_id)
          ? [this.patientDetails.procedure_id]
          : [...this.patientDetails.procedure_id],
      })
      .then((data: any) => {
        if (data.status) {
          this.openMessageDialog("OB Patient Add Successfully.");
          if (this.patientType === "add" || this.patientType === "update") {
            this.patientsTypeSelection();
          } else {
            this.router.navigateByUrl("addschedulerappointment");
          }
        } else if (!data) {
          this.goToLoginScreen();
        } else {
          this.openMessageDialog("Error while Adding Patient.");
        }
      });
  }

  // **** Submit -- Update  Patient Details - API Call ****
  updatePatientDetails() {
    this.getDetails();
    console.log("Inside,,,updatePatientDetails");
    // *** patient_id ***
    this.patientDetails["patient_id"] = this.updatePatient.patient_id;

    // // *** patientDetailsId ***
    // this.patientDetails["patientDetailsId"] = this.updatePatient.id.toString();

    // Update Details
    this.homeService
      .updatePatientDetailsNew(environment.api.createPatientNew, {
        ...this.patientDetails,
        patient_type_id: Number(this.patientDetails.patient_type_id),
        procedure_id: !Array.isArray(this.patientDetails.procedure_id)
          ? [this.patientDetails.procedure_id]
          : [...this.patientDetails.procedure_id],
      })
      .then((data: any) => {
        if (data.status) {
          this.openMessageDialog("OB Patient Update Successfully.");
          if (this.patientType === "add" || this.patientType === "update") {
            this.patientsTypeSelection();
          } else {
            this.router.navigateByUrl("addschedulerappointment");
          }
        } else if (!data) {
          this.goToLoginScreen();
        } else {
          this.openMessageDialog("Error while Update Patient.");
        }
      });
  }

  openCommentPopUp(popover, pertinentInfo) {
    console.log(pertinentInfo);
    if (
      JSON.parse(localStorage.getItem("userData")).user_id !==
      pertinentInfo.user_id
    ) {
      return false;
    }
    popover.open();
  }

  // **** Fill Details in the form, for Patient to be edited ****
  fillEditPatientFormDetails() {
    // *** First Name - Last Name ***
    this.patientDetails.first_name = this.updatePatient.first_name;
    this.patientDetails.last_name = this.updatePatient.last_name;

    // *** Room No ***
    if (this.updatePatient.room_number) {
      this.patientDetails.room_number = this.updatePatient.room_number;
    }
    // *** Hospital ID ***
    this.patientDetails.hospital_id = this.updatePatient.hospital_id;

    // *** Admit Date ***
    if (this.updatePatient.admitted_date) {
      this.patientDetails.admitted_date = moment(
        this.updatePatient.admitted_date
      ).format("YYYY-MM-DD");
    }

    // ********************** OB ***********************
    if (this.patientDetails.patient_type_id === "1") {
      // *** Procedures ***
      this.patientDetails.procedure_id = this.updatePatient.procedure_id[0];

      this.procedureList.forEach((val) => {
        if (val.procedure_id === this.patientDetails.procedure_id) {
          this.procedureName = val.procedure_name;
        }
      });

      // **** gbs => +ve | -ve | Unknown ****
      this.patientDetails.gbs = this.updatePatient.gbs;

      // *** Induced ***
      this.patientDetails.induced = this.updatePatient.induced;

      // **** Induced Reason ****
      this.patientDetails.ir_id = this.updatePatient.ir_id;

      if (this.updatePatient.ir_id.length) {
        this.inReason.forEach((reason) => {
          if (this.updatePatient.ir_id.includes(reason.ir_id)) {
            reason.isChecked = true;
            if (reason.ir_name === "Other") {
              this.patientDetails.induced_reason_others = this.updatePatient.induced_reason_others;
              this.isOtherInducedReason = true;
            }
          }
        });
      }

      // ************** Antepartum / Intrapartum **************
      // *** LMP ***
      if (this.updatePatient.lmp) {
        this.patientDetails.lmp = moment(this.updatePatient.lmp).format(
          "YYYY-MM-DD"
        );
      }
      // *** EDD ***
      if (this.updatePatient.edd) {
        this.patientDetails.edd = moment(this.updatePatient.edd).format(
          "YYYY-MM-DD"
        );
      }

      // **** Gestational Age(gage) => weeks | days ****
      if (this.updatePatient.gage) {
        const gabs = this.updatePatient.gage.split("|");

        this.gsWeeks = gabs[0];
        this.gsDays = gabs[1];

        this.patientDetails.gage = this.updatePatient.gage;
      }

      // ************** Postpartum **************
      // *** Postpartum Date ***
      if (this.updatePatient.postpartum_date) {
        this.patientDetails.postpartum_date = moment(
          this.updatePatient.postpartum_date
        ).format("YYYY-MM-DD");

        const oDate = moment(
          moment(this.patientDetails.postpartum_date).format("YYYY-MM-DD")
        );
        const todaysDate = moment(moment(new Date()).format("YYYY-MM-DD"));
        const diffDays = oDate.diff(todaysDate, "days");

        this.patientDetails.postpartum_day = Math.abs(diffDays).toString();
      }

      // *** Mode ***

      if (this.updatePatient.cp_mode_id.length) {
        this.cpModeList.forEach((mode) => {
          if (this.updatePatient.cp_mode_id.includes(mode.mode_id)) {
            mode.isChecked = true;
          }
        });
      }

      // ********* C-Section **************
      this.patientDetails.c_section_id = this.updatePatient.c_section_id;

      if (this.updatePatient.c_section_id.length) {
        this.csectionReasonList.forEach((section) => {
          if (this.updatePatient.c_section_id.includes(section.reason_id)) {
            section.isChecked = true;
          }
        });
      }

      // ************* G's and P's ********************
      this.patientDetails.gravida = this.updatePatient.gravida.toString();
      this.patientDetails.term = this.updatePatient.term.toString();
      this.patientDetails.preterm = this.updatePatient.preterm.toString();
      this.patientDetails.abortions = this.updatePatient.abortions.toString();
      this.patientDetails.living = this.updatePatient.living.toString();

      // ************* Baby Info ************************
      this.patientDetails.baby = { ...this.updatePatient.baby[0] };

      if (
        this.patientDetails.baby &&
        this.patientDetails.baby.baby_list &&
        this.patientDetails.baby.baby_list.length
      ) {
        this.patientDetails.baby.baby_list.forEach((val) => {
          val.open = false;
        });
        this.patientDetails.baby.baby_list[0].open = true;
      }
    } else if (this.patientDetails.patient_type_id === "2") {
      console.log(this.updatePatient);
      // ***** Procedure ****
      this.patientDetails.procedure_id = [...this.updatePatient.procedure_id];
      this.patientDetails.other_procedure = this.updatePatient.other_procedure;
      this.isOtherGYNProcedureSelected = false;
      this.procedureList.some((val) => {
        if (
          this.patientDetails.procedure_id.includes(val.procedure_id) &&
          val.procedure_name === "Other"
        ) {
          console.log("Other found");
          this.isOtherGYNProcedureSelected = true;
          return true;
        }
      });

      // *********************** GYN ****************************
      // *** Date of Surgery ***
      if (this.updatePatient.surgery_date) {
        this.patientDetails.surgery_date = moment(
          this.updatePatient.surgery_date
        ).format("YYYY-MM-DD");
      }

      // *** performingSurgeon ***
      this.patientDetails.performing_surgeon = this.updatePatient.performing_surgeon;
      // *** EBL ***
      this.patientDetails.ebl = this.updatePatient.ebl;
      // *** Complications ***
      this.patientDetails.complications = this.updatePatient.complications;
      // *** Foley Catheter ***
      this.patientDetails.fcm = this.updatePatient.fcm;
      // *** Pre-Op Diagnosis ***
      this.patientDetails.pre_op = this.updatePatient.pre_op;
      // *** post_op_antibioticsAntibiotics ***
      this.patientDetails.post_op_antibiotics = this.updatePatient.post_op_antibiotics;

      // ********* Appointment Dates *******************
      this.patientDetails.appointmentStartTime = this.updatePatient.appointmentDate;
    }
    // ********* Pertinent Info *******************
    this.patientPertinentInfoList = this.updatePatient.pertinent_info_list;
    if (this.patientPertinentInfoList.length) {
      this.patientPertinentInfoList.forEach((val) => {
        val.open = false;
      });
      this.patientPertinentInfoList[0].open = true;
    }
    console.log(this.patientDetails);
    console.log(this.patientPertinentInfoList);
  }
}
export interface Element {
  firstName: string;
  updatedDate: string;
  pertinentInfo?: string;
}

export class ExampleDataSource extends DataSource<any> {
  private dataSubject = new BehaviorSubject<Element[]>([]);

  data() {
    console.log(this.dataSubject);
    return this.dataSubject.value;
  }

  update(data) {
    console.log(data);
    this.dataSubject.next(data);
  }

  constructor(data: any[]) {
    super();
    this.dataSubject.next(data);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Element[]> {
    return this.dataSubject;
  }

  disconnect() {}
}
