const firebase=require("firebase");
const config = {
    apiKey: "AIzaSyAtjwIsx-u8XCBMolafYki6oRsugEGiATQ",
    authDomain: "ohsdental-74475.firebaseapp.com",
    databaseURL: "https://ohsdental-74475.firebaseio.com",
    projectId: "ohsdental-74475",
    storageBucket: "",
    messagingSenderId: "185104292656"
};
let appointmentDate,template;
firebase.initializeApp(config);
class FirebaseDatabase {
    writeUserData(location, appointmentDate, service, firstName, lastName, phoneNumber, emailid) {
        console.log("INSIDE writeUserData function");
        console.log("Appointment date : " + appointmentDate.type);
        firebase.database().ref("patients/" + location + "/" + appointmentDate.toString() + "/" + service + "/" + firstName + " " + lastName).set({
            firstname: firstName,
            lastname: lastName,
            phonenumber: phoneNumber,
            emailid: emailid
        });
    }
}
module.exports=FirebaseDatabase;



