// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  api: {
    baseUrl: "http://122.175.12.200:8081/api-instarounds/",

    //baseUrl: 'http://localhost:8080/api-instarounds/',
    login: "login/checkLogin?",
    patientCount: "patient/getPatCount?",
    obPatients: "patient/obpatients?",
    showPatients: "patient/showPatients?",
    gynPatients: "patient/gynpatients?",
    getHospitals: "provider/gethospitals?",
    getProcedures: "provider/getprocedures?",
    userInfo: "provider/getUserInfo?",
    getStates: "states/getState?",
    getCountrys: "countries/getCountries?",
    getUserSpecialities: "provider/getUserSpecialities?",
    getOutPatients: "patient/outpatients?",
    getSchedulerData: "provider/scheduleData?",
    admiPatient: "patient/admitPatient",
    readminPatient: "patient/reAdmitPatient",
    dischargePatient: "patient/dischargePatient",
    unAdminPatient: "patient/unadmitPatient",
    addPatient: "patient/addpat",
    updatePatient: "patient/updatePatient",
    addAppointment: "apt/patientAppointment",
    updateAppointment: "apt/patientApptUpdate",
    updateUserInfo: "login/updateUser",
    forgotPassword: "login/forgotPassowrd",
    getOBAnlytics: "analytics/getADcounts",

    //new Apis
    loginNew:
      "https://yloy1572a8.execute-api.us-east-2.amazonaws.com/dev/cognito/user-login",
    getUserDetials:
      "https://hbjb591uwf.execute-api.us-east-2.amazonaws.com/dev/user",
    forgotPasswordNew:
      "https://yloy1572a8.execute-api.us-east-2.amazonaws.com/dev/cognito/user-forgetpassword/",
    createGetAppointments:
      "https://079krqmrzc.execute-api.us-east-2.amazonaws.com/dev/appointment",
    getPatientsNew:
      "https://e03z41dbq5.execute-api.us-east-2.amazonaws.com/dev/patient",
    getHospitalsNew:
      "https://bca7zde327.execute-api.us-east-2.amazonaws.com/dev/hospital",
    getProceduresNew:
      "https://g1aylyh7zf.execute-api.us-east-2.amazonaws.com/dev/master/procedure",
    cSectionReasonNew:
      "https://g1aylyh7zf.execute-api.us-east-2.amazonaws.com/dev/master/csection-reason",
    cpModeNew:
      "https://g1aylyh7zf.execute-api.us-east-2.amazonaws.com/dev/master/cpmode",
    inducedReasonNew:
      "https://g1aylyh7zf.execute-api.us-east-2.amazonaws.com/dev/master/induced-reason",
    createPatientNew:
      "https://e03z41dbq5.execute-api.us-east-2.amazonaws.com/dev/patient",
    dischargePatientNew:
      "https://e03z41dbq5.execute-api.us-east-2.amazonaws.com/dev/patient",
    reAdmitPatientNew:
      "https://e03z41dbq5.execute-api.us-east-2.amazonaws.com/dev/patient",
    getOutPatientsNew:
      "https://e03z41dbq5.execute-api.us-east-2.amazonaws.com/dev/patient",
    editPatientPertinentNew:
      "https://e03z41dbq5.execute-api.us-east-2.amazonaws.com/dev/pertinent",
    fetchPatientPertinentNew:
      "https://e03z41dbq5.execute-api.us-east-2.amazonaws.com/dev/pertinent",
    getPatientsNewNotAdmitted:
      "https://e03z41dbq5.execute-api.us-east-2.amazonaws.com/dev/patient?admit_date=null",
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
