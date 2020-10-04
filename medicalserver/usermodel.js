const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const UserdbSchema = new Schema(
    {
        username : String,
        userid : String,
        userpassword : String,
    }
)

const UserModel = mongoose.model("Usermodel", UserdbSchema)
module.exports = UserModel