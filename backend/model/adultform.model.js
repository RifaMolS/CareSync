var mongoose = require("mongoose")
var adultSchema = mongoose.Schema({
    // guardianname:{
    //     type:String,
    //     required:true
    // },
    adultname: {
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

const adultModel = mongoose.model("adult", adultSchema)
// module.exports = { adultModel }


const MedicationSchema = new mongoose.Schema({
    adultId: { type: String, required: true },    // link to adult.regid or adult _id
    childId: { type: String },                    // optional if you keep child meds too
    name: { type: String, required: true },
    dosage: { type: String },
    time: { type: String },                       // human readable schedule/time
    instructions: { type: String },
    takenHistory: [{ date: Date, status: Boolean }]
}, { timestamps: true });

const medicationModel = mongoose.model('medication_adult_duplicate', MedicationSchema); // Renamed to avoid OverwriteModelError if any
module.exports = { adultModel, medicationModel };