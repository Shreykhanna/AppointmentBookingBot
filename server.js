const express=require('express');
const path=require('path');
const bodyParser=require('body-parser');
const app=express();
const firebase=require("firebase");
let Database=require('./database/crud.js');
let obj=new Database();
let appointmentDate,location,services,template,child,subchild,count,unavailableDates=[];
class Server{
    constructor(){
        this.initViewEngine();
        this.initExpressMiddlewares();
        this.initroutes();
        this.start();
    }
    initroutes()
    {
        app.get('/',function (request,response) {
                response.render('chathtml.ejs');
                 /*   response.render("home.ejs",{
                    dates:unavailableDates
                });*/
         });
        /*app.get('/start',function (request,response) {
            response.send("Hi, I am your appointment booking assistant.");
        });*/
        app.post('/date',function (request,response){
            if(request.xhr) {
                console.log("INSIDE GET FUNCTION");
                console.log("JSON DATA : "+request);
                location=request.body.location;
                appointmentDate = request.body.appointment_date;
                services=request.body.services;
                console.log("Appointment date : ",appointmentDate);
                console.log("Location via ajax: ",request.body.location);
                obj.getdatelocation(appointmentDate,location, response);
                response.send({success: true});
            }
        });
        app.post('/details',function(request,response){
            console.log("appointment date : "+ appointmentDate);
            const firstname=request.body.first_name;
            const lastname=request.body.last_name;
            const phonenumber=request.body.phone_number;
            const emailId=request.body.email_id;
            obj.writeUserData(location,appointmentDate,services,firstname,lastname,phonenumber,emailId);
            response.send({success:true});
        });
        app.post('/checkavailability',function (request,response) {
            var unavailabledates=[];
            if(request.xhr) {
                console.log("Location entered : " + request.body.location);
                location = request.body.location;
                console.log("LOCATION ENTERED BY THE USER : "+location);
                firebase.database().ref("patients/").on('value', function (snapshot) {
                    console.log(snapshot.val());
                    for (child in snapshot.val()) {
                        firebase.database().ref("patients/").child(child).on('value', function (snapshot) {
                            if(child==location){
                                for (template in snapshot.val()) {
                                    firebase.database().ref("patients/").child(child).child(template).on('value', function (snapshot) {
                                        {
                                            for (subchild in snapshot.val()) {
                                                count = snapshot.numChildren();
                                                console.log("DATE AND THEIR COUNT VALUE: " + template + "," + count);
                                             }
                                            if (count >= 4) {
                                                unavailabledates.push(template);
                                            }
                                        }
                                    })
                                }
                            }
                        });
                    }
                    console.log("unvailable dates : "+unavailabledates);
                    if(unavailableDates.length>0)
                    {
                        unavailableDates=[];
                        unavailableDates.push(unavailabledates);
                    }else{
                        unavailableDates.push(unavailabledates);
                    }
                    console.log("UNAVAILABLE DATES : "+unavailableDates);
                    });
                response.send({success: true});
            }
        });
    }
    start()
    {
        app.listen(3000,function () {
           console.log('started');
        });
    }
    initViewEngine()
    {
        app.set('view engine','ejs');
        app.set('views',path.join(__dirname,'views'));
    }
    initExpressMiddlewares()
    {
        app.use('/public',express.static(path.join(__dirname + '/public')));
        //app.use(express.static('public'));
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
    }
}
new Server();

