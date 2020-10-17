const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
//const multer = require('multer');
const resizebase64 = require('resize-base64')
const port =process.env.PORT || 3001;
const logger = require('morgan');
const mongoose = require("mongoose");
const moment = require("moment")

const FRModel = require("./model");


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

/*
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
 */

//const upload = multer({storage:storage})

app.use(logger('dev'))
app.use(cors());


let addPhotoToDB=(data, callback)=>
{
    console.log('AddPhoto : ' +data.name);
    imageResize(data.photoStr).then((smallUrl)=>
    {
        let photo = new FRModel({
            "photoname": data.name,
            "latitude" : data.latitude,
            "longitude" : data.longitude,
            "date": data.date,
            "img" : data.photoStr,
            "encodeImg" : smallUrl,
            "comment" : null,
        });

        photo.save(function (err)
        {
            if(err)
            {
                callback(err, null);
                console.log("Error");
                return;
            }
            console.log("Success");
            callback(null, photo);
        })
    })
}

// Find picture using date in DB
app.post("/date", (req, res)=>
{
    try
    {
        findImageByDate(req.body.startdate, req.body.enddate)
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

// Find picture using photo name in DB
app.post("/name", async (req, res)=>
{
    try
    {
        const data = await FRModel.findByPhotoname(req.body.name)
        console.log(data)
        res.send(data)
    }
    catch(err)
    {
        console.log(err)
        res.send(500);
    }
});


// Todo: Fix /sendcomment api (connect DB)
app.post("/sendcomment", async (req,res)=>
{
    try
    {
        console.log("Add comment")
        const data = await FRModel.findByPhotoname(req.body.name)
        data.comment = await req.body.comment;
        data.save(function (err)
        {
            if(err)
            {
                console.log(">> Error");
                return;
            }
            console.log(">> Success");
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
    console.log(req.body.longitude)
    try
    {
        addPhotoToDB(req.body, ()=>console.log("Can't add photo to DB"))
        res.send(200)
    }
    catch(err)
    {
        console.log(err)
        res.send(500);
    }
})


let findImageByDate = async (start, end) =>
{
    const dateRange = await moment.duration(end.diff(start)).asDays();
    let imageSet = []
    if(dateRange < 0)
    {
        console.log(500)
    }
    for(let step = 0; step > dateRange; step++)
    {
        try {
            let targetDate = await start.setDate(start.getDate() + 1)
            let photo = await FRModel.findByPhotodate(targetDate);
            imageSet.push(photo)
        } catch (e) {
            console.log(e)
        }
    }
    return imageSet
}

let imageResize = (photoStr) =>
{
    console.log("resize")
    return resizebase64(photoStr, 900, 900)
}


app.listen(port,'0.0.0.0' ,()=>{
    console.log(`express is running on ${port}`);
})

//const fs=require('fs');

/*
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

 */

/*
let changePhotoToUrl=(photoStr)=>
{
    return new Promise((resolve)=>
    {
        let smallPhotoUrl = fs.readFileSync('./image/small_' + data.name +'.jpg');
        let photoUrl = fs.readFileSync('./image/' + data.name +'.jpg');
        let buf = Buffer.from(photoUrl);
        let smallbuf = Buffer.from(smallPhotoUrl)
        let base64 = buf.toString('base64');
        let smallbase64 = smallbuf.toString('base64');
        let url = "data:image/jpg;base64," + base64;
        let smallUrl = "data:image/jpg;base64," +smallbase64;
        resolve(url, smallUrl);
    })
}
 */

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

// 날짜 기준으로 사진 검색 후 리스트 만듬
/*
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
*/

// 이름 기준으로 사진 검색해서 리스트 만듬
/*
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
*/

/*let addComment = async (name, comment, list) =>
{
    console.log("Add comment")
    const data = await FRModel.findByPhotoname(req.body.name)
    data.comment = comment;

    return new Promise((resolve)=>
    {

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
 */
