"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const firebase = require("firebase");

const server = express();
server.use(bodyParser.json());

var config = {
  apiKey: "AIzaSyC9SEhQV-_TRFoSDomQPQga0ms2l607h6c",
  authDomain: "env-ai.firebaseapp.com",
  databaseURL: "https://env-ai.firebaseio.com",
  projectId: "env-ai",
  storageBucket: "env-ai.appspot.com",
  messagingSenderId: "49236414526"
};

// Get a reference to the database service
var database = firebase.database();

server.post("/", function (req, res) {
  console.log("webhook request");
  try {
    if (req.body) {
//        console.log("req.body -->",req.body);
        if (req.body.result && Object.keys(req.body.result.parameters).length == 0) {
          functions[req.body.result.action](res);
        }
      else {
        functions[req.body.result.action](res, req.body.result.parameters);
      }
    }
  }
  catch (err) {
    console.log("error in server endpoint!!!!!");
    console.error("Cannot process request", err);
    return res.status(400).json({
      status: {
        code: 400,
        errorType: err.message
      }
    });
  }
});

var functions = {sensorAverage,sensorCurrent,sensorTrend};

function sensorAverage(rez, paramz) {
  firebase.database().ref('/sensor').once('value').then(function(snapshot) {
    var average = 0;
    var numEntries = 0;
    var sensorData = snapshot.val();
    console.log("sensorData",sensorData);
    for (var entry in sensorData) {
      average += entry[paramz["sensor"]];
      numEntries += 1;
    }
    average = average/numEntries;
    return rez.json({
      "speech": "The average "+paramz["sensor"]+" is "+average
    }); 
  });
}

function sensorCurrent(rez, paramz) {
  return rez.json({
    "speech": JSON.stringify(paramz)
  });  
}

function sensorTrend(rez, paramz) {
  return rez.json({
    "speech": JSON.stringify(paramz)
  });  
}

server.listen((process.env.PORT || 8000), function () {
  console.log("chatbot server is up!!!!!!!!!!!!!!!!!!!!");
  firebase.initializeApp(config);
});