import mongoose from "mongoose";

const mapSchema = new mongoose.Schema({
    name : {
        type : String,
    },
    width : {
        type : Number,
        required : true
    },
    height : {
        type : Number,
        required : true
    },
    thumbnail : {
        type : String,
        required : true
    },
    mapElements : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "mapElements"
    }]
})

const mapModel = mongoose.model("Map", mapSchema);
export default mapModel;