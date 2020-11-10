const PhotoModel = require("../../models/photo.js");
const PatientModel = require("../../models/patient.js");
const resizebase64 = require('resize-base64')


/**
 * POST api/patient/photosave
 *
 * @param req   new photo
 * @param res   Send 200 if photo is successfully saved to DB, otherwise 500
 */
exports.photoSave = (req, res) =>
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
}


/**
 * POST api/patient/loginpatient
 * @param req { ploginid : "id", ppassword : "password", }
 * @param res Send user object if login is success, or send 401 if login is fail, otherwise send 500
 */
exports.pLogin = async (req, res)=>
{
    // Create test user
    await createTestUser();
    console.log(req.body.id)
    try
    {
        // Check id is in DB, otherwise send 401
        const user = await PatientModel.findByloginid(req.body.id);
        if(!user)
        {
            res.send(401);
            return;
        }

        // Send user object excluding password if password is correct, otherwise send 401
        if(user.checkUser(req.body.password))
        {
            res.send(user.serialize());
            return;
        }
        res.send(401);
    }
    catch(err)
    {
        console.log(err)
        res.send(500);
    }
}

exports.getName = async (req, res) =>
{
    await createTestUser();
    try
    {
        let pNameList = [];
        let pData = await PatientModel.find({})
        for(let i = 0; i < pData.length; i++) {
            console.log(pData[i])
            pNameList.push(pData[i].getName())
        }
        res.send(pNameList);
    }
    catch(err)
    {
        console.log(err)
        res.send(500);
    }

}

exports.findByUser = async (req, res) =>
{
    try
    {
        const data = await PatientModel.findByUserName(req.body.name)
        console.log(data)
        res.send(data)
    }
    catch(err)
    {
        console.log(err)
        res.send(500);
    }
}



/**
 * Save new photo in photo DB.
 * Set "pid" and "encodeImg" in this.photo schema
 * {
 *     img : "photoStr",
 *     date : "date",
 *     longitude : "longitude",
 *     latitude : "latitude",
 * }
 */
let addPhotoToDB=(data, callback)=>
{
    console.log('AddPhoto : ' +data.name);
    imageResize(data.photoStr).then((smallUrl)=>
    {
        // Make photo object
        let photo = new PhotoModel({
            "photoname": data.name,
            "latitude" : data.latitude,
            "longitude" : data.longitude,
            "date": data.date,
            "img" : data.photoStr,
            "encodeimg" : smallUrl,
            "comment" : null,
        });

        // Save photo in photo DB
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

/**
 * Resize the original photo to a smaller size
 * Keeping the proportions (maxWidth 900, maxHeight 900)
 * @param photoStr      base64 of original size of photo
 * @returns {string}    base64 of small size photo
 */
let imageResize = (photoStr) =>
{
    console.log("resize")
    return resizebase64(photoStr, 900, 900)
}


// Test user object
let testUser = new PatientModel({
    "pname" : "testname",
    "ploginid" : "testid",
    "ppassword" : "testpw",
})


// Create test user for developer
let createTestUser = async () =>
{
    let user = await PatientModel.findByloginid("testid")
    if(!user)
    {
        testUser.save(function (err)
        {
            if(err)
            {
                console.log("Error");
                return;
            }
            console.log("Success");
        })
    }
}
