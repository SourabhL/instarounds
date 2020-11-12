import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { User } from "../model/user";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private httpClient: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(loginDetails: any) {
    let userData = {
      email: loginDetails.email,
      password: loginDetails.password,
    };
    return new Promise((resolve, reject) => {
      this.httpClient.post(`${environment.api.loginNew}`, userData).subscribe(
        (apiResponse: any) => {
          if (apiResponse.status === "success") {
            let token = apiResponse.id_token;

            localStorage.setItem("deviceToken", token);

            let header = new HttpHeaders();
            header = header.set("Authorization", token);
            this.httpClient
              .get(environment.api.getUserDetials, { headers: header })
              .subscribe(
                (loginResponse: any) => {
                  console.log(
                    "TestLOginnnnNewwwwwloginResponse",
                    loginResponse[0]
                  );

                  resolve({
                    status: true,
                    data: loginResponse[0],
                    statusCode: 200,
                  });
                },
                (error: any) => {
                  this.log("Error @fetchLoginDetails: " + error);
                  resolve({ status: false, message: error.message });
                }
              );
          } else if (apiResponse.status === 412) {
            resolve({ status: false, statusCode: apiResponse.status });
          } else {
            this.log(
              `fetchLoginDetails Error @fetchLoginDetails: ${JSON.stringify(
                apiResponse
              )}`
            );
            resolve({ status: false, message: apiResponse.msg });
          }
        },
        (error: any) => {
          this.log("Error @fetchLoginDetails: " + error);
          resolve({ status: false, message: error.message });
        }
      );
    });
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
}
