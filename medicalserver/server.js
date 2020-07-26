const fs=require('fs');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer')
const port =process.env.PORT || 3001;

const storage = multer.diskStorage
({
    destination: function (req,file,callback)
    {
        callback(null, 'image');
    },
    filename : function (req,file,callback)
    {
        callback(null, (file.originalname));
    }
});

const upload = multer({storage:storage})

app.use(cors());

app.use(bodyParser.json());

app.post("/upload", upload.single('image'), (req, res, next)=>
{
    console.log(req.file.originalname)
    res.send(200);
});

app.get("/show/:filename", (req, res)=>
{
    fs.readFile('./image/'+req.params.filename, (error, data)=>
    {
        if(error)
        {
            console.log(error)
            res.send(500);
        }
        else
        {
            res.writeHead(200, {'Content-Type':'image/jpg'})
            console.log(data)
            let buf = Buffer.from(data);
            let base64 = buf.toString('base64');
            res.end(base64);
        }
    });
});


app.listen(port, ()=>{
    console.log(`express is running on ${port}`);
})