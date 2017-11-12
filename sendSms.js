var dateMain = new Date(Date.now());
var hoursMain = dateMain.getHours();
var minutesMain = dateMain.getMinutes();
    var firebase = require("firebase");
      var config = {
          apiKey: "AIzaSyAto6_dqcXg0-3nPQPWwhb9FlJJMUZMbr8",
          authDomain: "feedback-bf124.firebaseapp.com",
          databaseURL: "https://feedback-bf124.firebaseio.com",
          projectId: "feedback-bf124",
          storageBucket: "feedback-bf124.appspot.com",
          messagingSenderId: "747817268852"
 };
 firebase.initializeApp(config);
 var database = firebase.database();
 var ref = database.ref("customer_data");
 ref.on("value",getData,getError);
 
 function getData(data){
   var customer_data = data.val();
   var keys = Object.keys(customer_data);
   var currentDateTime = new Date(Date.now());
   var currentDate = currentDateTime.getDate();
   var currentMonth = currentDateTime.getMonth();
   var hours = currentDateTime.getHours();
   console.log(hours);
   console.log(currentMonth);
   console.log(currentDate);
   for(var i=0;i<keys.length;i++){
      var k = keys[i];
      var dob = customer_data[k].dateOfBirth;
      var anniversary = customer_data[k].dateOfAnniversary;
      var phoneNo = customer_data[k].phoneNo;
      if(dob !== "Not available" || anniversary !== "Not available"){
        var d = new Date(dob.split("/").reverse());
        var monthDatabase = d.getMonth();
        var dateDatabase = d.getDate();
        var date = d.getTime();
        console.log(date);
        if(dateDatabase === currentDate && monthDatabase === currentMonth){
          console.log("success");
          console.log(phoneNo);
          sendSms(phoneNo,"birthday");
        }
      }
      else if(anniversary !== "Not available"){
        var d = new Date(anniversary.split("/").reverse());
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
      var msg = urlencode('Happy Anniversary !!! this are the offers for you from Restog...');
    }
   var toNumber = phoneNo;
  var username = 'restogdigitalsolution@gmail.com';
  var hash = '951fb93f755083037012460c1800e50ab325c47efcf6ef4364217655a6b4ec6b';
 // The hash key could be found under Help->All Documentation->Your hash key.
 //Alternatively you can use your Textlocal password in plain text.
  var sender = 'TXTLCL';
  var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + toNumber + '&message=' + msg;
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
 /*const functions = require("firebase-functions");
 const admin = require("firebase-admin");
 admin.intializeApp(functions.config.firebase);*/
