var mongoose = require("mongoose")
var childSchema = mongoose.Schema({
    // parentname:{
    //     type:String,
    //     required:true
    // },
    childname: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    approval: {
        type: Number,
        required: true

    }, image: { type: String, required: true },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "parent",
        required: true
    },
    rewards: {
        type: Number,
        default: 0
    },
    badges: [{
        name: { type: String, required: true },
        points: { type: Number, default: 0 },
        date: { type: Date, default: Date.now }
    }],
    moods: [{
        mood: String,
        note: String,
        date: { type: Date, default: Date.now }
    }]

})

const childModel = mongoose.model("child", childSchema)
module.exports = { childModel }
