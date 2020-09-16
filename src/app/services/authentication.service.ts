import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {User} from '../model/user';
import {environment} from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(usernameandpassword: any) {
      return this.http.get(`${environment.api.baseUrl}login/checkLogin?email=${usernameandpassword.email}&password=${usernameandpassword.password}&deviceToken=${usernameandpassword.deviceToken}&deviceType=${usernameandpassword.deviceType}`)
        .pipe(
          tap(_ => this.log('fetched users')
          ),
          catchError(this.handleError<any>('getUserTimesheet', []))
        );
  }

  private handleError<T>(operation = 'operation', result?: any[]) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as unknown as T);
    };
  }

  private log(message: string) {
    console.log(message);
  }
}
