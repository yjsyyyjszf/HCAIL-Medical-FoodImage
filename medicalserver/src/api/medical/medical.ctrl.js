const PhotoModel = require("../../models/photo");
const MedicalModel = require("../../models/medical")

/**
 * POST api/medical/sendcomment
 *
 * @param req { filename : "name", mcomment : "mcomment", }
 * @param res Send 200 if save comment in DB, otherwise send 500
 */
exports.sendComment = async (req,res)=>
{
    try
    {
        console.log("Add comment")
        // Get photo object if photo is in photo DB, otherwise res 500
        const data = await PhotoModel.findById(req.body.photoid)

        // Set mcomment of photo object
        data.mcomment = await req.body.mcomment;
        data.mid = await req.body.mid;

        // Send 200 if photo successfully save object in DB, otherwise send 500
        data.save(function (err)
        {
            if(err)
            {
                console.log(">> Error");
                return;
            }
            console.log(">> Success");
            res.send(200);
        })
    }
    catch (err)
    {
        console.log(err)
        res.send(500);
    }
}

exports.mLogin = async (req, res)=>
{
    // Create test user
    await createTestUser();
    console.log(req.body.id)
    try
    {
        // Check id is in DB, otherwise send 401
        const user = await MedicalModel.findByloginid(req.body.id);
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



// Test user object
let testUser = new MedicalModel({
    "mname" : "testname",
    "mloginid" : "testid",
    "mpassword" : "testpw",
})


// Create test user for developer
let createTestUser = async () =>
{
    let user = await MedicalModel.findByloginid("testid")
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
