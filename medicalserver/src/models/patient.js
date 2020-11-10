const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const PatientSchema = new Schema(
    {
        pname : String,
        ploginid : String,
        ppassword : String,
    }
)

PatientSchema.statics.findByloginid = function (ploginid)
{
    return this.findOne({ploginid});
}

PatientSchema.statics.findByUserName = function (pname)
{
    return this.findOne({pname});
}

PatientSchema.methods.checkUser = function (password)
{
    return this.ppassword === password;
}

PatientSchema.methods.getName = function () {
    return this.pname;
}

PatientSchema.methods.serialize = function () {
    const data = this.toJSON();
    delete data.userPassword;
    return data;
};


const PatientModel = mongoose.model("Patientmodel", PatientSchema)

module.exports = PatientModel