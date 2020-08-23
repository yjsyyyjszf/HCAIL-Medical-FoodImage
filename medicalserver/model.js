const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const FRdbSchema = new Schema({
    photoname: String,
    date : Object,
    latitude : String,
    longitude: String,
    img : String,
    encodeImg : String,
})

FRdbSchema.statics.findByPhotoname = function (photoname)
{
    return this.findOne({photoname});
}


