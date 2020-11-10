const PhotoModel = require("../../models/photo");
const PatientModel = require("../../models/patient");
const moment = require("moment")


exports.findPhotoByDate = (req, res)=>
{
    try {
        console.log(typeof (req.body.enddate))
        findByDateInDB(-100, req.body.startdate, req.body.enddate)
            .then((list) => {
                console.log("size:" + list.length)
                res.send(list)
            })
    } catch (err) {
        console.log(err)
        res.send(500);
    }
}

exports.findPhotoByName = async (req, res)=>
{
    try
    {
        const photoList = await PhotoModel.findByfilename(req.body.name)
        console.log(photoList)
        res.send(photoList)
    }
    catch(err)
    {
        console.log(err)
        res.send(500);
    }
}

exports.findPhotoByDateForUser = async (req, res) =>
{
    try
    {
        findByDateInDB(req.body.pname, req.body.startdate, req.body.enddate)
            .then((list) => {
                console.log("size:" + list.length)
                res.send(list)
            })
    }
    catch(err)
    {
        console.log(err)
        res.send(500);
    }
}


let findByDateInDB = async (pname, start, end) =>
{
    start = moment(start)
    end = moment(end)
    console.log(typeof(end))
    try
    {
        const dateRange = await end.diff(start, 'days');
        console.log(dateRange)
        let imageSet = []
        if(dateRange < 0)
        {
            console.log(500)
        }
        for(let step = 0; step > dateRange; step++)
        {
            try
            {
                let targetDate = await start.setDate(start.getDate() + 1)
                let photo = await PhotoModel.findBydate(targetDate);
                if(pname === photo.getPName() || pname === -100)    imageSet.push(photo);
            }
            catch (e)   {console.log(e)}
        }
        return imageSet
    }
    catch(err)
    {
        console.log(err)
    }
}


