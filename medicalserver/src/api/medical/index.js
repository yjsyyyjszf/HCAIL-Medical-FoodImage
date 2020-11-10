const express = require('express');
const medical = express.Router();
const medicalCtrl = require("./medical.ctrl")

medical.post("/sendcomment", medicalCtrl.sendComment)
medical.post("/login", medicalCtrl.mLogin)

module.exports = medical;