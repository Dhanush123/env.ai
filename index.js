"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const server = express();
server.use(bodyParser.json());

server.post("/chat", function (req, res) {
  console.log("webhook request");
  try {
    if (req.body) {
        if (requestBody.result && Object.keys(requestBody.result.parameters).length == 0) {
          actions[requestBody.result.action](res);
        }
      else {
        actions[requestBody.result.action](res, requestBody.result.parameters);
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

var functions = [sensorAverage,sensorCurrent,sensorTrend];

function sensorAverage(rez, paramz) {
  return rez.json({
    "speech": paramz
  });
}

function sensorCurrent(rez, paramz) {
  return rez.json({
    "speech": paramz
  });  
}

function sensorTrend(rez, paramz) {
  return rez.json({
    "speech": paramz
  });  
}

server.listen((process.env.PORT || 8000), function () {
  console.log("chatbot server is up!!!!!!!!!!!!!!!!!!!!");
});