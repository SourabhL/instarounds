import {Component} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import {HomeService} from '../../services/home.service';
import {NotificationService} from '../../notification/notification.service';

declare var moment: any;
@Component({
  selector: 'app-add-gyn-patients',
  styleUrls: ['./addgynpatients.component.scss'],
  templateUrl: './addgynpatients.component.html'
})
export class AddgynpatientsComponent {
  babyAPGARLes = '<100 cc';
  babyAPGARGa = '>700 cc';
  customAlertOptions: any = {
    header: 'Choose One',
    translucent: true
  };
  hospitalList = [];
  procedureList = [];
  selectedProcedure = [];
  patientType: any;
  minDate: any;
  maxDate: any;
  admitMinDate: any;
  preopDiag = '';
  update = false;
  procUpdate = false;
  patientDetails = {
    token: localStorage.getItem('deviceToken'),
    fname: '',
    lname: '',
    roomNo: '',
    hospitalID: '',
    procedureTypesId: '',
    dos: '',
    surgeon: '',
    preop: '',
    ebl: '',
    complications: '',
    fcm: '',
    postop: '',
    desc: '',
    admitDate: '',
    groupName: '',
    patientTypeId: '2',
    disclaimerAccept: ''
  };
  updatePatient: any;
  infoList = [];
  constructor(private router: Router, private homeService: HomeService,
              private route: ActivatedRoute, protected appService: NotificationService) {
    this.minDate = moment(Date.now()).format('YYYY-MM-DD');
    this.maxDate = moment(Date.now()).format('YYYY-MM-DD');
    const admindate = moment(Date.now()).subtract(30, 'days');
    this.admitMinDate = moment(admindate).format('YYYY-MM-DD');
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.patientType = this.router.getCurrentNavigation().extras.state.patientType;
        this.updatePatient = this.router.getCurrentNavigation().extras.state.patientDetails;
        this.getHospitals();
        console.log(this.patientType);
        const userData = JSON.parse(localStorage.getItem('userData'));
        this.patientDetails.groupName = userData.groupName;
        this.patientDetails.disclaimerAccept = userData.disclaimerAccept;
        if (userData.disclaimerAccept) {
          this.patientDetails.disclaimerAccept = '1';
        } else {
          this.patientDetails.disclaimerAccept = '0';
        }
      }
    });
  }


  updatePatientDetails() {
    this.patientDetails.fname = this.updatePatient.mstUsers.firstName;
    this.patientDetails.lname = this.updatePatient.mstUsers.lastName;
    if (this.updatePatient.roomNumber === null || this.updatePatient.roomNumber === '') {
      this.patientDetails.roomNo = '';
    } else {
      this.patientDetails.roomNo = this.updatePatient.roomNumber;
    }
    this.patientDetails.hospitalID = this.updatePatient.hospital.id.toString();

    if (this.updatePatient.surgeryDate === null || this.updatePatient.surgeryDate === '') {
      this.patientDetails.dos = '';
    } else {
      this.patientDetails.dos = moment(this.updatePatient.surgeryDate).format('YYYY-MM-DD');
    }
    if (this.updatePatient.admittedDate === null || this.updatePatient.admittedDate === '') {
      this.patientDetails.admitDate = '';
    } else {
      this.patientDetails.admitDate = moment(this.updatePatient.admittedDate).format('YYYY-MM-DD');
    }
    if (this.updatePatient.performingSurgeon === null || this.updatePatient.performingSurgeon === '') {
      this.patientDetails.surgeon = '';
    } else {
      this.patientDetails.surgeon = this.updatePatient.performingSurgeon;
    }
    if (this.updatePatient.preOp === null || this.updatePatient.preOp === '') {
      this.patientDetails.preop = '';
      this.preopDiag = '';
    } else {
      this.patientDetails.preop = this.updatePatient.preOp.toString();
      this.preopDiag = this.updatePatient.preOp.toString();
    }
    if (this.updatePatient.ebl === null || this.updatePatient.ebl === '') {
      this.patientDetails.ebl = '';
    } else {
      this.patientDetails.ebl = this.updatePatient.ebl;
    }
    if (this.updatePatient.complications === null || this.updatePatient.complications === '') {
      this.patientDetails.complications = '';
    } else {
      this.patientDetails.complications = this.updatePatient.complications;
    }
    if (this.updatePatient.fcm === null || this.updatePatient.fcm === '') {
      this.patientDetails.fcm = '';
    } else {
      this.patientDetails.fcm = this.updatePatient.fcm;
    }
    if (this.updatePatient.postOpAntibiotics === null || this.updatePatient.postOpAntibiotics === '') {
      this.patientDetails.postop = '';
    } else {
      this.patientDetails.postop = this.updatePatient.postOpAntibiotics;
    }
    const listArray = [];
    if (this.updatePatient.patientProceduresList.length > 0) {
      this.updatePatient.patientProceduresList.forEach((proce, index) => {
        listArray.push(proce.procedureTypes.id.toString());
        if (index === 0) {
          this.patientDetails.procedureTypesId = proce.procedureTypes.id.toString();
        } else {
          this.patientDetails.procedureTypesId = this.patientDetails.procedureTypesId + ',' + proce.procedureTypes.id.toString();
        }
      });
    }
    this.selectedProcedure = listArray;
    if (this.updatePatient.daysList.length > 0) {
      this.updatePatient.daysList.forEach((info) => {
        const data = {
          expanded: false,
          arrowicon: 'arrow-dropright-circle',
          date: info
        };
        this.infoList.push(data);
      });
    }
  }


  getHospitals() {
    // this.appService.showLoader();
    this.homeService.fetchHospitals().subscribe((data) => {
      if (data && data._statusCode === '200') {
        this.hospitalList = data.data.hospitalList;
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
    this.homeService.fetchProcedures(1).subscribe((data: any) => {
      // this.homeService.fetchProcedures(1).pipe(map((data: any) => {
      console.log(data.data);
      if (data && data._statusCode === '200') {
        this.procedureList = data.data.procedureList.map((item) => {
          return {
            name: item.procedureName,
            colorCode: item.colorCode,
            description: item.description,
            id: item.id,
            procedureName: item.procedureName,
            updatedDate: item.updatedDate
          };
        });
        if (this.patientType === 'update') {
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
      item.arrowicon = 'arrow-dropright-circle';
    } else {
      item.expanded = true;
      item.arrowicon = 'arrow-dropdown-circle';
    }
  }

  onhospitalChange(event: any) {
    this.patientDetails.hospitalID = event.target.value;
  }

  onProcedureChange(event: any) {
    this.selectedProcedure = event.target.value;
    this.selectedProcedure.forEach((proce, index) => {
      if (index === 0) {
        this.patientDetails.procedureTypesId = proce;
      } else {
        this.patientDetails.procedureTypesId = this.patientDetails.procedureTypesId + ',' + proce;
      }
    });
    console.log(this.patientDetails.procedureTypesId);
  }

  onbAntiboiticsChange(event: any) {
    this.patientDetails.postop = event.target.value;
  }

  onEblChange(event: any) {
    this.patientDetails.ebl = event.target.value;
  }

  onCatheterChange(event: any) {
    this.patientDetails.fcm = event.target.value;
  }

  updateSurgeryDate(event: any) {
    this.patientDetails.dos = event.target.value;
    const admission = moment(event.detail.value).format('YYYY-MM-DD');
    const discharge = moment(Date.now()).format('YYYY-MM-DD');
    const start = moment(admission, 'YYYY-MM-DD');
    const end = moment(discharge, 'YYYY-MM-DD');
    if (this.update) {
      this.update = false;
      if (this.updatePatient.preOp === null || this.updatePatient.preOp === '') {
        this.patientDetails.preop = '';
        this.preopDiag = '';
      } else {
        this.patientDetails.preop = this.updatePatient.preOp.toString();
        this.preopDiag = this.updatePatient.preOp.toString();
      }
    } else {
      this.preopDiag = moment.duration(start.diff(end)).asDays().toString();
      this.patientDetails.preop = moment.duration(start.diff(end)).asDays().toString();
    }
  }

  updateAdmitDate(event: any) {
    this.patientDetails.admitDate = event.target.value;
  }

  savePatientDetails() {
    if (this.patientDetails.fname.length <= 2 || this.patientDetails.fname === '') {
      this.appService.warning('!Warning', 'Please enter at least 3 characters in FirstName.');
    } else if (this.patientDetails.fname.length > 20) {
      this.appService.warning('!Warning', 'Please enter no more than 15 characters in FirstName.');
    } else if (this.patientDetails.lname.length > 20) {
      this.appService.warning('!Warning', 'Please enter no more than 15 characters in LastName.');
    } else if (this.patientDetails.lname.length <= 2 || this.patientDetails.lname === '') {
      this.appService.warning('!Warning', 'Please enter at least 3 characters in LastName.');
    } else if (this.patientDetails.roomNo === '') {
      this.appService.warning('!Warning', 'Please enter RoomNo');
    } else if (this.patientDetails.hospitalID === '') {
      this.appService.warning('!Warning', 'Please select Hospital');
    } else if (this.patientDetails.procedureTypesId === '') {
      this.appService.warning('!Warning', 'Please select Procedure');
    } else if (this.patientDetails.dos === '') {
      this.appService.warning('!Warning', 'Please Fill Date Of Surgery');
    } else {
      if (this.patientType === 'update') {
        if (this.patientDetails.admitDate === '') {
          this.appService.warning('!Warning', 'Please Fill Date Of Admit.');
        } else {
          this.updatePatientForm();
        }
      } else if (this.patientType === 'add') {
        if (this.patientDetails.admitDate === '') {
          this.appService.warning('!Warning', 'Please Fill Date Of Admit.');
        } else {
          this.submitPatientDetails();
        }
      } else {
        this.submitPatientDetails();
      }
    }
  }
  submitPatientDetails() {
    if (this.patientType === 'add' || this.patientType === 'update') {
      this.patientDetails.admitDate = moment(this.patientDetails.admitDate).format('MM-DD-YYYY');
    } else {
      this.patientDetails.admitDate = '';
    }
    this.patientDetails.dos = moment(this.patientDetails.dos).format('MM-DD-YYYY');
    this.patientDetails.roomNo = this.patientDetails.roomNo.toString();
    // this.appService.showLoader();
    this.homeService.submitPatientDetails('patient/addPatient', this.patientDetails).subscribe((data) => {
     // console.log(data.data);
      // this.appService.hideLoader();
      if (data) {
        this.appService.success('Success', 'GYN Patient Add Successfully.');
        if (this.patientType === 'add' || this.patientType === 'update') {
          this.router.navigateByUrl('gynpatients');
        } else {
          this.router.navigateByUrl('addschedulerappointment');
        }
      } else if (!data) {
       // this.goToLoginScreen();
      } else {
        //this.appService.hideLoader();
        this.appService.error('!Error', '');
      }
    });
  }

  updatePatientForm() {

    const updatePatientDetails = {
      token: localStorage.getItem('deviceToken'),
      fname: this.patientDetails.fname,
      lname: this.patientDetails.lname,
      roomNo: this.patientDetails.roomNo.toString(),
      hospitalID: this.patientDetails.hospitalID,
      procedureTypesId: this.patientDetails.procedureTypesId,
      dos: moment(this.patientDetails.dos).format('MM-DD-YYYY'),
      surgeon: this.patientDetails.surgeon,
      preop: this.patientDetails.preop,
      ebl: this.patientDetails.ebl,
      complications: this.patientDetails.complications,
      fcm: this.patientDetails.fcm,
      postop: this.patientDetails.postop,
      desc: this.patientDetails.desc,
      admitDate: moment(this.patientDetails.admitDate).format('MM-DD-YYYY'),
      patientTypeId: '2',
      disclaimerAccept: this.patientDetails.disclaimerAccept,
      patientDetailsId: this.updatePatient.id.toString(),
      userId: this.updatePatient.mstUsers.userId.toString()
    };

   // this.appService.showLoader();
    this.homeService.submitPatientDetails('patient/updatePatient', updatePatientDetails).subscribe((data) => {
      console.log(data);
     // this.appService.hideLoader();
      if (data) {
        this.appService.success('Success', 'GYN Patient Update Successfully.');
        this.router.navigateByUrl('gynpatients');
      } else if (!data) {
      //  this.goToLoginScreen();
      } else {
      //  this.appService.hideLoader();
        this.appService.error('!Error', '');
      }
    });
  }

}
