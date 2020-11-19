import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { isSameDay, isSameMonth, addMinutes } from "date-fns";
import { Subject } from "rxjs";
//import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from "angular-calendar";

import { SchedulerAddPatientComponent } from "./scheduler-add-pat.component";
import { SchedulerAppointment } from "./scheduler-appointment.component";
import { Router } from "@angular/router";
import { HomeService } from "../../services/home.service";
import { NotificationService } from "../../notification/notification.service";
import { MatTableDataSource, MatSort, MatPaginator } from "@angular/material";
import { environment } from "../../../environments/environment";
const colors: any = {
  red: {
    primary: "#ad2121",
    secondary: "#FAE3E3",
  },
  blue: {
    primary: "#1e90ff",
    secondary: "#D1E8FF",
  },
  yellow: {
    primary: "#e3bc08",
    secondary: "#FDF1BA",
  },
};

export interface PatientsData {
  fullName: string;
  patientType: string;
  room_number: string;
}

declare var moment: any;
@Component({
  selector: "app-scheduler",
  styleUrls: ["./scheduler.component.scss"],
  templateUrl: "./scheduler.component.html",
})
export class SchedulerComponent {
  displayedColumns: string[] = ["fullName", "patientType", "room_number"];
  dataSource: MatTableDataSource<PatientsData>;

  // @ViewChild(MatPaginator, { static: false }) set matPaginator(
  //   paginator: MatPaginator
  // ) {
  //   if (!this.dataSource.paginator) {
  //     this.dataSource.paginator = paginator;
  //   }
  // }

