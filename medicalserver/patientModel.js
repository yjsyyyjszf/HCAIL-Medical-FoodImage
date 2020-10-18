const mongoose = require("mongoose")

const Schema = mongoose.Schema;

// Todo : 환자에 대한 dbSchema
const PatientdbSchema = new Schema({
    userId : String,
    userPassword : String,
    userName : String,
})

PatientdbSchema.statics.findByUserId = function (userId)
{
    return this.findOne({userId: userId});
}

PatientdbSchema.statics.findByUserPassword = function (userPassword)
{
    return this.findOne({userPassword});
}

PatientdbSchema.methods.getUserId = function () {
    return this.userId;
}

PatientdbSchema.methods.checkUser = function (password)
{
    return (this.userPassword == password);
}

PatientdbSchema.methods.serialize = function () {
    const data = this.toJSON();
    delete data.userPassword;
    return data;
};

const PatientModel = mongoose.model("PatientModel", PatientdbSchema)
module.exports = PatientModel