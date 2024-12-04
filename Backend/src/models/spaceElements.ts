import mongoose from "mongoose";

const spaceElementsSchema = new mongoose.Schema({
    x : {
        type : Number,
        required : true
    },
    y : {
        type : Number,
        required : true
    },
    elementId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Element'
    },
    spaceId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Space'
    }
})

const spaceElements = mongoose.model('spaceElement', spaceElementsSchema);
export default spaceElements;