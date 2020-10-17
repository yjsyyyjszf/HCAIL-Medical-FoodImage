const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const FRdbSchema = new Schema({
    photoname: String,
    date : Object,
    latitude : String,
    longitude: String,
    img : String,
    encodeImg : String,
    comment : String,
})

FRdbSchema.statics.findByPhotoname = function (photoname)
{
    return this.findOne({photoname});
}

FRdbSchema.static.findByPhotodate = function (date)
{
    return this.findOne({date})
}

const FRModel = mongoose.model("FRmodel", FRdbSchema)
module.exports = FRModel


