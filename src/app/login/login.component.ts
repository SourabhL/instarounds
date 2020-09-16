import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../services/authentication.service';
import {first} from 'rxjs/operators';
import {NotificationService} from '../notification/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private authenticationService: AuthenticationService,
              protected appService: NotificationService) {
  }

  username: string = 'prac3@prac.com';
  password: string = 'ganga';
  showSpinner: false;

  ngOnInit() {
  }

  login(): void {
      const loginDetails = {
        email: this.username,
        password: this.password,
        deviceType: '1',
        deviceToken: '1400BCF7-E3FF-48EE-997A-59F887135D57'
      };
      this.authenticationService.login(loginDetails).pipe(first()).subscribe(users => {
        if (users._statusCode == '200') {
          localStorage.setItem('deviceToken', users.data.token);
          localStorage.setItem('userData', JSON.stringify(users.data));
          this.router.navigate(['/home']);
        } else if (!users.status) {
          console.log('!Error', 'Please enter valid credentials.');
        } else {
          console.log('!Error', users.message);
        }
      });
  }
}