  // @ViewChild(MatSort, { static: false }) set matSort(sort: MatSort) {
  //   if (!this.dataSource.sort) {
  //     this.dataSource.sort = sort;
  //   }
  // }
  patientsList = [];
  tempPatientsList = [];
  addPat = false;
  date: any;
  selectedDate: any;
  options = {};
  segmentType = "list";
  scheduleData: any = [];
  calenderDates: any = [];
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: "Edit",
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent("Edited", event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: "Delete",
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent("Deleted", event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();
  /**
   * The locale used to format dates
   */
  locale: string;
  events: CalendarEvent[] = [
    {
      start: new Date(),
      end: addMinutes(new Date(), 30),
      title: "A 30 mins event",
      color: colors.red,
      actions: this.actions,
      allDay: false,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    // {
    //   start: startOfDay(new Date()),
    //   title: "An event with no end date",
    //   color: colors.yellow,
    //   actions: this.actions,
    // },
    // {
    //   start: subDays(endOfMonth(new Date()), 3),
    //   end: addDays(endOfMonth(new Date()), 3),
    //   title: "A long event that spans 2 months",
    //   color: colors.blue,
    //   allDay: true,
    // },
    // {
    //   start: addHours(startOfDay(new Date()), 2),
    //   end: addHours(new Date(), 2),
    //   title: "A draggable and resizable event",
    //   color: colors.yellow,
    //   actions: this.actions,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true,
    //   },
    //   draggable: true,
    // },
  ];

  activeDayIsOpen: boolean = true;

  constructor(
    private router: Router,
    private loginSer: HomeService,
    private appService: NotificationService,
    private modalService: NgbModal
  ) {
    //  this.date = moment(Date.now()).format("YYYY-MM-DD");
    // this.selectedDate = moment(Date.now()).format("YYYY-MM-DD");
    // console.log(this.date);
    // this.modalService.activeInstances.subscribe((list) => {
    //   this.modalsNumber = list.length;
    // });
  }
  async ngOnChanges() {
    console.log("Inside on changes");
    //await this.getPatients();
  }
  ngOnInit() {}

  ionViewDidEnter() {
    //this.getSchedulerData();
  }
  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async getPatients() {
    console.log("Into get patients");

    this.patientsList = [];
    this.tempPatientsList = [];
    // this.appService.showLoader();
    this.loginSer
      .fetchPatients(environment.api.getPatientsNew, "census", 1)
      .then((data: any) => {
        console.log(data.status);
        //this.appService.hideLoader();
        if (data.status) {
          console.log("data.data..", data.data);
          this.patientsList = data.data.map((val) => ({
            ...val,
            fullName: `${val.first_name} ${val.last_name}`,
            patientType: val.patient_type_id == 1 ? "OB" : "GYN",
            edd: (val.edd && moment(val.edd).format("MM/DD/YYYY")) || val.edd,
          }));
          this.tempPatientsList = this.patientsList.map((val) => ({
            fullName: val.fullName,
            patientType: val.patientType,
            room_number: val.room_number,
          }));
          this.dataSource = new MatTableDataSource(this.tempPatientsList);
          // this.dataSource.paginator = this.paginator;
          //this.dataSource.sort = this.sort;
          // if (!this.dataSource.paginator) {
          //   this.dataSource.paginator = this.matPaginator;
          // }
          // if (!this.dataSource.sort) {
          //   this.dataSource.sort = this.matSort;
          // }
          // if (this.dataSource.paginator) {
          //   this.dataSource.paginator.firstPage();
          // }
        } else if (!data.status) {
          this.goToLoginScreen();
        } else {
          //this.appService.alert("!Error", data.message);
          //this.openMessageDialog("Error in Fetching Patients");
        }
      });
  }

  // ****** Navigation ************

  gotoDashboardPage() {
    this.router.navigateByUrl("/home");
  }

  goToPatients() {
    this.router.navigateByUrl("/ob-patients");
  }
  goToSchedulerPage() {
    this.router.navigateByUrl("/scheduler");
  }

  goToAnlyticsPage() {
    this.router.navigateByUrl("/anlytics");
  }

  goToLoginScreen() {
    localStorage.setItem("deviceToken", "");
    localStorage.setItem("userData", "");
    localStorage.setItem("deviceId", "");
    this.router.navigateByUrl("/login");
  }

  goToAddPatient() {
    // this.addPat = true;
    // close();
    //this.modalService.open(this.modalAdd, { size: "lg" });
    this.modalService.open(SchedulerAddPatientComponent, {
      size: "lg",
    });
  }

  hourSegmentClicked(event) {
    console.log(event);
    this.handleEvent("hourSegment", event);
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent("Resized", event);
  }

  handleEvent = async (action: string, event: CalendarEvent) => {
    console.log("event..", event);
    if (action === "hourSegment") {
      await this.getPatients();
    }

    const modalRef = this.modalService.open(SchedulerAppointment, {
      size: "lg",
      backdrop: "static",
    });

    modalRef.componentInstance.event = event;

    // this.addPat = false;
    // this.modalData = { event, action };
    // if (!this.dataSource.paginator) {
    //   this.dataSource.paginator = this.matPaginator;
    // }
    // if (!this.dataSource.sort) {
    //   this.dataSource.sort = this.matSort;
    // }
    // this.modal.open(this.modalContent, { size: "lg" });
  };

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: "New event",
        start: new Date(),
        end: addMinutes(new Date(), 30),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}

// @Component({
//   template: `
//     <div class="modal-header">
//       <h4 class="modal-title">Hi there!</h4>
//       <button
//         type="button"
//         class="close"
//         aria-label="Close"
//         (click)="activeModal.dismiss('Cross click')"
//       >
//         <span aria-hidden="true">&times;</span>
//       </button>
//     </div>
//     <div class="modal-body">
//       <p>Hello, World!</p>
//       <p>
//         <button class="btn btn-lg btn-outline-primary" (click)="open()">
//           Launch demo modal
//         </button>
//       </p>
//     </div>
//     <div class="modal-footer">
//       <button
//         type="button"
//         class="btn btn-outline-dark"
//         (click)="activeModal.close('Close click')"
//       >
//         Close
//       </button>
//     </div>
//   `,
// })
// export class NgbdModal1Content {
//   constructor(
//     private modalService: NgbModal,
//     public activeModal: NgbActiveModal
//   ) {}

//   open() {
//     this.modalService.open(SchedulerAddPatientComponent, {
//       size: "lg",
//     });
//   }
// }
