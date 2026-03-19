var mongoose = require("mongoose");

var leaveSchema = mongoose.Schema({
    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "staff",
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    adminResponse: {
        type: String,
        default: "",
    },
    substituteStaffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "staff",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const leaveModel = mongoose.model("leave", leaveSchema);
module.exports = { leaveModel };
