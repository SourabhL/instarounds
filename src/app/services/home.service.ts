import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { User } from "../model/user";
import { environment } from "../../environments/environment";
import { resolve } from "url";

@Injectable({ providedIn: "root" })
export class HomeService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  userInfo = {};
  userName = "";
  userGroup = "";
  userImage = "";
  outPatients = [];
  tempOutPatients = [];

  constructor(private http: HttpClient) {}

  fetchPatientCounts() {
    return this.http.get(
      `${
        environment.api.baseUrl
      }patient/getPatCount?token=${localStorage.getItem(
        "deviceToken"
      )}&patSearch=false`
    );
  }

  fetchHospitals(): Observable<any> {
    return this.http.get(
      `${
        environment.api.baseUrl
      }provider/gethospitals?token=${localStorage.getItem("deviceToken")}`
    );
  }

  fetchProcedures(patType: number) {
    return this.http.get(
      `${
        environment.api.baseUrl
      }provider/getprocedures?token=${localStorage.getItem(
        "deviceToken"
      )}&patTypeId=${patType}`
    );
  }

  fetchDropdownOptionsList(patType: number = 1) {
    console.log("Into fetchProceduresNew");
    let header = new HttpHeaders();
    header = header.set("Authorization", localStorage.getItem("deviceToken"));

    const hospitalList = new Promise((resolve, reject) => {
      this.http
        .get(environment.api.getHospitalsNew, {
          headers: header,
        })
        .subscribe(
          (apiResponse: any) => {
            console.log("apiResponse", apiResponse);
            resolve(apiResponse);
            //resolve({ status: true, data: apiResponse, statusCode: 200 });
          },
          (error: any) => {
            this.log("fetchProcedures Error @fetchProcedures: " + error);
            resolve({ status: false, message: error.message });
          }
        );
    });

    const procedureList = new Promise((resolve, reject) => {
      this.http
        .get(environment.api.getProceduresNew + "/" + patType, {
          headers: header,
        })
        .subscribe(
          (apiResponse: any) => {
            console.log("apiResponse", apiResponse);
            resolve(apiResponse);
            //resolve({ status: true, data: apiResponse, statusCode: 200 });
          },
          (error: any) => {
            this.log("fetchProcedures Error @fetchProcedures: " + error);
            resolve({ status: false, message: error.message });
          }
        );
    });

    const csectionReasonList = new Promise((resolve, reject) => {
      this.http
        .get(environment.api.cSectionReasonNew + "/" + patType, {
          headers: header,
        })
        .subscribe(
          (apiResponse: any) => {
            console.log("apiResponse", apiResponse);
            resolve(apiResponse);
            //resolve({ status: true, data: apiResponse, statusCode: 200 });
          },
          (error: any) => {
            this.log("fetchProcedures Error @fetchProcedures: " + error);
            resolve({ status: false, message: error.message });
          }
        );
    });

    const cpModeList = new Promise((resolve, reject) => {
      this.http
        .get(environment.api.cpModeNew + "/" + patType, {
          headers: header,
        })
        .subscribe(
          (apiResponse: any) => {
            console.log("apiResponse", apiResponse);
            resolve(apiResponse);
            //resolve({ status: true, data: apiResponse, statusCode: 200 });
          },
          (error: any) => {
            this.log("fetchProcedures Error @fetchProcedures: " + error);
            resolve({ status: false, message: error.message });
          }
        );
    });
    const inducedReasonList = new Promise((resolve, reject) => {
      this.http
        .get(environment.api.inducedReasonNew + "/" + patType, {
          headers: header,
        })
        .subscribe(
          (apiResponse: any) => {
            console.log("apiResponse", apiResponse);
            resolve(apiResponse);
            // resolve({ status: true, data: apiResponse, statusCode: 200 });
          },
          (error: any) => {
            this.log("fetchProcedures Error @fetchProcedures: " + error);
            resolve({ status: false, message: error.message });
          }
        );
    });

    // Using ES6 Promises
    return Promise.all([
      hospitalList,
      procedureList,
      csectionReasonList,
      cpModeList,
      inducedReasonList,
    ]).then((responses) => {
      const [
        hospitalList,
        procedureList,
        csectionReasonList,
        cpModeList,
        inducedReasonList,
      ] = responses;
      return {
        status: true,
        hospitalList,
        procedureList,
        csectionReasonList,
        cpModeList,
        inducedReasonList,
      };
    });
  }

  fetchSchedulerData() {
    return this.http.get(
      `${
        environment.api.baseUrl
      }provider/scheduleData?token=${localStorage.getItem("deviceToken")}`
    );
  }

  fetchAdmitPatient(userData: any) {
    return this.http.put(
      `${
        environment.api.baseUrl
      }patient/admitPatient?token=${localStorage.getItem("deviceToken")}`,
      userData
    );
  }

  fetchReAdmitPatient(userData: any) {
    return this.http.put(
      `${environment.api.baseUrl}patient/reAdmitPatient`,
      userData
    );
  }

  fetchDischargePatient(userData: any) {
    return this.http.put(
      `${environment.api.baseUrl}patient/dischargePatient`,
      userData
    );
  }

  dischargePatientNew(endPoinr: any, patientData: any) {
    let header = new HttpHeaders();
    header = header.set("Authorization", localStorage.getItem("deviceToken"));

    return new Promise((resolve, reject) => {
      this.http
        .put(endPoinr, patientData, { headers: header })
        .subscribe((apiResponse: any) => {
          console.log(apiResponse);
          if (Object.keys(apiResponse).length) {
            resolve({
              status: true,
              data: apiResponse,
              statusCode: "200",
            });
          }
        });
    });
  }

  reAdmitPatientNew(patientData: any) {
    let header = new HttpHeaders();
    header = header.set("Authorization", localStorage.getItem("deviceToken"));

    return new Promise((resolve, reject) => {
      this.http
        .put(environment.api.reAdmitPatientNew, patientData, {
          headers: header,
        })
        .subscribe((apiResponse: any) => {
          console.log(apiResponse);
          if (Object.keys(apiResponse).length) {
            resolve({
              status: true,
              data: apiResponse,
              statusCode: "200",
            });
          }
        });
    });
  }

  fetchUnAdimtPatient(userData: any) {
    return this.http.put(
      `${environment.api.baseUrl}patient/unadmitPatient}`,
      userData
    );
  }

  submitPatientDetails(endPoinr: any, patientData: any) {
    return this.http.put(
      `${environment.api.baseUrl}patient/addpat`,
      patientData
    );
  }

  updatePatientDetails(endPoinr: any, patientData: any) {
    return this.http.put(
      `${environment.api.baseUrl}patient/updatePatient`,
      patientData
    );
  }

  updatePatientDetailsNew(endPoinr: any, patientData: any) {
    let header = new HttpHeaders();
    header = header.set("Authorization", localStorage.getItem("deviceToken"));

    return new Promise((resolve, reject) => {
      this.http.put(endPoinr, patientData, { headers: header }).subscribe(
        (apiResponse: any) => {
          console.log(apiResponse);
          if (Object.keys(apiResponse).length) {
            resolve({
              status: true,
              data: apiResponse,
              statusCode: "200",
            });
          } else {
            this.log(
              `submitPatientDetails Error @submitPatientDetails: ${JSON.stringify(
                apiResponse
              )}`
            );
            resolve({ status: false, message: apiResponse._statusMessage });
          }
        },
        (error: any) => {
          this.log("Error @submitPatientDetails: " + error);
          resolve({ status: false, message: error.message });
        }
      );
    });
  }

  submitPatientDetailsNew(endPoinr: any, patientData: any) {
    let header = new HttpHeaders();
    header = header.set("Authorization", localStorage.getItem("deviceToken"));

    console.log(
      "Submit data to create new patient :",
      JSON.stringify(patientData)
    );

    return new Promise((resolve, reject) => {
      this.http.post(endPoinr, patientData, { headers: header }).subscribe(
        (apiResponse: any) => {
          console.log(apiResponse);
          if (Object.keys(apiResponse).length) {
            resolve({
              status: true,
              data: apiResponse,
              statusCode: "200",
            });
          } else {
            this.log(
              `submitPatientDetails  Error @submitPatientDetails: ${JSON.stringify(
                apiResponse
              )}`
            );
            resolve({ status: false, message: apiResponse._statusMessage });
          }
        },
        (error: any) => {
          this.log("Error @submitPatientDetails: " + error);
          resolve({ status: false, message: error.message });
        }
      );
    });
  }

  updatePatientPertinentInfo(pertinentInfo: any) {
    return this.http.put(
      `${environment.api.baseUrl}patient/editPatientPertinentInfo`,
      pertinentInfo
    );
  }

  submitAppoinmentDetails(endPoinr: any, patientData: any) {
    return this.http.put(
      `${environment.api.baseUrl}apt/patientAppointment}`,
      patientData
    );
  }

  fetchAnlyticsData(data: any) {
    return this.http.post(
      `${environment.api.baseUrl}analytics/getADcounts`,
      data
    );
  }

  fetchSpecialities() {
    return this.http.get(
      `${environment.api.getUserSpecialities}token=${localStorage.getItem(
        "deviceToken"
      )}`
    );
  }

  updateUserInfo(userData: any) {
    return this.http.post(`${environment.api.updateUserInfo}`, userData);
  }

  fetchCountries() {
    return this.http.get(
      `${environment.api.getCountrys}token=${localStorage.getItem(
        "deviceToken"
      )}`
    );
  }

  fetchStatelistByCountry(countryId) {
    return this.http.get(
      `${environment.api.getStates}token=${localStorage.getItem("deviceToken")}`
    );
  }

  downloadCSV(data: any) {
    return this.http
      .put(`${environment.api.baseUrl}analytics/downlaodCSV/data.csv`, data)
      .pipe(
        tap((_) => this.log("downlaodCSV")),
        catchError(this.handleError<any>("downlaodCSV", []))
      );
  }
  private handleError<T>(operation = "operation", result?: any[]) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of((result as unknown) as T);
    };
  }

  private log(message: string) {
    console.log(message);
  }

  fetchPatients(url: any, search: string, patient_type_id: number) {
    let header = new HttpHeaders();
    header = header.set("Authorization", localStorage.getItem("deviceToken"));
    let queryString = "";
    if (search === "census") {
      queryString = "?status=IN";
    } else {
      queryString = "?status=OUT";
    }

    // if (patient_type_id) {
    //   queryString += "&patient_type_id=" + patient_type_id;
    // }

    return new Promise((resolve, reject) => {
      this.http.get(url + queryString, { headers: header }).subscribe(
        (apiResponse: any) => {
          console.log("apiResponse", apiResponse);

          resolve({ status: true, data: apiResponse, statusCode: 200 });
        },
        (error: any) => {
          this.log("fetchPatients - Error @fetchPatients: " + error);
          resolve({ status: false, message: error.message });
        }
      );
    });
  }

  fetchOutPatients(url: any) {
    return this.http.get(
      `${environment.api.baseUrl}${url}token=${localStorage.getItem(
        "deviceToken"
      )}`
    );
  }
}
