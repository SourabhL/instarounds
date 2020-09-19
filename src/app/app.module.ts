import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LoginComponent } from "./login/login.component";
import { CustomMaterialModule } from "./material.module";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { HomeComponent } from "./home/home.component";
import { AnlytiksComponent } from "./home/anlytiks/anlytiks.component";
import { CsvDataService } from "./home/anlytiks/csv-data.service";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { SatDatepickerModule } from "saturn-datepicker";
import { ChartsViewComponent } from "./home/charts-view/charts-view.component";
import { MatGridListModule, MatNativeDateModule } from "@angular/material";
import { AboutComponent } from "./about/about.component";
import { AddgynpatientsComponent } from "./home/addgynpatients/addgynpatients.component";
import { AddobpatientComponent } from "./home/addobpatient/addobpatient.component";
import { AddschedulerappointmentComponent } from "./home/addschedulerappointment/addschedulerappointment.component";
import { GynPatientsComponent } from "./home/gyn-patients/gyn-patients.component";
import {
  ObPatientsComponent,
  DialogContentExampleDialog,
} from "./home/ob-patients/ob-patients.component";
import { OutPatientsComponent } from "./home/out-patients/out-patients.component";
import { SchedulerComponent } from "./home/scheduler/scheduler.component";
import { SettingsComponent } from "./home/settings/settings.component";
import { UserInfoComponent } from "./home/user-info/user-info.component";
import { UserListComponent } from "./home/user-list/user-list.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { NotificationListComponent } from "./notification/notification.component";
import { NotificationService } from "./notification/notification.service";
import { MatPaginatorModule } from "@angular/material";
import { MatSortModule } from "@angular/material";
import { MatDialogModule } from "@angular/material";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AnlytiksComponent,
    ChartsViewComponent,
    AboutComponent,
    AddgynpatientsComponent,
    AddobpatientComponent,
    AddschedulerappointmentComponent,
    GynPatientsComponent,
    ObPatientsComponent,
    OutPatientsComponent,
    SchedulerComponent,
    SettingsComponent,
    UserInfoComponent,
    UserListComponent,
    ForgotPasswordComponent,
    NotificationListComponent,
    DialogContentExampleDialog,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    FormsModule,
    HttpClientModule,
    MatDatepickerModule,
    SatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
  ],
  entryComponents: [AppComponent, DialogContentExampleDialog],
  providers: [CsvDataService, NotificationService],
  bootstrap: [AppComponent],
})
export class AppModule {}
