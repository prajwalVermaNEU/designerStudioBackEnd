import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    processList: { type: String, required: false}
},
{
    versionKey: false
})

const userModel = mongoose.model('user', userSchema);

export default userModel;
