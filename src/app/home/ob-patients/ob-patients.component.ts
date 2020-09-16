import {Component, OnInit} from '@angular/core';
import {HomeService} from '../../services/home.service';
import {NotificationService} from '../../notification/notification.service';
import {NavigationExtras, Router} from '@angular/router';
import {environment} from '../../../environments/environment';


@Component({
  selector: 'app-ob-patients',
  styleUrls: ['./ob-patients.component.scss'],
  templateUrl: './ob-patients.component.html'
})
export class ObPatientsComponent implements OnInit {

  patientsList = [];
  tempPatientsList = [];
  constructor(
    private loginSer: HomeService,
    private appService: NotificationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getPatients();
  }

  getPatients() {
    this.patientsList = [];
    this.tempPatientsList = [];
    // this.appService.showLoader();
    this.loginSer.fetchPatients(environment.api.obPatients, false).subscribe((data: any) => {
      console.log(data.data);
     // this.appService.hideLoader();
      if (data._statusCode === '200') {
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
        this.appService.error('!Error', data.message);
      }
    });
  }

  bachAction() {
    this.router.navigate(['/home']);
  }

  searchHandler(event): void {
    const val = event.target.value;
    if (val && val.trim() !== '') {
      this.tempPatientsList = this.patientsList.filter((item: any) => {
        return (item.mstUsers.firstName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    } else {
      this.tempPatientsList = this.patientsList;
    }
  }

  unAdmitPatient(item: any) {
    const userdata = {
      token: localStorage.getItem('deviceToken'),
      patientDetailsId: item.mstUsers.userId
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
        this.appService.alert('!Error', data.message);
      }
    });
  }

  DischargePatient(item: any) {
    const userdata = {
      token: localStorage.getItem('deviceToken'),
      patientDetailsId: item.mstUsers.userId
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
        this.appService.alert('!Error', data.message);
      }
    });
  }

  viewPatientDetails() {

  }

  gotoDashboardPage() {
    this.router.navigateByUrl('/home');
  }

  patientsTypeSelection() {
    this.router.navigateByUrl('/ob-patients');
  }

  goToAddPatient() {
    const navigationExtras: NavigationExtras = {
      state: {
        patientType: 'add',
        patientDetails: ''
      }
    };
    this.router.navigate(['addobpatient'], navigationExtras);
  }

  goToUpdatePatient(item: any) {
    console.log(item);
    const navigationExtras: NavigationExtras = {
      state: {
        patientType: 'update',
        patientDetails: item
      }
    };
    this.router.navigate(['addobpatient'], navigationExtras);
  }

  goToLoginScreen() {
    localStorage.setItem('deviceToken', '');
    localStorage.setItem('userData', '');
    localStorage.setItem('deviceId', '');
    this.router.navigateByUrl('/login');
  }
}
