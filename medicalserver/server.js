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

let imageList = [];

app.use(cors());

app.use(bodyParser.json());

app.post("/view", (req, res)=>
{
    try
    {
        findImage(req.body.startdate, req.body.enddate, imageList)
            .then((list)=>
            {
                console.log("size:"+list.length)
                res.send(list)
            })
    }
    catch(err)
    {
        console.log(err)
        res.send(500);
    }

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


let readJson = () =>
{
    try
    {
        let rawdata = fs.readFileSync("./image/ImageList.json");
        imageList = JSON.parse(rawdata);
        console.log(imageList);
    }
    catch(err)
    {
        console.log(err)
    }
}

let findImage = (start, end, list) =>
{
    let nlist = []
    return new Promise((resolve)=>
    {
        list.map((image)=>
        {
            if(start <= image.date && end >= image.date)
            {
                let data = fs.readFileSync('./image/' + image.name);

                let buf = Buffer.from(data);
                let base64 = buf.toString('base64');
                let url = "data:image/jpg;base64," + base64;
                let nImage = {"title":image.name, "date":image.date, "img": url}
                nlist.push(nImage);

            }
        })
        console.log("encode")
        resolve(nlist);
    })
}



readJson();