"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const firebase = require("firebase");
const stats = require("stats-lite");

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
var database;

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
  database.ref('/sensors').once('value').then(function(snapshot) {
    var average = 0;
    var numEntries = 0;
    var sensorData = snapshot.val();
    sensorPredict(paramz["sensor"], sensorData);
    for (var entry in sensorData) {
      average += sensorData[entry][paramz["sensor"]];
      numEntries += 1;
    }
    average = average/numEntries;
    return rez.json({
      "speech": "The average "+paramz["sensor"]+" is "+average.toFixed(2)+" degrees"
    }); 
  });
}

function sensorCurrent(rez, paramz) {
  database.ref('/sensors').once('value').then(function(snapshot) {
    var num = 0;
    var sensorData = snapshot.val();
    sensorPredict(paramz["sensor"], sensorData);
    for (var entry in sensorData) {
      num = sensorData[entry][paramz["sensor"]];
      break;
    }
    return rez.json({
      "speech": "The current "+paramz["sensor"]+" is "+num.toFixed(2)+" degrees"
    }); 
  });
}

function sensorTrend(rez, paramz) {
  return rez.json({
    "speech": JSON.stringify(paramz)
  });  
}

function sensorPredict(typz, data) {
  var array = [];
  for (var entry in data) {
    array.push(data[entry][typz]);
  }
  var val = stats.mean(array) + stats.stdev(array);
  var obj = {};
  obj[typz] = parseFloat(val.toFixed(2));
  database.ref("predict").update(obj);
//  var param = "/predict/"+typz;
//  var updatez = {
//  };
//  update[param] = val;
//  database.ref().update(updatez);
}

server.listen((process.env.PORT || 8000), function () {
  console.log("chatbot server is up!!!!!!!!!!!!!!!!!!!!");
  firebase.initializeApp(config);
  database = firebase.database();
});