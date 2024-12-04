import mongoose from "mongoose";

const mapElementsSchema = new mongoose.Schema({
    mapId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Map'
    },
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
    }
})

const mapElements = mongoose.model('MapElements',mapElementsSchema);
export default mapElements;