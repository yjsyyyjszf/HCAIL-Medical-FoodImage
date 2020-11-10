const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port =process.env.PORT || 3001;
const logger = require('morgan');
const mongoose = require("mongoose");
const api = require("./src/api/index");


app.use(express.json({
    limit: "50mb"
}))

app.use(express.urlencoded({
    limit: "50mb",
    extended : false,
}))

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit:'50mb', extended: true, parameterLimit:true }))
app.use(bodyParser.json());
app.use(logger('dev'))
app.use(cors());

app.use("", api);


mongoose.connect("mongodb://localhost:27017/FRdb",
    {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    }).then(()=>
{
    console.log("Connected to MongoDB");
})
    .catch((e)=>
    {
        console.log(e);
    })


app.listen(port,'0.0.0.0' ,()=>{
    console.log(`express is running on ${port}`);
})
