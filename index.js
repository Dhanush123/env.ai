"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const server = express();
server.use(bodyParser.json());

server.post("/", function (req, res) {
  console.log("webhook request");
  try {
    if (req.body) {
        console.log("req.body -->",req.body);
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
  return rez.json({
    "speech": JSON.stringify(paramz)
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
});