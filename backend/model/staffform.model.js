var mongoose = require("mongoose");
const staffSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  shift: {
    type: String,
    required: true,
  },
  approval: {
    type: Number,
    required: true,
  },
  image: { type: String, required: true },
  isAlternate: {
    type: Boolean,
    default: false,
  },
});
const EmailSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  regid: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "regType",
    required: true,
  },
  regType: {
    type: String,
    enum: ["staff", "parent", "child", "adult"],
    required: true,
  },
  approval: {
    type: Number,
    default: 0,
  },
  status: {
    type: Number,
  },
  notifications: [
    {
      type: { type: String },
      message: { type: String },
      date: { type: Date, default: Date.now },
      read: { type: Boolean, default: false }
    }
  ]
});
const RoleSchema = mongoose.Schema({
  role: {
    type: String,
    requried: true,
  },
});
// models/Billing.js

const billingSchema = mongoose.Schema({
  userName: { type: String, required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    required: true,
  },
  paymentMethod: { type: String, required: true },
  date: { type: Date, required: true },
});

//food//
const FoodSchema = mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "staff",
  },
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "child",
  },
  adultId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "adult",
  },
  name: {
    type: String,
  },
  category: {
    type: String,
  },
  type: {
    type: String,
  },
  mealTime: {
    type: String,
  },
  isViewed: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });
const RoomSchema = mongoose.Schema({
  roomname: {
    type: String,
  },
  bed: {
    type: String,
  },
  room: {
    type: String,
  },
  floor: {
    type: String,
  },
  washroom: {
    type: String,
  },
  price: {
    type: Number,
  },
  services: {
    type: String,
  },
  roomassign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "staff",
  },
});
const ActivitySchema = mongoose.Schema({
  activityName: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "staff",
    required: true,
  },
});
const lessonSchema = mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  ageGroup: {
    type: String,
    required: true,
  },
  book: {
    type: String,
    required: true,
  },
  studyTime: {
    type: String,
    required: true,
  },
  revisionTime: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  staffassign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "staff",
  },
});
const attendanceSchema = mongoose.Schema(
  {
    childName: {
      type: String,
      required: true,
    },
    parentName: {
      type: String,
      required: true,
    },
    staffName: {
      type: String,
      required: true,
    },
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "staff",
      required: true,
    },
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Validation", // Using Validation as per assignment schema
    },
    adultId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Validation",
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String, // single string now
      enum: [
        "✅ Present",
        "❌ Absent",
        "⏳ Late",
        "🔓 Check-in",
        "🔒 Check-out",
      ],
      required: true,
    },
    marked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const shiftSchema = mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "staff",
    required: true,
  },

  currentShift: {
    type: String,
    enum: ["morning", "evening", "night"],
    required: true,
  },

  newShift: {
    type: String,
    enum: ["morning", "evening", "night"],
    required: true,
  },

  reason: {
    type: String,
    required: true,
  },
  currentstatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
    required: true,
  },
});
const StaffImageSchema = mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
});
const healthSchema = mongoose.Schema({
  incident: {
    type: String,
    required: true,
  },
  report: {
    type: String,
    required: true,
  },
  childHealth: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "child",
  },
});
const materialSchema = mongoose.Schema({
  title: { type: String, required: true },
  class: { type: String, required: true },
  subject: { type: String, required: true },
  image: { type: String, required: true },
  pdf: { type: String, required: true },
  group: { type: String, required: true }, // children or adult
  date: { type: Date, default: Date.now },
  staffassign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "staff",
  },
});

const assignmentSchema = mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Validation",
    required: true,
  },
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Validation",
    required: false,
  },
  adultId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Validation",
    required: false,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "parent",
    required: true,
  },
  assignedAt: {
    type: Date,
    default: Date.now,
  },
});

const ExtracurricularActivitySchema = mongoose.Schema(
  {
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "staff",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    group: {
      type: String,
      enum: ["children", "adult"],
      required: true,
    },
  },
  { timestamps: true }
);

const milestoneSchema = mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "staff",
    required: true,
  },
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Validation",
  },
  adultId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Validation",
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "parent",
    required: true,
  },
  milestoneType: {
    type: String,
    enum: ["child", "adult"],
    required: true,
  },
  milestones: {
    type: [String], // ✅ Fix here
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// const healthReportSchema = mongoose.Schema({
//   staffId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "staff",
//     required: true,
//   },
//   childId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "child",
//     required: false, // Changed to false to allow adult-only reports
//   },
//   adultId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "adult",
//     required: false,
//   },
//   parentId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "parent",
//     required: true,
//   },
//   height: { type: Number, required: true },
//   weight: { type: Number, required: true },
//   bmi: { type: String, required: true },
//   incidentDescription: { type: String, required: true },
//   image: { type: String, required: true },
//   date: { type: Date, default: Date.now }, // Automatically sets current date
// });

const healthReportSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "staff",
    required: true,
  },

  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "child",
    default: null,
  },

  adultId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "adult",
    default: null,
  },

  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "parent",
    required: true,
  },

  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  bmi: { type: String, required: true },
  incidentDescription: { type: String, required: true },
  image: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

