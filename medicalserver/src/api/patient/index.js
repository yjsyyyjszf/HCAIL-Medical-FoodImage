const express = require('express');
const patient = express.Router();
const patientCtrl = require("./patient.ctrl")

patient.post("/photosave", patientCtrl.photoSave);
patient.post("/loginpatient", patientCtrl.pLogin);
patient.get("/getname", patientCtrl.getName);
patient.post("/user", patientCtrl.findByUser)

module.exports = patient;