import mongoose from "mongoose";

const avatarSchema = new mongoose.Schema({
    imageUrl : {
        type : String,
        required : true
    },
    name: {
        type: String,
        required: true
    },
    users : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }]
})

const Avatar = mongoose.model('Avatar', avatarSchema);
export default Avatar;