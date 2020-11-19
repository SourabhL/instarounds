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
import { SatPopoverModule } from "@ncstate/sat-popover";
import { ChartsViewComponent } from "./home/charts-view/charts-view.component";
import {
  MatGridListModule,
  MatNativeDateModule,
  MatSelectModule,
  MatPaginatorModule,
  MatSortModule,
  MatDialogModule,
  MatTooltipModule,
  MatCheckboxModule,
  MatRadioModule,
  MatFormFieldModule,
  MatExpansionModule,
} from "@angular/material";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { AboutComponent } from "./about/about.component";
import { AddgynpatientsComponent } from "./home/addgynpatients/addgynpatients.component";
import { AddobpatientComponent } from "./home/addobpatient/addobpatient.component";
import { AddschedulerappointmentComponent } from "./home/addschedulerappointment/addschedulerappointment.component";
import { SchedulerAddPatientComponent } from "./home/scheduler/scheduler-add-pat.component";
import { GynPatientsComponent } from "./home/gyn-patients/gyn-patients.component";
import {
  ObPatientsComponent,
  DialogContentExampleDialog,
} from "./home/ob-patients/ob-patients.component";
import {
  OutPatientsComponent,
  DialogContentOutDialog,
} from "./home/out-patients/out-patients.component";
import { AlertDialogComponent } from "./home/alert-dialog/alert-dialog.component";
import { SchedulerComponent } from "./home/scheduler/scheduler.component";
import { SchedulerAppointment } from "./home/scheduler/scheduler-appointment.component";
import { SettingsComponent } from "./home/settings/settings.component";
import { UserInfoComponent } from "./home/user-info/user-info.component";
import { UserListComponent } from "./home/user-list/user-list.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { NotificationListComponent } from "./notification/notification.component";
import { NotificationService } from "./notification/notification.service";
import { InlineEditComponent } from "./inline-edit/inline-edit.component";

import { FlatpickrModule } from "angularx-flatpickr";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

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
    SchedulerAddPatientComponent,
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
    DialogContentOutDialog,
    InlineEditComponent,
    AlertDialogComponent,
    SchedulerAppointment,
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
    MatSelectModule,
    MatGridListModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatRadioModule,
    MatFormFieldModule,
    MatExpansionModule,
    SatPopoverModule,
    MatProgressSpinnerModule,
    NgbModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  entryComponents: [
    AppComponent,
    DialogContentExampleDialog,
    DialogContentOutDialog,
    InlineEditComponent,
    AlertDialogComponent,
    SchedulerAppointment,
    SchedulerAddPatientComponent,
  ],
  providers: [CsvDataService, NotificationService],
  bootstrap: [AppComponent],
})
export class AppModule {}
