
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
var functions = require("firebase-functions");
var admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

exports.sms_job =
  functions.pubsub.topic('hourly-tick').onPublish((event) => {

        //var dateMain = new Date(Date.now());
    //var hoursMain = dateMain.getHours();
    //var minutesMain = dateMain.getMinutes();
    var database = admin.database();
    var ref = database.ref("customer_data");
    ref.on("value",getData,getError);
    return true;
});
/*
    var firebase = require("firebase");
      var config = {
          apiKey: "AIzaSyAto6_dqcXg0-3nPQPWwhb9FlJJMUZMbr8",
          authDomain: "feedback-bf124.firebaseapp.com",
          databaseURL: "https://feedback-bf124.firebaseio.com",
          projectId: "feedback-bf124",
          storageBucket: "feedback-bf124.appspot.com",
          messagingSenderId: "747817268852"
 };
 firebase.initializeApp(config);*/
exports.readDatebase = functions.database.ref("customer_data")
 .onWrite((event)=>{

      var dataReadDataBase = event.data;
      var phoneno = dataReadDataBase.phoneNo;
      sendSms(phoneno,"submission")
   // var database = admin.database();
    //var ref = database.ref("customer_data");
    //ref.on("value",getData,getError);

      return true;
 });



 function getData(data){
   var customer_data = data.val();
   var keys = Object.keys(customer_data);
   var currentDateTime = new Date(Date.now());
   var currentDate = currentDateTime.getDate();
   var currentMonth = currentDateTime.getMonth();
   //var hours = currentDateTime.getHours();
  // console.log(hours);
   //console.log(currentMonth);
   //console.log(currentDate);
   for(var i=0;i<keys.length;i++){
      var k = i;
      var dob = customer_data[i].dateOfBirth;
      var anniversary = customer_data[i].dateOfAnniversary;
      var phoneNo = customer_data[i].phoneNo;
      if(dob !== "Not available" || anniversary !== "Not available"){
          var dsplit = dob.split(" ");
        var d = new Date(dsplit[3],dsplit[1],dsplit[0]);
        var monthDatabase = d.getMonth();
        var dateDatabase = d.getDate();
        //var date = d.getTime();
        console.log(date);
        if(dateDatabase === currentDate && monthDatabase === currentMonth){
          console.log("success");
          console.log(phoneNo);
          sendSms(phoneNo,"birthday");
        }
      }
       else if(anniversary !== "Not available"){
          var dsplit = anniversary.split(" ");
          var d = new Date(dsplit[3],dsplit[1],dsplit[0]);
        var monthDatabase = d.getMonth();
        var dateDatabase = d.getDate();
        var date = d.getTime();
        console.log(date);
        if(dateDatabase === currentDate && monthDatabase === currentMonth){
          console.log("success");
          console.log(phoneNo);
          sendSms(phoneNo,"anniversary");
        }
      }
   }
   console.log();
 }

 function getError(error){
   console.log("error Occurs!!!");
   console.log(error);
 }
 function sendSms(phoneNo,purpose){
   var http = require('http');
   var urlencode = require('urlencode');
   if(purpose === "birthday")
      var msg = urlencode('Happy Birthday');
    else if(purpose === "anniversary"){
      msg = urlencode('Happy Anniversary !!! this are the offers for you from Restog...');
    }else if(purpose === "submission"){
        msg = urlencode("Thank you for submitting the review your review is important to us");
   }
   var toNumber = phoneNo;
  var username = 'officialcafevr1@gmail.com';
  var hash = '36408521b2049ffc69356ec519b9a824c37442202a9d62fb4d170e1bee9c18e0';
 // The hash key could be found under Help->All Documentation->Your hash key.
 //Alternatively you can use your Textlocal password in plain text.
  var sender = 'txtlcl';
  var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender +
  '&numbers=' + toNumber + '&message=' + msg;
  var options = {
    host: 'api.textlocal.in', path: '/send?' + data
  };
  callback = function (response) {
   var str = '';//another chunk of data has been recieved, so append it to `str`
   response.on('data', function (chunk) {
     str += chunk;
   });//the whole response has been recieved, so we just print it out here
   response.on('end', function () {
     console.log(str);
   });
 }
 var date = new Date(Date.now());
 var hours = date.getHours();
 var minutes = date.getMinutes();
  http.request(options, callback).end();
 }
