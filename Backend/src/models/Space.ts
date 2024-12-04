import mongoose from "mongoose";

const spaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    width : {
        type: Number,
        required: true
    },
    height : {
        type: Number,
        required: true
    },
    elements : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'spaceElements'
    }],
    thumbnail : {
        type: String,
        required: true
    },
    creatorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
})

const Space = mongoose.model('Space', spaceSchema);
export default Space;