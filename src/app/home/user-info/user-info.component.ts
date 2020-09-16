import {Component, OnInit} from '@angular/core';
import {HomeService} from '../../services/home.service';
import {Router} from '@angular/router';
import {NotificationService} from '../../notification/notification.service';

@Component({
  selector: 'app-user-info',
  styleUrls: ['./user-info.component.scss'],
  templateUrl: './user-info.component.html'
})
export class UserInfoComponent implements OnInit{


  spType = '0';
  gender = '1';
  specialtyList = [];
  countrysList = [];
  statesList = [];
  userDetails = {
    token: '',
    userId: '',
    firstName: '',
    lastName: '',
    gender: '',
    address1: '',
    address2: '',
    city: '',
    zipCode: '',
    phone: '',
    fax: '',
    userPassword: '',
    userEmail: '',
    active: '',
    expiryDate: '',
    regConfirmation: '',
    disclaimerAccept: '',
    countryId: '',
    stateId: '',
    userSpeacialityId: '',
    image: ''
  };
  customAlertOptions: any = {
    header: 'Choose One',
    translucent: true
  };

  constructor(
    // private actionSheetController: ActionSheetController,
    // private cameraService: CameraService,
    private appService: NotificationService,
    private loginSer: HomeService,
    // private callNumber: CallNumber,
    private router: Router
  ) {
    const obj = JSON.parse(localStorage.getItem('userData'));
    if (obj !== null && obj !== undefined) {
      this.loginSer.userGroup = obj.groupName;
    }
  }

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
   // // this.appService.showLoader();
   //  this.loginSer.fetchUserInfo().then((data: any) => {
   //    console.log(data.data);
   //    if (data.status) {
   //      this.userProfileData(data.data);
   //      this.getSpecialtyList();
   //    } else if (!data.status) {
   //      this.goToLoginScreen();
   //    } else {
   //      this.appService.hideLoader();
   //      this.appService.alert('!Error', data.message);
   //    }
   //  });
  }

  getSpecialtyList() {
    this.loginSer.fetchSpecialities().subscribe((data: any) => {
      console.log(data.data);
      if (data.status) {
        this.specialtyList = data.data.userSpecialityList;
        this.getCountrysList();
      } else if (!data.status) {
        this.goToLoginScreen();
      } else {
        //this.appService.hideLoader();
        this.appService.alert('!Error', data.message);
      }
    });
  }

  getCountrysList() {
    this.loginSer.fetchCountries().subscribe((data: any) => {
      console.log(data.data);
      if (data.status) {
        this.countrysList = data.data.countryList;
        if (this.userDetails.countryId !== '') {
          this.getStatesByCountrysList(this.userDetails.countryId, false);
        } else {
          //this.appService.hideLoader();
        }
      } else if (!data.status) {
        this.goToLoginScreen();
      } else {
        //this.appService.hideLoader();
        this.appService.alert('!Error', data.message);
      }
    });
  }

  getStatesByCountrysList(countryId: string, loder: boolean) {
    if (loder) {
     //  this.appService.showLoader();
    }
    this.loginSer.fetchStatelistByCountry(countryId).subscribe((data: any) => {
      console.log(data.data);
      // this.appService.hideLoader();
      if (data.status) {
        this.statesList = data.data.stateList;
      } else if (!data.status) {
        this.goToLoginScreen();
      } else {
        this.appService.alert('!Error', data.message);
      }
    });
  }
  userProfileData(data: any) {
    this.userDetails.token = localStorage.getItem('deviceToken');
    this.userDetails.userId = data.mstUsers.userId.toString();
    this.userDetails.firstName = data.mstUsers.firstName;
    this.userDetails.lastName = data.mstUsers.lastName;
    this.userDetails.gender = data.mstUsers.gender;
    if (data.mstUsers.address1 === null || data.mstUsers.address1 === '') {
      this.userDetails.address1 = '';
    } else {
      this.userDetails.address1 = data.mstUsers.address1;
    }
    if (data.mstUsers.address2 === null || data.mstUsers.address2 === '') {
      this.userDetails.address2 = '';
    } else {
      this.userDetails.address2 = data.mstUsers.address2;
    }
    if (data.mstUsers.city === null || data.mstUsers.city === '') {
      this.userDetails.city = '';
    } else {
      this.userDetails.city = data.mstUsers.city;
    }
    if (data.mstUsers.zipCode === null || data.mstUsers.zipCode === '') {
      this.userDetails.zipCode = '';
    } else {
      this.userDetails.zipCode = data.mstUsers.zipCode;
    }
    if (data.mstUsers.phone === null || data.mstUsers.phone === '') {
      this.userDetails.phone = '';
    } else {
      this.userDetails.phone = data.mstUsers.phone;
    }
    if (data.mstUsers.fax === null || data.mstUsers.fax === '') {
      this.userDetails.fax = '';
    } else {
      this.userDetails.fax = data.mstUsers.fax;
    }
    this.userDetails.userPassword = data.mstUsers.userPassword;
    this.userDetails.userEmail = data.mstUsers.userEmail;
    this.userDetails.active = data.mstUsers.active;
    this.userDetails.expiryDate = data.mstUsers.expiryDate;
    this.userDetails.regConfirmation = data.mstUsers.regConfirmation;
    this.userDetails.disclaimerAccept = data.mstUsers.disclaimerAccept;

    if (data.mstUsers.country === null || data.mstUsers.country === '') {
      this.userDetails.countryId = '';
    } else {
      this.userDetails.countryId = data.mstUsers.country.toString();
    }
    if (data.mstUsers.state === null || data.mstUsers.state === '') {
      this.userDetails.stateId = '';
    } else {
      this.userDetails.stateId = data.mstUsers.state.toString();
    }
    if (data.mstUsers.userSpeciality === null || data.mstUsers.userSpeciality === '') {
      this.userDetails.userSpeacialityId = '';
    } else {
      this.userDetails.userSpeacialityId = data.mstUsers.userSpeciality.toString();
    }
  }

  spChange(event: any) {
    this.userDetails.userSpeacialityId = event.target.value;
  }
  genderChange(event: any) {
    this.userDetails.gender = event.target.value;
  }
  countryChange(event: any) {
    this.userDetails.countryId = event.target.value;
    this.getStatesByCountrysList(event.target.value.toString(), true);
  }
  stateChange(event: any) {
    this.userDetails.stateId = event.target.value;
  }
  phoneCall(phone: string) {
    // this.callNumber.callNumber(phone, true)
    //   .then(res => console.log('Launched dialer!', res))
    //   .catch(err => console.log('Error launching dialer', err));
  }
  checkState() {
    if (this.userDetails.countryId === '') {
      this.appService.alert('!Warning', 'Please Select Country.');
    }
  }
  getUserImage() {
    this.presentActionSheet();
  }
  async presentActionSheet() {
    // const actionSheet = await this.actionSheetController.create({
    //   header: 'Select Image From',
    //   buttons: [{
    //     text: 'Camera',
    //     icon: 'camera',
    //     handler: () => {
    //       this.cameraService.getImageFromCamera().then((dataObject: any) => {
    //       });
    //     }
    //   }, {
    //     text: 'Gallery',
    //     icon: 'images',
    //     handler: () => {
    //       this.cameraService.getImageFromGallery().then((dataObject: any) => {
    //       });
    //     }
    //   }, {
    //     text: 'Cancel',
    //     icon: 'close',
    //     role: 'cancel',
    //     handler: () => {
    //       console.log('Cancel clicked');
    //     }
    //   }]
    // });
    // await actionSheet.present();
  }

  saveUserDetails() {
    this.userDetails.userSpeacialityId = this.userDetails.userSpeacialityId.toString();
    this.userDetails.countryId = this.userDetails.countryId.toString();
    this.userDetails.stateId = this.userDetails.stateId.toString();
    console.log(this.userDetails);
    //this.appService.showLoader();
    this.loginSer.updateUserInfo(this.userDetails).subscribe((data: any) => {
      console.log(data.data);
      //this.appService.hideLoader();
      if (data.status) {
        this.appService.alert('Success', 'Your changes have been saved.');
      } else if (!data.status) {
        this.goToLoginScreen();
      } else {
        //this.appService.hideLoader();
        this.appService.alert('!Error', data.message);
      }
    });
  }

  goToLoginScreen() {
    localStorage.setItem('deviceToken', '');
    localStorage.setItem('userData', '');
    localStorage.setItem('deviceId', '');
    this.router.navigateByUrl('/login');
  }
}
