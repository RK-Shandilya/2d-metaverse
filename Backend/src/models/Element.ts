import mongoose from "mongoose";

const elementSchema = new mongoose.Schema({
    width : {
        type : Number,
        required : true
    },
    height : {
        type : Number,
        required : true
    },
    static : {
        type : Boolean,
        default: true
    },
    imageUrl : {
        type : String,
        required : true
    },
    spaces : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Space'
    }],
    mapElements: [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'MapElement'
    }]
})

const Element = mongoose.model('Element', elementSchema);
export default Element;