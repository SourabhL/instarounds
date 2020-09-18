// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  api: {
    baseUrl: 'http://122.175.12.200:8081/api-instarounds/',

    //baseUrl: 'http://localhost:8080/api-instarounds/',
    login: 'login/checkLogin?',
    patientCount: 'patient/getPatCount?',
    obPatients: 'patient/obpatients?',
    showPatients: 'patient/showPatients?',
    gynPatients: 'patient/gynpatients?',
    getHospitals: 'provider/gethospitals?',
    getProcedures: 'provider/getprocedures?',
    userInfo: 'provider/getUserInfo?',
    getStates: 'states/getState?',
    getCountrys: 'countries/getCountries?',
    getUserSpecialities: 'provider/getUserSpecialities?',
    getOutPatients: 'patient/outpatients?',
    getSchedulerData: 'provider/scheduleData?',
    admiPatient: 'patient/admitPatient',
    readminPatient: 'patient/reAdmitPatient',
    dischargePatient: 'patient/dischargePatient',
    unAdminPatient: 'patient/unadmitPatient',
    addPatient: 'patient/addpat',
    updatePatient: 'patient/updatePatient',
    addAppointment: 'apt/patientAppointment',
    updateAppointment: 'apt/patientApptUpdate',
    updateUserInfo: 'login/updateUser',
    forgotPassword: 'login/forgotPassowrd',
    getOBAnlytics: 'analytics/getADcounts'
  }

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
