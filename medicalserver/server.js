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
const moment = require("moment")

const FRModel = require("./model");


app.use(express.json({
    limit: "50mb"
}))
app.use(express.urlencoded({
    limit: "50mb"
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

// DB에 추가하기
let addUserToDB=(data, callback)=>
{
    console.log('addUser 호출됨 : ' +data.name);
    changePhotoToUrl(data).then((url, smallUrl)=>
    {
        let photo = new FRModel({
            "photoname": data.name,
            "latitude" : data.latitude,
            "longitude" : data.longitude,
            "date": data.date,
            "img" : url,
            "encodeImg" : smallUrl,
        });

        photo.save(function (err)
        {
            if(err)
            {
                callback(err, null);
                console.log("실패");
                return;
            }
            console.log("데이터 추가함");
            callback(null, photo);
        })
    })
}

let changePhotoToUrl=(data)=>
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

// 날짜로 사진 검색해서 넘겨줌
app.post("/date", (req, res)=>
{
    try
    {
        findImageByDate(req.body.startdate, req.body.enddate, imageList)
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
    let {photoStr, date, longitude, latitude} = req.body
    console.log(longitude)
    console.log(latitude)
    try
    {
        let time = moment(date).add(9,'hours').format("YYYYMMDDHHmmss")
        let data = {
            name : time+'.jpg',
            date : moment(date).add(9,'hours').format("YYYYMMDD"),
            longitude : longitude,
            latitude : latitude,
        }

        fs.writeFile('./image/'+time+".jpg", String(photoStr), {encoding: 'base64'}, err =>
        {
            if(err) throw err;
            console.log('save image!');
            imageList.push(data)
            fs.writeFile('./image/ImageList.json', JSON.stringify(imageList), 'utf-8', err =>
                {
                    if(err) throw err;
                    console.log('save json!');
                })
            addUserToDB(data, ()=>console.log("Can't add photo to DB"))
            console.log(imageList)
        })


        res.send(200)
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
    //readJson();
})




