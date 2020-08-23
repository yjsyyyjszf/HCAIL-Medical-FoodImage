const fs=require('fs');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const hound = require('hound');
const sharp = require("sharp");
const port =process.env.PORT || 3001;
const logger = require('morgan');
const mongoose = require("mongoose");
const FRdb = require("model");

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

app.use(logger('dev'))
app.use(cors());
app.use(bodyParser.json());
app.use(express.json({
    limit: "100mb",
}))
app.use(express.urlencoded({
    limit: "100mb",
    extended: false,
}))
// 폴더에 사진 추가 되면 이를 로그로 보여줌
watcher = hound.watch("./image", [])

// json이 변경되면 json 읽어옴
watcherJson = hound.watch("./image/ImageList.json", [])

watcher.on('create', function(file, stats)
{
    console.log(file + " was created")
})

watcherJson.on('change', function(file, stats)
{
    console.log(file + " was changed")
    readJson().then((list)=>imageResize(list))
})

watcher.on('delete', function(file, stats)
{
    console.log(file + " was deleted")
})

// 날짜로 사진 검색해서 넘겨줌
app.post("/date", (req, res)=>
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

// 이름으로 사진 검색해서 넘겨줌
app.post("/name", (req, res)=>
{
    try
    {
        findImageName(req.body.name, imageList)
            .then((data)=>
            {
                res.send(data)
            })
    }
    catch(err)
    {
        console.log(err)
        res.send(500);
    }
});

app.post("/sendcomment", (req,res)=>
{
    try
    {
        addComment(req.body.name, req.body.comment, imageList)
            .then((data)=>
            {
                let list = JSON.stringify(imageList)
                fs.writeFile('./image/ImageList.json', list, 'utf-8', err =>
                {
                    if(err) throw err;
                    console.log('save json!');
                })
                console.log(imageList)
                console.log(data)
            })
    }
    catch (err)
    {
        console.log(err)
        res.send(500);
    }

})

app.post("/photosave", (req, res) =>
{
    try
    {
        console.log(req.body.photoStr)
        console.log(req.body.date)
        res.send(req.body.photoStr)
    }
    catch(err)
    {
        console.log(err)
        res.send(500);
    }
})

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

// image json 파일 읽어옴
let readJson = () =>
{
    return new Promise(resolve=>
    {
        try
        {
            imageList.length = 0;
            let rawdata = fs.readFileSync("./image/ImageList.json");
            imageList = JSON.parse(rawdata);
            console.log(imageList);
            resolve(imageList)
        }
        catch(err)
        {
            console.log(err)
        }
    });
}


// 날짜 기준으로 사진 검색 후 리스트 만듬
let findImage = (start, end, list) =>
{
    let nlist = []
    return new Promise((resolve)=>
    {
        list.map((image)=>
        {
            if(start <= image.date && end >= image.date)
            {
                let data = fs.readFileSync('./image/small_' + image.name);
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


// 이름 기준으로 사진 검색해서 리스트 만듬
let findImageName = (name, list) =>
{
    return new Promise((resolve)=>
    {
        console.log("encode")
        list.map((image)=>
        {
            if(name === image.name)
            {
                console.log(name === image.name)
                let data = fs.readFileSync('./image/small_' + image.name);
                let buf = Buffer.from(data);
                let base64 = buf.toString('base64');
                let url = "data:image/jpg;base64," + base64;
                let nImage = {"title":image.name, "date":image.date, "img": url}
                console.log(nImage.title)
                resolve([nImage]);
            }
        })
    })
}

let addComment = (name, comment, list) =>
{
    return new Promise((resolve)=>
    {
        console.log("add")
        list.map((image)=>
        {
            if(name === image.name)
            {
                console.log(name === image.name)
                image.comment = comment;
                resolve(image);
            }
        })
    })
}

let imageResize = (list) =>
{
    console.log("resize")
    list.map(image=>
    {
        sharp("./image/"+image.name)
            .resize({width:900})
            .toFile("./image/small_"+image.name)
        console.log(image.name)
    })
}


// 실행하자마자 json 읽어옴
app.listen(port,'0.0.0.0' ,()=>{
    console.log(`express is running on ${port}`);
    readJson();
})




