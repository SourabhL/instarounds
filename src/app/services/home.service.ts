import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {User} from '../model/user';
import {environment} from '../../environments/environment';
import {resolve} from 'url';


@Injectable({ providedIn: 'root' })
export class HomeService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  userInfo = {};
  userName = '';
  userGroup = '';
  userImage = '';
  outPatients = [];
  tempOutPatients = [];

  constructor(private http: HttpClient) {

  }

  fetchPatientCounts() {
    return this.http.get(`${environment.api.baseUrl}patient/getPatCount?token=${localStorage.getItem('deviceToken')}&patSearch=false`);
  }

  fetchHospitals(): Observable<any> {
    return this.http.get(`${environment.api.baseUrl}provider/gethospitals?token=${localStorage.getItem('deviceToken')}`);

  }

  fetchProcedures(patType: number) {
    return this.http.get(`${environment.api.baseUrl}provider/getprocedures?token=${localStorage.getItem('deviceToken')}&patTypeId=${patType}`);
  }

  fetchSchedulerData() {
    return this.http.get(`${environment.api.baseUrl}provider/scheduleData?token=${localStorage.getItem('deviceToken')}`);
  }

  fetchAdmitPatient(userData: any) {
    return this.http.put(`${environment.api.baseUrl}patient/admitPatient?token=${localStorage.getItem('deviceToken')}`, userData);
  }

  fetchReAdmitPatient(userData: any) {
    return this.http.put(`${environment.api.baseUrl}patient/reAdmitPatient}`, userData);
  }

  fetchDischargePatient(userData: any) {
    return this.http.put(`${environment.api.baseUrl}patient/dischargePatient}`, userData);
  }

  fetchUnAdimtPatient(userData: any) {
    return this.http.put(`${environment.api.baseUrl}patient/unadmitPatient}`, userData);

  }

  submitPatientDetails(endPoinr: any, patientData: any) {
    return this.http.put(`${environment.api.baseUrl}apt/patientApptUpdate}`, patientData);
  }

  submitAppoinmentDetails(endPoinr: any, patientData: any) {
    return this.http.put(`${environment.api.baseUrl}apt/patientAppointment}`, patientData);


  }

  fetchAnlyticsData(data: any) {
    return this.http.post(`${environment.api.baseUrl}analytics/getADcounts`, data);
  }

  fetchSpecialities() {
    return this.http.get(`${environment.api.getUserSpecialities}token=${localStorage.getItem('deviceToken')}`);
  }


  updateUserInfo(userData: any) {
    return this.http.post(`${environment.api.updateUserInfo}`, userData);
  }

  fetchCountries() {
    return this.http.get(`${environment.api.getCountrys}token=${localStorage.getItem('deviceToken')}`);
  }

  fetchStatelistByCountry(countryId) {
    return this.http.get(`${environment.api.getStates}token=${localStorage.getItem('deviceToken')}`);
  }

  downloadCSV(data: any) {
    return this.http.put(`${environment.api.baseUrl}analytics/downlaodCSV/data.csv`, data)
      .pipe(
        tap(_ => this.log('downlaodCSV')
        ),
        catchError(this.handleError<any>('downlaodCSV', []))
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

  fetchPatients(url: any, search: string) {
    return this.http.get(`${environment.api.baseUrl}${url}token=${localStorage.getItem('deviceToken')}&type=${search}`);
  }
}
