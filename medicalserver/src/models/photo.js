const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
    filename: String,
    date : Object,
    latitude : String,
    longitude: String,
    img : String,
    encodeimg : String,
    pcomment : String,
    mcomment : String,
    mid : String,
    pid : String,
})

PhotoSchema.statics.findByfilename = function (filename)
{
    return this.findOne({filename});
}
PhotoSchema.statics.findBydate = function (date)
{
    return this.findOne({date})
}
PhotoSchema.methods.getPName = function ()
{
    return this.pname;
}

PhotoSchema.statics.findById = function (_id)
{
    return this.findOne({_id});
}

const PhotoModel = mongoose.model("Photomodel", PhotoSchema)
module.exports = PhotoModel


