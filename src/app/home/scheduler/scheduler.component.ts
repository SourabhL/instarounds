import {Component} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {HomeService} from '../../services/home.service';
import {NotificationService} from '../../notification/notification.service';

declare var moment: any;
@Component({
  selector: 'app-scheduler',
  styleUrls: ['./scheduler.component.scss'],
  templateUrl: './scheduler.component.html'
})
export class SchedulerComponent {

  date: any;
  selectedDate: any;
  options = {
  };
  segmentType = 'list';
  scheduleData: any = [];
  calenderDates: any = [];
  constructor(
    private router: Router,
    private loginSer: HomeService,
    private appService: NotificationService,

  ) {
    this.date = moment(Date.now()).format('YYYY-MM-DD');
    this.selectedDate = moment(Date.now()).format('YYYY-MM-DD');
    console.log(this.date);
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getSchedulerData();
  }

  getSchedulerData() {
    this.scheduleData = [];
    // this.appService.showLoader();

      this.loginSer.fetchSchedulerData().subscribe((data: any) => {
      console.log(data.data);
      // this.appService.hideLoader();
      if (data.status) {
        this.scheduleData = data.data.sheduleList;
        console.log(this.scheduleData);
        this.getCalendarData();
      } else if (!data.status) {
        this.goToLoginScreen();
      } else {
       // this.appService.hideLoader();
        this.appService.alert('!Error', data.message);
      }
    });
  }

  getCalendarData() {
    const daysConfig= [];
    this.scheduleData.forEach((data) => {
      const sheduleDate = data.date.split('-');
      data.appts.forEach((apptsData) => {
        if (apptsData.id !== 0) {
          // console.log(Number(sheduleDate[0]), Number(sheduleDate[1]), Number(sheduleDate[2]));
          apptsData.avatar = apptsData.mstUsersByUserPatientTypeId.firstName.substring(0, 1);
          apptsData.color = this.appService.getRandomColor();
          daysConfig.push({
            date: new Date(Number(sheduleDate[0]), Number(sheduleDate[1] - 1), Number(sheduleDate[2])),
            subTitle: '●'
          });
        }
      });
    });

    this.options = {
      daysConfig,
      from: new Date(2020, 0, 1),
      showMonthPicker: false,
      pickMode: 'single',
      color: 'secondary'
    };

    this.getSelectedList(this.date);
  }

  getSelectedList(selectedDate: any) {
    this.calenderDates = [];
    this.scheduleData.forEach((data) => {
      if (data.date === selectedDate) {
        this.calenderDates.push(data);
      }
    });
    console.log(this.calenderDates);
  }

  onChange($event) {
    const date = moment($event).format('YYYY-MM-DD');
    this.getSelectedList(date);
  }

  onSelect($event) {
    console.log('onSelect', $event);
  }

  navigateToday() {
    this.date = moment(Date.now()).format('YYYY-MM-DD');
    this.selectedDate = moment(Date.now()).format('YYYY-MM-DD');
    this.getSelectedList(this.date);
  }

  segmentChanged(ev: any) {
    this.segmentType = ev.target.value;
    console.log(this.segmentType);
  }

  addNewPatient() {
    this.presentActionSheet();
  }

  admitPatient(patientId) {
    const userdata = {
      token: localStorage.getItem('deviceToken'),
      userId: patientId
    };
    // this.appService.showLoader();
    this.loginSer.fetchAdmitPatient(userdata).subscribe((data: any) => {
      console.log(data.data);
     // this.appService.hideLoader();
      if (data.status) {
        this.getSchedulerData();
      } else if (!data.status) {
        this.goToLoginScreen();
      } else {
        // this.appService.hideLoader();
        this.appService.alert('!Error', data.message);
      }
    });
  }

  async presentActionSheet() {
    // const actionSheet = await this.actionSheetController.create({
    //   header: 'Select Appointment Type',
    //   buttons: [{
    //     text: 'OB Patient',
    //     handler: () => {
    //       const navigationExtras: NavigationExtras = {
    //         state: {
    //           appointmentType: 'obpatient',
    //           addorupadte: 'add',
    //           details: ''
    //         }
    //       };
    //       this.router.navigate(['addschedulerappointment'], navigationExtras);
    //       // this.router.navigateByUrl('/addschedulerappointment');
    //     }
    //   }, {
    //     text: 'GYN Patient',
    //     handler: () => {
    //       const navigationExtras: NavigationExtras = {
    //         state: {
    //           appointmentType: 'gynpatient',
    //           addorupadte: 'add',
    //           details: ''
    //         }
    //       };
    //       this.router.navigate(['addschedulerappointment'], navigationExtras);
    //       // this.router.navigateByUrl('/addschedulerappointment');
    //     }
    //   }, {
    //     text: 'Cancel',
    //     handler: () => {
    //       console.log('Cancel clicked');
    //     }
    //   }]
    // });
    // await actionSheet.present();
  }

  updateAppoinment(item: any) {
    console.log(item);
    let type: any;
    if (item.patientType === 'OB') {
      type = 'obpatient';
    } else {
      type = 'gynpatient';
    }
    const navigationExtras: NavigationExtras = {
      state: {
        appointmentType: type,
        addorupadte: 'update',
        details: item
      }
    };
    this.router.navigate(['addschedulerappointment'], navigationExtras);
  }

  goToLoginScreen() {
    localStorage.setItem('deviceToken', '');
    localStorage.setItem('userData', '');
    localStorage.setItem('deviceId', '');
    this.router.navigateByUrl('/login');
  }
}
