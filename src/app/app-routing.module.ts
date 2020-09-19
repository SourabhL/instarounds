import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { AnlytiksComponent } from "./home/anlytiks/anlytiks.component";
import { AboutComponent } from "./about/about.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { AddgynpatientsComponent } from "./home/addgynpatients/addgynpatients.component";
import { AddobpatientComponent } from "./home/addobpatient/addobpatient.component";
import { AddschedulerappointmentComponent } from "./home/addschedulerappointment/addschedulerappointment.component";
import { GynPatientsComponent } from "./home/gyn-patients/gyn-patients.component";
import { ObPatientsComponent } from "./home/ob-patients/ob-patients.component";
import { SchedulerComponent } from "./home/scheduler/scheduler.component";
import { SettingsComponent } from "./home/settings/settings.component";
import { UserInfoComponent } from "./home/user-info/user-info.component";
import { UserListComponent } from "./home/user-list/user-list.component";
import { OutPatientsComponent } from "./home/out-patients/out-patients.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "home", component: HomeComponent },
  { path: "anlytics", component: AnlytiksComponent },
  { path: "about", component: AboutComponent },
  { path: "forgotpassword", component: ForgotPasswordComponent },
  { path: "addgynpatients", component: AddgynpatientsComponent },
  { path: "addobpatient", component: AddobpatientComponent },
  {
    path: "addschedulerappointment",
    component: AddschedulerappointmentComponent,
  },
  { path: "gyn-patients", component: GynPatientsComponent },
  { path: "ob-patients", component: ObPatientsComponent },
  { path: "out-patients", component: OutPatientsComponent },
  { path: "scheduler", component: SchedulerComponent },
  { path: "settings", component: SettingsComponent },
  { path: "user-info", component: UserInfoComponent },
  { path: "user-list", component: UserListComponent },
  { path: "", component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
