import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-user-list',
  styleUrls: ['./user-list.component.scss'],
  templateUrl: './user-list.component.html'
})
export class UserListComponent {

  @Input() patientType: string;
  @Input() patientName: string;
  patientsList = [];
  tempPatientsList = [];
  userName: any;
  patienttype: any;
  constructor(
    // private navParams: NavParams,
    // public modalController: ModalController
  ) {
    // this.patienttype = this.navParams.get('patientType');
    // this.userName = this.navParams.get('patientName');
    // this.patientsList = this.navParams.get('usersData');
    this.tempPatientsList = this.patientsList;
  }

  ionViewDidEnter() {

  }
  cancelAction() {
 //   this.modalController.dismiss({ userName: '', userData: {} });
  }
  doneAction() {
   // this.modalController.dismiss({ userName: this.userName, userData: {} });
  }

  testChange(event: any) {
    const val = event.target.value;
    if (val && val.trim() !== '') {
      this.tempPatientsList = this.patientsList.filter((item: any) => {
        return (item.mstUsers.firstName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    } else {
      this.tempPatientsList = this.patientsList;
    }
  }
  selectedUser(item: any) {
    this.userName = item.mstUsers.firstName + ' ' + item.mstUsers.lastName;
 //   this.modalController.dismiss({ userName: this.userName, userData: item });
  }

}
