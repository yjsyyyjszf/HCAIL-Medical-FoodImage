const express = require('express');
const api = express.Router();

const patient = require("./patient/index")
const medical = require("./medical/index")
const photo = require("./photo/index")

api.use("/patient", patient)
api.use("/medical", medical)
api.use("/photo", photo)

module.exports = api;