healthReportSchema.pre("validate", function (next) {
  if (!this.childId && !this.adultId) {
    return next(new Error("Either childId or adultId is required"));
  }

  if (this.childId && this.adultId) {
    return next(new Error("Only one of childId or adultId must be set"));
  }

  next();
});

const complianceSchema = mongoose.Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "parent",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: Number,
    enum: [0, 1, 2, 3], // 0=pending,1=inprogress,2=resolved,3=rejected
    default: 0,
  },
});
const messageSchema = mongoose.Schema({
  from: { type: String, required: true }, // userId of sender
  to: { type: String, required: true }, // userId of receiver
  text: { type: String, required: true },
  time: { type: Date, default: Date.now },
});

const paymentSchema = mongoose.Schema({
  paymentid: { type: String, required: true },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "parent",
    required: true,
  },
  payer: { type: String, required: true },
  amount: { type: Number, required: true },
  roomTotal: { type: Number },
  lessonTotal: { type: Number },
  grandTotal: { type: Number },
  date: { type: Date, default: Date.now },
});

const medicationSchema = mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "child",
  },
  adultId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "adult",
  },
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  time: { type: String, required: true }, // e.g., "08:00 AM"
  instructions: { type: String },
  takenHistory: [{
    date: { type: Date, default: Date.now },
    status: { type: Boolean, default: true }
  }],
  isViewed: { type: Boolean, default: false },
});

const emailModel = mongoose.model("Validation", EmailSchema);
const staffModel = mongoose.model("staff", staffSchema);
const roleModel = mongoose.model("role", RoleSchema);
const foodModel = mongoose.model("food", FoodSchema);
const roomModel = mongoose.model("room", RoomSchema);
const activityModel = mongoose.model("activity", ActivitySchema);
const lessonModel = mongoose.model("lesson", lessonSchema);
const attendanceModel = mongoose.model("attendance", attendanceSchema);
const shiftModel = mongoose.model("shift", shiftSchema);
const staffImageModel = mongoose.model("staffimage", StaffImageSchema);
const healthModel = mongoose.model("health", healthSchema);
const materialModel = mongoose.model("material", materialSchema);
const milestoneSchemaModel = mongoose.model("milestone", milestoneSchema);
const assignmentModel = mongoose.model("assignment", assignmentSchema);
const extracurricularModel = mongoose.model(
  "extracurricular",
  ExtracurricularActivitySchema
);
const HealthReportModel = mongoose.model("HealthReport", healthReportSchema);
const complianceModel = mongoose.model("Compliance", complianceSchema);
const messageModel = mongoose.model(" message", messageSchema);
const paymentModel = mongoose.model("Payment", paymentSchema);
const medicationModel = mongoose.model("Medication", medicationSchema);
const emergencyLogSchema = mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Who triggered it
  senderType: { type: String, enum: ['child', 'staff', 'parent', 'adult'], required: true },
  message: { type: String, required: true },
  location: { type: String }, // Optional coordinates or room name
  status: { type: String, enum: ['sent', 'delivered', 'failed'], default: 'sent' },
  createdAt: { type: Date, default: Date.now }
});

const emergencyLogModel = mongoose.model("EmergencyLog", emergencyLogSchema);

const quizSchema = mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true }, // e.g., 'Health', 'History', 'General'
  questions: [{
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
  }],
  pointsAwarded: { type: Number, default: 10 },
  createdAt: { type: Date, default: Date.now }
});

const quizModel = mongoose.model("Quiz", quizSchema);

const immunizationSchema = mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "child" },
  adultId: { type: mongoose.Schema.Types.ObjectId, ref: "adult" },
  vaccineName: { type: String, required: true },
  dateAdministered: { type: Date, required: true },
  administeredBy: { type: String },
  nextDueDate: { type: Date },
  status: { type: String, enum: ['completed', 'pending', 'due'], default: 'completed' },
  notes: { type: String }
});

const immunizationModel = mongoose.model("Immunization", immunizationSchema);

module.exports = {
  staffModel,
  emailModel,
  roleModel,
  foodModel,
  roomModel,
  activityModel,
  lessonModel,
  attendanceModel,
  shiftModel,
  staffImageModel,
  healthModel,
  materialModel,
  assignmentModel,
  extracurricularModel,
  milestoneSchemaModel,
  HealthReportModel,
  complianceModel,
  messageModel,
  paymentModel,
  medicationModel,
  emergencyLogModel,
  quizModel,
  immunizationModel
};
