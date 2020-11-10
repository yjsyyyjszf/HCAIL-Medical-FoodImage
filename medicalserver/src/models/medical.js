const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const MedicalSchema = new Schema(
    {
        mname : String,
        mloginid : String,
        mpassword : String,
    }
)

MedicalSchema.static.findByloginid = function (loginid)
{
    return this.findOne({loginid})
}

MedicalSchema.methods.checkUser = function (password)
{
    return this.mpassword === password;
}

MedicalSchema.methods.getName = function () {
    return this.mname;
}

MedicalSchema.methods.serialize = function () {
    const data = this.toJSON();
    delete data.userPassword;
    return data;
};
const MedicalModel = mongoose.model("Medicalmodel", MedicalSchema)
module.exports = MedicalModel
