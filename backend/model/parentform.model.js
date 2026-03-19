var mongoose=require("mongoose")
var parentSchema=mongoose.Schema({
    parentname:{
        type:String,
        required:true
    },
    childname:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    approval:{
        type:Number,
        required:true
 },
 deactivation :{
    type:Number,  
}
, image: { type: String, required: true },
})
const parentCommunicationSchema = new mongoose.Schema({
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "parent",
        required: true
    },
    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "staff",
        required: true
    },
    message: {
        type: String,
        required: true
    },
    emoji: {
        type: String,
        default: ""
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    
});

const ParentCommunication = mongoose.model("ParentCommunication", parentCommunicationSchema);
module.exports = ParentCommunication;

const parentModel=mongoose.model("parent",parentSchema) 
module.exports={parentModel}
