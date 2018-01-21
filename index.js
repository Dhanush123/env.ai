"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const server = express();
server.use(bodyParser.json());

server.listen((process.env.PORT || 8000), function () {
  console.log("chatbot server is up!!!!!!!!!!!!!!!!!!!!");
});