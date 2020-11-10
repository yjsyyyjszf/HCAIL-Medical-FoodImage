const express = require('express');
const photo = express.Router();
const photoCtrl = require("./photo.ctrl")


// Todo : connect DB
/*
app.get("/get", (req,res)=>
{
    try
    {
        res.send(imageList)
    }
    catch(err)
    {
        console.log(err)
        res.send(500)
    }
})
*/

// Find picture using date in DB
photo.post("/date", photoCtrl.findPhotoByDate);

// Find picture using photo name in DB
photo.post("/name", photoCtrl.findPhotoByName);

photo.post("/dateforpatient", photoCtrl.findPhotoByDateForUser);

module.exports = photo;

