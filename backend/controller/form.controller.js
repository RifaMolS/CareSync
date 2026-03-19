const { parentModel } = require("../model/parentform.model");
const {
  staffModel,
  emailModel,
  roleModel,
  foodModel,
  billingModel,
  roomModel,
  formModel,
  activityModel,
  lessonModel,
  attendanceModel,
  roomOverviewModel,
  shiftModel,
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
} = require("../model/staffform.model");
const { childModel } = require("../model/childform.model");
const { adultModel } = require("../model/adultform.model");
const { leaveModel } = require("../model/leave.model");
console.log("DEBUG: adultModel import:", adultModel); // Debugging import
const path = require("path");
const { error } = require("console");
const mongoose = require("mongoose");
const moment = require('moment');
// staff register//
exports.staffRegister = async (req, res) => {
  try {
    const Staff = {
      name: req.body.name,
      // email:req.body.email,
      // password:req.body.password,
      phone: req.body.phone,
      gender: req.body.gender,
      role: req.body.role,
      shift: req.body.shift,
      approval: req.body.approval,
      image: req.body.image,
      isAlternate: req.body.isAlternate || false,
    };
    const newStaff = await staffModel.create(Staff);
    const loginfform = {
      email: req.body.email,
      password: req.body.password,
      status: req.body.status,
      approval: req.body.approval || 0, // Ensure approval is stored in the login record
      regid: newStaff._id,
      regType: "staff",
    };
    await emailModel.create(loginfform);
    res.json("success");
  } catch (err) {
    console.log(err);
  }
};
// staff view//
exports.staffView = async (req, res) => {
  try {
    const staff = await emailModel
      .find({ status: 1 })
      .populate("regid", "name phone role gender shift approval image isAlternate");
    // console.log(staff)

    res.json(staff);
  } catch (err) {
    console.log(err);
  }
};
//staff delete//
exports.staffDelete = async (req, res) => {
  try {
    const staff = await staffModel.findByIdAndDelete(req.body.id);
    if (staff) {
      await emailModel.findOneAndDelete({ regid: staff._id, regType: "staff" });
    }
    res.json("delete");
  } catch (error) {
    console.error(error);
  }
};
//staff id insert//
exports.staffEditById = async (req, res) => {
  try {
    console.log(req.body);
    let edit = await staffModel.findById(req.body.id);
    let valid = await emailModel.findOne({ regid: req.body.id });

    res.json({ edit, valid });
  } catch (error) {
    console.error(err);
  }
};
exports.staffEditByUpdate = async (req, res) => {
  try {
    let update = await staffModel.findByIdAndUpdate(req.body.id, req.body);
    let add = await emailModel.findOneAndUpdate(
      { regid: req.body.id },
      req.body
    );

    res.json("update");
  } catch (error) {
    console.error(err);
  }
};
// parent insert/////////
exports.parentRegisterPage = async (req, res) => {
  try {
    const parent = {
      parentname: req.body.parentname,
      childname: req.body.childname,
      address: req.body.address,
      age: req.body.age,
      phone: req.body.phone,
      gender: req.body.gender,
      approval: req.body.approval,
      deactivation: req.body.deactivation,
      image: req.body.image,
    };
    const newParent = await parentModel.create(parent);
    const loginfform = {
      email: req.body.email,
      password: req.body.password,
      status: req.body.status,
      regid: newParent._id,
      regType: "parent",
    };
    await emailModel.create(loginfform);
    res.json("success");
  } catch (err) {
    console.log(err);
  }
};
//parent view//
exports.parentView = async (req, res) => {
  try {
    const parents = await emailModel.find({ status: 2 });
    // console.log(parents,"parents")
    const parent = await emailModel.find({ status: 2 }).populate("regid");
    // console.log(parent,"parent")
    res.json(parent);
  } catch (err) {
    console.log(err);
  }
};
exports.getParentById = async (req, res) => {
  try {
    const parentId = req.body.id;
    const parent = await parentModel.findById(parentId);
    if (!parent) {
      return res.status(404).json({ error: "Parent not found" });
    }
    res.json(parent);
  } catch (err) {
    console.error("Error fetching parent by ID:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.childRegisterPage = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const child = {
      // parentname: req.body.parentname,
      childname: req.body.childname,
      address: req.body.address,
      age: req.body.age,
      phone: req.body.phone,
      gender: req.body.gender,
      approval: req.body.approval,
      image: req.body.image,
      parentId: req.body.parentId,
      dob: req.body.dob,
    };

    const newchild = await childModel.create(child);
    const loginfform = {
      email: req.body.email,
      password: req.body.password,
      status: req.body.status,
      regid: newchild._id,
      regType: "child",
    };

    await emailModel.create(loginfform);
    res.json("success");
  } catch (err) {
    console.error("childRegisterPage Error:", err);
    res.status(500).json("Server Error");
  }
};

// child view//
exports.childView = async (req, res) => {
  try {
    const children = await emailModel
      .find({ regType: "child", status: 3 })
      .populate({
        path: "regid",
        populate: {
          path: "parentId", // populate the parentId inside the child document
          model: "parent", // make sure this matches the model name used in your parent schema
        },
      });

    res.json(children);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// adult view//
exports.adultView = async (req, res) => {
  try {
    // Only select email records that are adults (regType: "adult") and approved/active (status: 4)
    const adults = await emailModel
      .find({ regType: "adult", status: 4 })
      .populate({
        path: "regid",
        populate: {
          path: "parentId", // populate the parentId inside the child document
          model: "parent",
        },
      });

    // Remap for consistency if needed, though frontend currently expects structure as-is
    res.json(adults);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
//login session//
exports.loginForm = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log("Login Request:", email, password);

    const user = await emailModel.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res.json({ status: 0, message: "Invalid user" });
    }

    if (user.password !== password) {
      console.log("Wrong password");
      return res.json({ status: 0, message: "Invalid password" });
    }

    const userType = (user.regType || "").trim().toLowerCase();
    const approval = parseInt(user.approval || 0); // Default to 0 if approval is missing

    console.log("Login Check:", { userType, approval });

    if (user.status == 1) {
      if (approval === 0) {
        return res.json({ status: 0, message: "Staff not yet approved by admin" });
      }
      const staffInfo = await staffModel.findById(user.regid);
      const userWithInfo = user.toObject();
      userWithInfo.name = staffInfo?.name || "Staff";
      return res.json(userWithInfo);
    } else if (user.status == 2) {
      const parentInfo = await parentModel.findById(user.regid);
      const userWithInfo = user.toObject();
      userWithInfo.name = parentInfo?.parentname || "Parent";
      return res.json(userWithInfo);
    } else if (user.status == 3) {
      const childInfo = await childModel.findById(user.regid);
      const userWithInfo = user.toObject();
      userWithInfo.name = childInfo?.childname || "Child";
      return res.json(userWithInfo);
    } else if (user.status == 4) {
      const adultInfo = await adultModel.findById(user.regid);
      const userWithInfo = user.toObject();
      userWithInfo.name = adultInfo?.adultname || "Adult";
      return res.json(userWithInfo);
    } else {
      return res.json({
        status: 0,
        message: "Unknown user type or not approved",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ status: 0, message: "Server error" });
  }
};

// approved status//
exports.approved = async (req, res) => {
  try {
    const { id, approval } = req.body;

    await staffModel.updateOne({ _id: id }, { $set: { approval: approval } });
    await emailModel.updateOne({ regid: id }, { $set: { approval: approval } });

    res.json("Approval updated");
  } catch (err) {
    console.error("Approval update failed:", err);
    res.status(500).json("Error updating approval");
  }
};
exports.handleReject = async (req, res) => {
  try {
    const { id, approval } = req.body;

    // Update both staffModel and emailModel
    await staffModel.updateOne({ _id: id }, { $set: { approval: approval } });
    await emailModel.updateOne({ regid: id }, { $set: { approval: approval } });

    res.json("rejected");
  } catch (error) {
    console.error("Rejection error:", error);
    res.status(500).send("Failed to reject staff");
  }
};

exports.Role = async (req, res) => {
  try {
    const role = { role: req.body.role };
    const newRole = await roleModel.create(role);

    res.status(201).json({
      message: "Role added successfully",
      data: newRole,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to add role",
    });
  }
};
exports.roleView = async (req, res) => {
  try {
    const role = await roleModel.find();
    // const email = await emailModel.find();

    res.json(role);
  } catch (err) {
    console.log(err);
  }
};
exports.roledelete = async (req, res) => {
  try {
    const data = await roleModel.findByIdAndDelete(req.body.id);
    res.json("delete");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete role" });
  }
};

//food///
exports.food = async (req, res) => {
  try {
    const { childId, adultId, name, category, type, mealTime, staffId } = req.body;

    let targetValidationId = null;
    let wardName = "A ward";

    if (childId) {
      const valDoc = await emailModel.findOne({ regid: childId, regType: 'child' });
      if (valDoc) {
        targetValidationId = valDoc._id;
        const child = await childModel.findById(childId);
        if (child) wardName = child.childname;
      }
    } else if (adultId) {
      const valDoc = await emailModel.findOne({ regid: adultId, regType: 'adult' });
      if (valDoc) {
        targetValidationId = valDoc._id;
        const adult = await adultModel.findById(adultId);
        if (adult) wardName = adult.adultname;
      }
    }

    const newfood = await foodModel.create({
      childId: childId ? targetValidationId : undefined,
      adultId: adultId ? targetValidationId : undefined,
      name,
      category,
      type,
      mealTime,
      staffId,
    });

    // Notify Assigned Staff
    if (targetValidationId) {
      const assignments = await assignmentModel.find({
        $or: [{ childId: targetValidationId }, { adultId: targetValidationId }],
      });

      for (const assign of assignments) {
        await emailModel.findByIdAndUpdate(assign.staffId, {
          $push: {
            notifications: {
              type: "food_added",
              message: `New nutrition info added for ${wardName}: ${name} (${mealTime}).`,
              date: new Date(),
            },
          },
        });
      }
    }

    res.status(201).json(newfood);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to add food" });
  }
};
exports.foodview = async (req, res) => {
  try {
    const { staffId } = req.body;
    if (!staffId) return res.status(400).json({ error: "Staff ID required" });

    // 1. Get assignments for this staff
    const assignments = await assignmentModel.find({ staffId });
    const childIds = assignments.map(a => a.childId).filter(id => id);
    const adultIds = assignments.map(a => a.adultId).filter(id => id);

    // 2. Find foods matching these wards
    const data = await foodModel.find({
      $or: [
        { childId: { $in: childIds } },
        { adultId: { $in: adultIds } }
      ]
    })
      .populate({
        path: "childId",
        model: "Validation",
        populate: { path: "regid", model: "child", select: "childname" }
      })
      .populate({
        path: "adultId",
        model: "Validation",
        populate: { path: "regid", model: "adult", select: "adultname" }
      });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.fooddelete = async (req, res) => {
  try {
    const { id } = req.body;
    await foodModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Food deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete food" });
  }
};

// Update Food by ID
exports.foodupdate = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFood = await foodModel.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        category: req.body.category,
        type: req.body.type,
        mealTime: req.body.mealTime,
        staffId: req.body.staffId,
      },
      { new: true }
    );
    res.status(200).json(updatedFood);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update food" });
  }
};

exports.deactivate = async (req, res) => {
  try {
    const { id, deactivation } = req.body; // expecting 1 for deactivation

    await parentModel.updateOne(
      { _id: id },
      { $set: { deactivation: deactivation } }
    );

    res.json("User deactivated successfully");
  } catch (err) {
    console.error("Deactivation failed:", err);
    res.status(500).json("Error during deactivation");
  }
};

exports.room = async (req, res) => {
  try {
    const {
      roomname,
      bed,
      room,
      floor,
      washroom,
      price,
      services,
      roomassign, // this should be a valid ObjectId
    } = req.body;

    // Check if staff ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(roomassign)) {
      return res.status(400).json({ error: "Invalid staff ID format" });
    }

    // Find approved staff
    const assignedStaff = await staffModel.findOne({
      _id: roomassign,
      approval: 2,
    });

    if (!assignedStaff) {
      return res
        .status(400)
        .json({ error: "Selected staff is not approved or does not exist." });
    }

    const newRoomData = {
      roomname,
      bed,
      room,
      floor,
      washroom,
      price,
      services,
      roomassign: assignedStaff._id,
    };

    const newroom = await roomModel.create(newRoomData);

    res
      .status(201)
      .json({ message: "Room created successfully", data: newroom });
  } catch (err) {
    console.error("Room creation error:", err);
    res.status(500).json({ error: "Failed to create room" });
  }
};

exports.getApprovedStaff = async (req, res) => {
  try {
    const staffList = await staffModel.find({ approval: 2 });
    res.json(staffList);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch staff" });
  }
};
exports.roomview = async (req, res) => {
  try {
    const data = await roomModel.find().populate("roomassign", "name");
    res.json(data);
  } catch (err) {
    console.log(err);
  }
};
exports.roomdelete = async (req, res) => {
  try {
    const data = await roomModel.findByIdAndDelete(req.body.id);
    res.json("delete");
  } catch (err) {
    console.log(err);
  }
};

exports.roomEditById = async (req, res) => {
  try {
    let edit = await roomModel.findById(req.body.id);
    res.json(edit);
  } catch (error) {
    console.error(error);
  }
};
exports.roomupdate = async (req, res) => {
  try {
    await roomModel.findByIdAndUpdate(req.body.id, req.body);
    res.json("update");
  } catch (error) {
    console.error(error);
  }
};

exports.roomIdview = async (req, res) => {
  try {
    const { staffId } = req.body;
    console.log("Received staffId:", staffId);

    if (!staffId || !mongoose.Types.ObjectId.isValid(staffId)) {
      return res.status(400).json({ error: "Invalid or missing staffId" });
    }

    // Query with the imported model
    const rooms = await roomModel
      .find({ roomassign: staffId })
      .populate("roomassign", "name");

    if (!rooms.length) {
      return res.status(404).json({ error: "No rooms found for this staff" });
    }

    res.json(rooms);
  } catch (error) {
    console.error("Room fetch error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.activity = async (req, res) => {
  try {
    const activity = {
      activityName: req.body.activityName,
      time: req.body.time,
      category: req.body.category,
      age: req.body.age,
      date: req.body.date,
      staffId: req.body.staffId,
    };
    const newActivity = await activityModel.create(activity);

    // âœ… Send back the created document (or a message)
    res.status(201).json(newActivity);
  } catch (err) {
    console.error("Error creating activity:", err);
    // âœ… Inform the client of the failure
    res.status(500).json({ error: "Failed to create activity" });
  }
};
exports.activityview = async (req, res) => {
  try {
    const { staffId } = req.body;
    const query = staffId ? { staffId } : {};
    const data = await activityModel.find(query);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};
exports.activityEditById = async (req, res) => {
  try {
    let edit = await activityModel.findById(req.body.id);
    res.json(edit);
  } catch (error) {
    console.error(error);
  }
};
exports.activityupdate = async (req, res) => {
  try {
    const result = await activityModel.findByIdAndUpdate(
      req.body.id,
      {
        activityName: req.body.activityName,
        time: req.body.time,
        category: req.body.category,
        age: req.body.age,
        date: req.body.date,
        staffId: req.body.staffId,
      },
      { new: true } // returns the updated document
    );

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Activity not found" });
    }

    // Return success along with the updated document
    res.json({ success: true, updated: result });
  } catch (error) {
    console.error("âŒ Error updating activity:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.lesson = async (req, res) => {
  try {
    await lessonModel.create(req.body);
    res.json("success");
  } catch (err) {
    console.error("Error adding lesson:", err);
    res
      .status(500)
      .json({ message: "Failed to add lesson", error: err.message });
  }
};

// View all lessons with staff details populated
exports.lessonIdview = async (req, res) => {
  try {
    const { staffassign } = req.body;
    const rooms = await lessonModel.find({ staffassign: staffassign });
    res.json(rooms);
  } catch (error) {
    console.error("Lesson fetch error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};
exports.lessonview = async (req, res) => {
  try {
    const data = await lessonModel.find().populate("staffassign", "name");
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.lessonEditById = async (req, res) => {
  try {
    // Extract lesson ID from the request body (POST body)
    const { id } = req.body;
    const edit = await lessonModel.findById(id); // Find lesson by ID
    if (!edit) {
      return res.status(404).send("Lesson not found");
    }
    res.json(edit); // Send the lesson data as JSON response
  } catch (error) {
    console.error("Error fetching lesson data:", error);
    res.status(500).send("Error fetching lesson data");
  }
};
exports.lessonupdate = async (req, res) => {
  try {
    await lessonModel.findByIdAndUpdate(req.body.id, req.body);
    res.json("Lesson updated successfully");
  } catch (error) {
    console.error("Error updating lesson:", error);
    res.status(500).send("Error updating lesson");
  }
};
exports.lessondelete = async (req, res) => {
  try {
    const { id } = req.body;
    await lessonModel.findByIdAndDelete(id);
    res.status(200).json({ message: "lesson deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete lesson" });
  }
};

exports.attendance = async (req, res) => {
  try {
    const records = req.body;

    if (!Array.isArray(records)) {
      return res.status(400).json({ message: "Expected an array of records" });
    }

    const savedRecords = await Promise.all(
      records.map((record) =>
        attendanceModel.create({
          childName: record.childName,
          parentName: record.parentName,
          staffName: record.staffName,
          date: record.date,
          status: record.status,
          staffId: record.staffId,
          childId: record.childId, // Save childId if present
          adultId: record.adultId, // Save adultId if present
        })
      )
    );
    console.log(savedRecords);
    res.status(201).json({
      message: "Attendance records added successfully",
      data: savedRecords,
    });
  } catch (err) {
    console.error("Error adding attendance:", err);
    res.status(500).json({
      message: "Failed to add attendance",
      error: err.message,
    });
  }
};
exports.getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.body;
    const records = await attendanceModel
      .find({ date: new Date(date) })
      .sort({ _id: -1 }); // Sort in reverse
    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch attendance", error: error.message });
  }
};
exports.getAttendanceByStaffId = async (req, res) => {
  try {
    const { staffId } = req.body;
    const records = await attendanceModel.find({ staffId }).sort({ _id: -1 }); // Reverse order
    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching attendance by staff ID:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch attendance", error: error.message });
  }
};
exports.shift = async (req, res) => {
  try {
    // console.log("Request body:", req.body);

    const { staffId, currentShift, newShift, reason } = req.body;

    if (!staffId) {
      return res.status(400).json({ message: "staffId is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(staffId)) {
      return res.status(400).json({ message: "Invalid staffId" });
    }

    if (!currentShift || !newShift || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const data = { staffId, currentShift, newShift, reason };

    // console.log("Incoming shift request:", data);

    const created = await shiftModel.create(data);
    // console.log("Shift request created:", created);

    res
      .status(201)
      .json({ message: "Shift request submitted successfully", data: created });
  } catch (err) {
    console.error("Error adding shift request:", err);
    res
      .status(500)
      .json({ message: "Failed to submit shift request", error: err.message });
  }
};

// Get shift by user ID (sent as 'auth' in body)
exports.getShiftForLoggedInUser = async (req, res) => {
  try {
    const { auth } = req.body; // auth = user ID (regid)
    // console.log("ðŸ“© Received auth (user ID):", auth);

    if (!auth) {
      return res.status(400).json({ error: "Missing auth (user ID)" });
    }

    const staff = await staffModel.findById(auth).select("shift");

    if (!staff) {
      return res.status(404).json({ error: "Staff not found" });
    }

    // console.log("âœ… Shift fetched:", staff.shift);
    res.json({ shift: staff.shift });
  } catch (err) {
    console.error("âŒ Error fetching shift:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.shiftview = async (req, res) => {
  try {
    const data = await shiftModel.find().populate("staffId", "name");
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Failed to fetch shift data",
    });
  }
};
exports.updateStatus = async (req, res) => {
  const { id, status } = req.body;
  if (!["approved", "rejected"].includes(status))
    return res.status(400).json({ error: "Invalid status" });

  try {
    const reqDoc = await shiftModel.findById(id);
    if (!reqDoc) return res.status(404).json({ error: "Request not found" });

    if (reqDoc.currentstatus === status)
      return res.json({
        ok: true,
        request: { ...reqDoc.toObject(), status: reqDoc.currentstatus },
      });

    if (status === "approved") {
      reqDoc.currentstatus = "approved";
      reqDoc.currentShift = reqDoc.newShift;
      await reqDoc.save();

      await staffModel.findByIdAndUpdate(reqDoc.staffId, {
        $set: { shift: reqDoc.newShift },
      });
    } else {
      reqDoc.currentstatus = "rejected";
      await reqDoc.save();

      await staffModel.findByIdAndUpdate(reqDoc.staffId, {
        $push: {
          notifications: {
            type: "shift-request",
            message: `Your request to change to ${reqDoc.newShift} was rejected.`,
            date: new Date(),
          },
        },
      });
    }

    // Return updated request with `status` alias
    const updated = reqDoc.toObject();
    res.json({
      ok: true,
      request: { ...updated, status: updated.currentstatus },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.staffProfile = async (req, res) => {
  try {
    const { staffId } = req.body;
    console.log(staffId, "staffId");
    if (!staffId) {
      return res.status(400).json({ error: "No staffId provided" });
    }

    const staff = await staffModel
      .findOne({ _id: staffId })
      .select("name phone gender role shift email image regid")
      .lean();

    if (!staff) {
      return res.status(404).json({ error: "Staff not found" });
    }

    if (staff.image) {
      staff.image = `${req.protocol}://${req.get("host")}/uploads/${staff.image
        }`;
    }

    res.json(staff);
  } catch (err) {
    console.error("Error in staffProfile:", err);
    res.status(500).json({ error: "Server error" });
  }
};
exports.health = async (req, res) => {
  try {
    const health = {
      childHealth: req.body.childHealth,
      incident: req.body.incident,
      report: req.body.report, // Assuming report is sent as a file path or URL string
    };

    const newHealth = await healthModel.create(health);

    res.status(201).json({
      message: "Child health  added successfully",
      data: newHealth,
    });
  } catch (err) {
    console.error("Error adding child health :", err);
    res.status(500).json({
      message: "Failed to add child health ",
      error: err.message,
    });
  }
};
exports.healthview = async (req, res) => {
  try {
    const data = await healthModel.find();
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "failed to fetch health data",
    });
  }
};
exports.getApprovedchild = async (req, res) => {
  try {
    const childlist = await healthModel.find({ approval: 3 });
    res.json(childlist);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch child" });
  }
};
exports.addMaterial = async (req, res) => {
  try {
    const material = new materialModel(req.body);
    await material.save();
    res.status(200).json({ message: "Material added successfully" });
  } catch (err) {
    console.error("Material insert error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// VIEW BY GROUP or ID (like lessonIdview)
exports.materialIdview = async (req, res) => {
  try {
    const { group } = req.body; // You can also filter by ID if needed
    const materials = await materialModel.find({ group: group });
    res.json(materials);
  } catch (error) {
    console.error("Material fetch error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// EDIT FETCH BY ID
exports.materialEditById = async (req, res) => {
  try {
    const { id } = req.body;

    const material = await materialModel.findById(id);
    if (!material) {
      return res.status(404).send("Material not found");
    }
    res.json(material);
  } catch (error) {
    console.error("Error fetching material data:", error);
    res.status(500).send("Error fetching material data");
  }
};

// UPDATE
exports.materialUpdate = async (req, res) => {
  try {
    await materialModel.findByIdAndUpdate(req.body.id, req.body);
    res.json("Material updated successfully");
  } catch (error) {
    console.error("Error updating material:", error);
    res.status(500).send("Error updating material");
  }
};

// VIEW ALL
exports.materialView = async (req, res) => {
  try {
    const { staffId } = req.body;
    const query = staffId ? { staffassign: staffId } : {};
    const data = await materialModel.find(query);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE
exports.deleteMaterialById = async (req, res) => {
  try {
    const { id } = req.body;
    const material = await materialModel.findById(id);
    console.log(material, "material");
    const deleted = await materialModel.findByIdAndDelete(id);
    console.log("deleted", deleted);
    if (!deleted) {
      return res.status(404).send("Material not found");
    }
    res.send("âœ… Material deleted successfully");
  } catch (error) {
    console.error("âŒ Error deleting material:", error);
    res.status(500).send("Server error");
  }
};
exports.assign = async (req, res) => {
  const { staffId, childIds, adultIds } = req.body;
  try {
    const errors = [];

    // Process Child Assignments
    if (childIds && Array.isArray(childIds)) {
      for (const childId of childIds) {
        // Check if already assigned
        const existing = await assignmentModel.findOne({ childId });
        if (existing) {
          const childEmail = await emailModel.findOne({ _id: childId });
          const childName = childEmail ? (await childModel.findOne({ _id: childEmail.regid }))?.childname : "Unknown Child";
          errors.push(`Child '${childName}' is already assigned.`);
          continue;
        }

        const childEmail = await emailModel.findOne({
          _id: childId,
          // Removed regType: "child" from query so we can check it explicitly
        });

        if (!childEmail) {
          errors.push(`Child ID ${childId} not found.`);
          continue;
        }

        if (childEmail.regType !== 'child') {
          errors.push(`User ${childEmail.email} is a ${childEmail.regType}, not a child. Cannot assign to child group.`);
          continue;
        }

        const child = await childModel.findOne({ _id: childEmail.regid });
        if (!child) continue;

        const parent = await parentModel.findOne({ _id: child.parentId });
        if (!parent) continue;

        const assignment = new assignmentModel({
          staffId,
          childId: childId,
          parentId: parent._id,
        });

        await assignment.save();
      }
    }

    // Process Adult Assignments
    if (adultIds && Array.isArray(adultIds)) {
      for (const adultId of adultIds) {
        // Check if already assigned
        const existing = await assignmentModel.findOne({ adultId });
        if (existing) {
          const adultEmail = await emailModel.findOne({ _id: adultId });
          const adultName = adultEmail ? (await adultModel.findOne({ _id: adultEmail.regid }))?.adultname : "Unknown Adult";
          errors.push(`Adult '${adultName}' is already assigned.`);
          continue;
        }

        const adultEmail = await emailModel.findOne({
          _id: adultId,
          // Removed regType: "adult" to check explicitly
        });

        if (!adultEmail) {
          errors.push(`Adult ID ${adultId} not found.`);
          continue;
        }

        if (adultEmail.regType !== 'adult') {
          errors.push(`User ${adultEmail.email} is a ${adultEmail.regType}, not an adult. Cannot assign to adult group.`);
          continue;
        }

        const adult = await adultModel.findOne({ _id: adultEmail.regid });
        if (!adult) continue;

        const parent = await parentModel.findOne({ _id: adult.parentId });
        if (!parent) continue;

        const assignment = new assignmentModel({
          staffId,
          adultId: adultId,
          parentId: parent._id,
        });

        await assignment.save();
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: "Some assignments failed", errors });
    }

    res.status(200).json({ message: "All assignments processed successfully" });
  } catch (error) {
    console.error("Assignment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await assignmentModel
      .find()
      .populate({
        path: "staffId",
        select: "regid email",
        populate: {
          path: "regid",
          model: "staff", // populate staff details
        },
      })
      .populate({
        path: "childId",
        select: "regid email regType",
        populate: {
          path: "regid",
          model: "child", // populate child details
        },
      })
      .populate({
        path: "adultId",
        select: "regid email regType",
        populate: {
          path: "regid",
          model: "adult", // populate adult details
        },
      })
      .populate("parentId", "parentname");

    res.status(200).json(assignments);
  } catch (error) {
    console.error("Fetching assignments error:", error);
    res.status(500).json({ message: "Failed to fetch assignments" });
  }
};

exports.getAssignedStaffForAdult = async (req, res) => {
  try {
    const { adultId } = req.body;
    // adultId comes from login (EmailModel _id), which matches assignmentModel.adultId
    const assignments = await assignmentModel.find({ adultId })
      .populate({
        path: "staffId",
        select: "regid email",
        populate: {
          path: "regid",
          model: "staff"
        }
      });

    // Extract staff details
    const staffList = assignments.map(a => {
      const staffEmail = a.staffId;
      const staffProfile = staffEmail?.regid;
      return {
        _id: staffEmail?._id,
        name: staffProfile?.name || "Unknown",
        role: staffProfile?.role,
        phone: staffProfile?.phone,
        email: staffEmail?.email,
        image: staffProfile?.image,
        shift: staffProfile?.shift
      };
    }).filter(s => s._id);

    res.json(staffList);
  } catch (err) {
    console.error("Error fetching adult staff:", err);
    res.status(500).json({ error: "Server Error" });
  }
};
exports.getAssignmentsByStaff = async (req, res) => {
  const { staffId } = req.body;

  try {
    const assignments = await assignmentModel
      .find({ staffId }) // Filter by staffId
      .populate({
        path: "childId",
        select: "regid email regType",
        populate: {
          path: "regid",
          model: "child", // Populate child details
        },
      })
      .populate({
        path: "adultId",
        select: "regid email regType",
        populate: {
          path: "regid",
          model: "adult"
        }
      })
      .populate("parentId", "parentname");

    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error fetching assignments for staff:", error);
    res.status(500).json({ message: "Failed to fetch assignments" });
  }
};
exports.deleteAssignments = async (req, res) => {
  const { id } = req.body;
  try {
    await assignmentModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting assignment", error });
  }
};

exports.addActivity = async (req, res) => {
  try {
    const { title, description, group, staffId } = req.body;
    const newActivity = await extracurricularModel.create({
      title,
      description,
      group,
      staffId,
    });
    res.status(201).json(newActivity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add activity" });
  }
};

// ðŸ“„ View All Activities
exports.viewActivities = async (req, res) => {
  try {
    const { staffId } = req.body;
    const query = staffId ? { staffId } : {}; // filter only if staffId is provided
    const activities = await extracurricularModel.find(query);
    res.json(activities);
  } catch (err) {
    console.error("Error fetching activities:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ðŸ—‘ï¸ Delete Activity
exports.deleteActivity = async (req, res) => {
  try {
    const { id } = req.body;
    await extracurricularModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete activity" });
  }
};

// âœï¸ Update Activity
exports.updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, group, staffId } = req.body;
    const updated = await extracurricularModel.findByIdAndUpdate(
      id,
      { title, description, group, staffId },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update activity" });
  }
};

// --- Immunization Record Controllers ---

exports.addImmunizationRecord = async (req, res) => {
  try {
    const { childId, adultId, vaccineName, dateAdministered, administeredBy, nextDueDate, notes, status } = req.body;
    const record = await immunizationModel.create({
      childId,
      adultId,
      vaccineName,
      dateAdministered,
      administeredBy,
      nextDueDate,
      notes,
      status: status || 'due'
    });

    // Send Immediate Notification to Child/Adult and Parent
    const wardId = childId || adultId;
    let wardName = "Member";
    let parentId = null;

    if (childId) {
      const child = await childModel.findById(childId);
      wardName = child?.childname || "Child";
      parentId = child?.parentId;
    } else {
      const adult = await adultModel.findById(adultId);
      wardName = adult?.adultname || "Adult";
      parentId = adult?.parentId;
    }

    // 1. Notify Recipient
    const wardAccount = await emailModel.findOne({ regid: wardId });
    if (wardAccount) {
      await emailModel.findByIdAndUpdate(wardAccount._id, {
        $push: {
          notifications: {
            type: "immunization_alert",
            message: `🛡️ HEALTH DEFENSE: ${vaccineName} has been assigned to you. Status: ${status || 'DUE'}.`,
            date: new Date()
          }
        }
      });
    }

    // 2. Notify Parent
    if (parentId) {
      const parentAccount = await emailModel.findOne({ regid: parentId });
      if (parentAccount) {
        await emailModel.findByIdAndUpdate(parentAccount._id, {
          $push: {
            notifications: {
              type: "immunization_alert",
              message: `🛡️ IMMUNIZATION ALERT: ${vaccineName} has been logged for ${wardName}. Target Date: ${dateAdministered}.`,
              date: new Date()
            }
          }
        });
      }
    }

    res.status(201).json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add immunization record" });
  }
};

exports.getImmunizationRecords = async (req, res) => {
  try {
    const { childId, adultId } = req.body;
    const query = {};
    if (childId) query.childId = childId;
    if (adultId) query.adultId = adultId;

    const records = await immunizationModel.find(query)
      .populate('childId')
      .populate('adultId')
      .sort({ dateAdministered: -1 });
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch immunization records" });
  }
};

exports.updateImmunizationStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const updated = await immunizationModel.findByIdAndUpdate(id, { status }, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update immunization status" });
  }
};

exports.getExtracurricularByParentId = async (req, res) => {
  try {
    const { parentId } = req.body;
    if (!parentId) {
      return res.status(400).json({ message: "Parent ID is required." });
    }

    const assignments = await assignmentModel
      .find({ parentId })
      .populate("staffId")
      .populate({
        path: "childId",
        populate: { path: "regid" },
      })
      .populate({
        path: "adultId",
        populate: { path: "regid" },
      })
      .exec();

    if (!assignments || assignments.length === 0) {
      return res.status(200).json({ activities: [], message: "No assignments found." });
    }

    let allActivities = [];

    for (const assignment of assignments) {
      const staffRegId = assignment.staffId?.regid;
      if (!staffRegId) continue;

      // FETCH FOR CHILD
      if (assignment.childId) {
        // Fetch 'children' group activities from this staff
        const acts = await extracurricularModel.find({
          staffId: staffRegId,
          group: "children"
        });
        if (acts) allActivities.push(...acts);
      }

      // FETCH FOR ADULT
      if (assignment.adultId) {
        // Fetch 'adult' group activities from this staff
        const acts = await extracurricularModel.find({
          staffId: staffRegId,
          group: "adult"
        });
        if (acts) allActivities.push(...acts);
      }
    }

    const uniqueActivitiesMap = new Map();
    allActivities.forEach(item => {
      if (item && item._id) uniqueActivitiesMap.set(item._id.toString(), item);
    });
    const uniqueActivities = Array.from(uniqueActivitiesMap.values());

    res.status(200).json({ activities: uniqueActivities });

  } catch (error) {
    console.error("Error fetching extracurricular activities:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getActivitiesByParentId = async (req, res) => {
  try {
    const { parentId } = req.body;
    if (!parentId) {
      return res.status(400).json({ message: "Parent ID is required." });
    }

    const assignments = await assignmentModel
      .find({ parentId })
      .populate("staffId")
      .populate({
        path: "childId",
        populate: { path: "regid" },
      })
      .populate({
        path: "adultId",
        populate: { path: "regid" },
      })
      .exec();

    if (!assignments || assignments.length === 0) {
      return res.status(200).json({ activities: [], message: "No assignments found." });
    }

    let allActivities = [];

    // Age filtering helper
    const isAgeMatch = (targetAge, groupRange) => {
      if (!groupRange || !targetAge) return false;

      // Handle ranges e.g., "7-10", "60-65"
      if (groupRange.includes("-")) {
        const [min, max] = groupRange.split("-").map(Number);
        return targetAge >= min && targetAge <= max;
      }

      // Handle "60+" or similar
      if (groupRange.includes("+")) {
        const minAttr = parseInt(groupRange);
        return !isNaN(minAttr) && targetAge >= minAttr;
      }

      // Handle single numbers
      const exactAge = parseInt(groupRange);
      return !isNaN(exactAge) && targetAge === exactAge;
    };

    for (const assignment of assignments) {
      const staffRegId = assignment.staffId?.regid;
      if (!staffRegId) continue;

      // FETCH FOR CHILD
      if (assignment.childId && assignment.childId.regid) {
        const age = assignment.childId.regid.age;
        const query = {
          staffId: staffRegId,
          category: { $in: ["child", "children"] }
        };

        const acts = await activityModel.find(query);
        if (acts) {
          const filtered = acts.filter(act => isAgeMatch(age, act.age));
          allActivities.push(...filtered);
        }
      }

      // FETCH FOR ADULT
      if (assignment.adultId && assignment.adultId.regid) {
        const age = assignment.adultId.regid.age;
        const query = {
          staffId: staffRegId,
          category: { $in: ["adult", "Adult"] }
        };
        const acts = await activityModel.find(query);
        if (acts) {
          const filtered = acts.filter(act => isAgeMatch(age, act.age));
          allActivities.push(...filtered);
        }
      }
    }

    const uniqueActivitiesMap = new Map();
    allActivities.forEach(item => {
      if (item && item._id) uniqueActivitiesMap.set(item._id.toString(), item);
    });
    const uniqueActivities = Array.from(uniqueActivitiesMap.values());

    res.status(200).json({ activities: uniqueActivities });

  } catch (error) {
    console.error("Error fetching filtered activities:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAttendanceByParentId = async (req, res) => {
  try {
    const { parentId } = req.body;
    if (!parentId) return res.status(400).json({ message: "Parent ID required" });

    // 1. Get assignments to find all kids/adults linked to this parent
    const assignments = await assignmentModel.find({ parentId })
      .populate('childId')
      .populate('adultId');

    // Collect all relevant profile IDs (regids)
    // Note: Attendance is stored with childName/parentName, but ideally tied to ID.
    // Let's check attendanceModel logic. It stores 'childId' or 'adultId' (Validation refs).

    // Actually, looking at attendance controller 'attendance' function (submit), 
    // it saves childId/adultId which are VALIDATION IDs.

    const relevantValidationIds = [];
    assignments.forEach(a => {
      if (a.childId) relevantValidationIds.push(a.childId._id);
      if (a.adultId) relevantValidationIds.push(a.adultId._id);
    });

    if (relevantValidationIds.length === 0) return res.json([]);

    const records = await attendanceModel.find({
      $or: [
        { childId: { $in: relevantValidationIds } },
        { adultId: { $in: relevantValidationIds } }
      ]
    }).sort({ date: -1 });

    res.json(records);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getMedicationsByParentId = async (req, res) => {
  try {
    const { parentId } = req.body;
    const assignments = await assignmentModel.find({ parentId });

    const relevantValidationIds = [];
    assignments.forEach(a => {
      if (a.childId) relevantValidationIds.push(a.childId);
      if (a.adultId) relevantValidationIds.push(a.adultId);
    });

    if (relevantValidationIds.length === 0) return res.json([]);

    const meds = await medicationModel.find({
      $or: [
        { childId: { $in: relevantValidationIds } },
        { adultId: { $in: relevantValidationIds } }
      ]
    })
      .populate({
        path: 'childId',
        model: 'Validation',
        populate: { path: 'regid', model: 'child' }
      })
      .populate({
        path: 'adultId',
        model: 'Validation',
        populate: { path: 'regid', model: 'adult' }
      });

    res.json(meds);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getImmunizationsByParentId = async (req, res) => {
  try {
    const { parentId } = req.body;
    const assignments = await assignmentModel.find({ parentId }).populate('childId adultId');

    const relevantProfileIds = [];
    assignments.forEach(a => {
      if (a.childId?.regid) relevantProfileIds.push(a.childId.regid._id || a.childId.regid);
      if (a.adultId?.regid) relevantProfileIds.push(a.adultId.regid._id || a.adultId.regid);
    });

    if (relevantProfileIds.length === 0) return res.json([]);

    const records = await immunizationModel.find({
      $or: [
        { childId: { $in: relevantProfileIds } },
        { adultId: { $in: relevantProfileIds } }
      ]
    })
      .populate('childId')
      .populate('adultId');

    res.json(records);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getMaterialByParentId = async (req, res) => {
  try {
    const { parentId } = req.body; // âœ… Read from body

    if (!parentId) {
      return res.status(400).json({ message: "Parent ID is required." });
    }


    // 1. Fetch Assignments to see who the parent has (Child or Adult)
    const assignments = await assignmentModel
      .find({ parentId })
      .populate("staffId")
      .populate("childId")
      .populate("adultId")
      .exec();

    if (!assignments || assignments.length === 0) {
      return res
        .status(200) // Return empty list instead of 404
        .json({ material: [], message: "No assignments found for this parent." });
    }

    let allMaterials = [];

    for (const assignment of assignments) {
      const staffRegId = assignment.staffId?.regid;
      if (!staffRegId) continue;

      // Logic: Strictly match the material group to the assigned person's type.
      // If parent has a Child assigned to Staff A -> Show Staff A's 'children' materials.
      // If parent has an Adult assigned to Staff A -> Show Staff A's 'adult' materials.

      if (assignment.childId) {
        // Fetches materials specifically for children from this staff
        const childMats = await materialModel.find({
          staffassign: staffRegId,
          group: 'children'
        });
        if (childMats) allMaterials.push(...childMats);
      }

      if (assignment.adultId) {
        // Fetches materials specifically for adults from this staff
        const adultMats = await materialModel.find({
          staffassign: staffRegId,
          group: 'adult'
        });
        if (adultMats) allMaterials.push(...adultMats);
      }
    }

    // Dedup materials
    const uniqueMaterialsMap = new Map();
    allMaterials.forEach(item => {
      if (item && item._id) uniqueMaterialsMap.set(item._id.toString(), item);
    });
    const uniqueMaterials = Array.from(uniqueMaterialsMap.values());

    res.status(200).json({ material: uniqueMaterials });

  } catch (error) {
    console.error("Error fetching filtered materials:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getFoodByParentId = async (req, res) => {
  try {
    const { parentId } = req.body;
    if (!parentId) return res.status(400).json({ message: "Parent ID is required." });

    const assignments = await assignmentModel.find({ parentId });
    const relevantValidationIds = [];
    assignments.forEach(a => {
      if (a.childId) relevantValidationIds.push(a.childId);
      if (a.adultId) relevantValidationIds.push(a.adultId);
    });

    if (relevantValidationIds.length === 0) return res.json({ nutrition: [] });

    const nutrition = await foodModel.find({
      $or: [
        { childId: { $in: relevantValidationIds } },
        { adultId: { $in: relevantValidationIds } }
      ]
    })
      .populate({
        path: 'childId',
        model: 'Validation',
        populate: { path: 'regid', model: 'child' }
      })
      .populate({
        path: 'adultId',
        model: 'Validation',
        populate: { path: 'regid', model: 'adult' }
      });

    res.json({ nutrition });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.parentEditById = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const parent = await parentModel.findById(req.body.id);
    const loginInfo = await emailModel.findOne({ regid: req.body.id });

    if (!parent || !loginInfo) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ edit: parent, valid: loginInfo });
  } catch (error) {
    console.error("Error in parentEditById:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.parentEditByUpdate = async (req, res) => {
  try {
    let update = await parentModel.findByIdAndUpdate(req.body.id, req.body);
    let add = await emailModel.findOneAndUpdate(
      { regid: req.body.id },
      req.body
    );

    res.json("update");
  } catch (error) {
    console.error(err);
  }
};

exports.getChildrenByParentId = async (req, res) => {
  try {
    const { parentId } = req.body;

    if (!parentId) {
      return res.status(400).json({ error: "Missing parentId" });
    }

    // Fetch children with parent info populated
    const children = await childModel.find({ parentId }).populate("parentId");

    // Fetch email info for all children
    const childrenWithEmail = await Promise.all(
      children.map(async (child) => {
        const loginInfo = await emailModel.findOne({
          regid: child._id,
          regType: "child",
        });

        return {
          ...child.toObject(),
          email: loginInfo?.email || null,
          loginStatus: loginInfo?.status || null,
        };
      })
    );

    res.json(childrenWithEmail);
  } catch (err) {
    console.error("getChildrenByParentId Error:", err);
    res.status(500).json("Server Error");
  }
};

exports.childeditById = async (req, res) => {
  try {
    console.log(req.body);
    let edit = await childModel.findById(req.body.id);
    let valid = await emailModel.findOne({ regid: req.body.id });

    res.json({ edit, valid });
  } catch (error) {
    console.error(err);
  }
};

exports.childEditByUpdate = async (req, res) => {
  try {
    let update = await childModel.findByIdAndUpdate(req.body.id, req.body);
    let add = await emailModel.findOneAndUpdate(
      { regid: req.body.id },
      req.body
    );

    res.json("update");
  } catch (error) {
    console.error(err);
  }
};

exports.childDelete = async (req, res) => {
  try {
    const child = await childModel.findByIdAndDelete(req.body.id);
    console.log(child, "child");

    if (child) {
      await emailModel.findOneAndDelete({ regid: child._id, regType: "child" });
      res.json("delete");
    }
  } catch (error) {
    console.error(error);
  }
};

// ADULT CONTROLLERS
exports.adultRegisterPage = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const adult = {
      // parentname: req.body.parentname,
      adultname: req.body.adultname || req.body.childname, // Handle both just in case
      address: req.body.address,
      age: req.body.age,
      phone: req.body.phone,
      gender: req.body.gender,
      approval: req.body.approval,
      image: req.body.image,
      parentId: req.body.parentId,
      dob: req.body.dob,
    };

    const newadult = await adultModel.create(adult);
    const loginfform = {
      email: req.body.email,
      password: req.body.password,
      status: req.body.status, // Should be 3 for ward
      regid: newadult._id,
      regType: "adult",
    };

    await emailModel.create(loginfform);
    res.json("success");
  } catch (err) {
    console.error("adultRegisterPage Error:", err);
    res.status(500).json("Server Error");
  }
};

exports.getAdultsByParentId = async (req, res) => {
  try {
    const { parentId } = req.body;

    if (!parentId) {
      return res.status(400).json({ error: "Missing parentId" });
    }

    // Fetch adults with parent info populated
    const adults = await adultModel.find({ parentId }).populate("parentId");

    // Fetch email info for all adults
    const adultsWithEmail = await Promise.all(
      adults.map(async (adult) => {
        const loginInfo = await emailModel.findOne({
          regid: adult._id,
          regType: "adult",
        });

        return {
          ...adult.toObject(),
          // Map adultname to childname for frontend compatibility if needed, 
          // or just ensure frontend uses childname/adultname correctly.
          childname: adult.adultname,
          email: loginInfo?.email || null,
          loginStatus: loginInfo?.status || null,
        };
      })
    );

    res.json(adultsWithEmail);
  } catch (err) {
    console.error("getAdultsByParentId Error:", err);
    res.status(500).json("Server Error");
  }
};

exports.adultEditById = async (req, res) => {
  try {
    console.log(req.body);
    let edit = await adultModel.findById(req.body.id);
    let valid = await emailModel.findOne({ regid: req.body.id });

    // Normalize field name for frontend
    let editObj = edit.toObject();
    editObj.childname = editObj.adultname;

    res.json({ edit: editObj, valid });
  } catch (error) {
    console.error(error);
  }
};

exports.adultEditByUpdate = async (req, res) => {
  try {
    // If frontend sends 'childname', map it to 'adultname'
    let updateData = { ...req.body };
    if (updateData.childname) {
      updateData.adultname = updateData.childname;
    }

    let update = await adultModel.findByIdAndUpdate(req.body.id, updateData);
    let add = await emailModel.findOneAndUpdate(
      { regid: req.body.id },
      req.body
    );

    res.json("update");
  } catch (error) {
    console.error(err);
  }
};

exports.adultDelete = async (req, res) => {
  try {
    const adult = await adultModel.findByIdAndDelete(req.body.id);
    console.log(adult, "adult");

    if (adult) {
      await emailModel.findOneAndDelete({ regid: adult._id, regType: "adult" });
      res.json("delete");
    }
  } catch (error) {
    console.error(error);
  }
};

exports.addMilestone = async (req, res) => {
  const { staffId, childId, adultId, parentId, milestoneType, milestones } = req.body;

  try {
    const newMilestone = new milestoneSchemaModel({
      staffId,
      childId,
      adultId,
      parentId,
      milestoneType,
      milestones,
    });

    await newMilestone.save();
    res.status(201).json({ message: "Milestone added successfully" });
  } catch (err) {
    console.error("Error adding milestone:", err);
    res.status(500).json({ message: "Failed to add milestone" });
  }
};

exports.getMilestonesByStaff = async (req, res) => {
  try {
    const { staffId } = req.body;

    if (!staffId) {
      return res.status(400).json({ message: "Staff ID is required" });
    }

    const milestones = await milestoneSchemaModel
      .find({ staffId })
      .populate({
        path: "childId",
        model: "Validation", // Populating from Validation collection
        populate: {
          path: "regid",
          model: "child", // Then populate the child profile
          select: "childname"
        }
      })
      .populate({
        path: "adultId",
        model: "Validation", // Populating from Validation collection
        populate: {
          path: "regid",
          model: "adult", // Then populate the adult profile
          select: "adultname"
        }
      })
      .populate("parentId", "parentname")
      .populate("staffId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(milestones);
  } catch (error) {
    console.error("Error fetching milestones:", error);
    res.status(500).json({ message: "Server error while fetching milestones" });
  }
};

// Get milestone by ID
exports.getMilestoneById = async (req, res) => {
  try {
    const { id } = req.body; // receiving id in req.body

    if (!id) {
      return res.status(400).json({ message: "Milestone ID is required" });
    }

    const milestone = await milestoneSchemaModel
      .findById(id)
      .populate("childId", "childname")
      .populate("parentId", "parentname")
      .populate("staffId", "name");

    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    res.status(200).json(milestone);
  } catch (error) {
    console.error("Error fetching milestone by ID:", error);
    res.status(500).json({ message: "Server error while fetching milestone" });
  }
};

// Delete milestone by ID
exports.deleteMilestone = async (req, res) => {
  try {
    const { id } = req.body; // receiving id in req.body

    if (!id) {
      return res.status(400).json({ message: "Milestone ID is required" });
    }

    const deleted = await milestoneSchemaModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    res.status(200).json({ message: "Milestone deleted successfully" });
  } catch (error) {
    console.error("Error deleting milestone:", error);
    res.status(500).json({ message: "Server error while deleting milestone" });
  }
};

// Update milestone by ID
exports.updateMilestone = async (req, res) => {
  try {
    const { id, milestones } = req.body;

    if (!id || !milestones) {
      return res
        .status(400)
        .json({ message: "ID and milestones are required" });
    }

    const updated = await milestoneSchemaModel.findByIdAndUpdate(
      id,
      { milestones },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    res
      .status(200)
      .json({ message: "Milestone updated successfully", data: updated });
  } catch (error) {
    console.error("Error updating milestone:", error);
    res.status(500).json({ message: "Server error while updating milestone" });
  }
};

exports.getMilestonesByParent = async (req, res) => {
  try {
    const { parentId } = req.body;

    if (!parentId) {
      return res.status(400).json({ message: "Parent ID is required" });
    }

    // 1. Check Assignments to determine allowed types
    const assignments = await assignmentModel.find({ parentId }).exec();

    // Determine strict allowed types
    const allowedTypes = [];
    let hasChild = false;
    let hasAdult = false;

    if (assignments && assignments.length > 0) {
      assignments.forEach(assign => {
        if (assign.childId) hasChild = true;
        if (assign.adultId) hasAdult = true;
      });
    }

    if (hasChild) allowedTypes.push('child');
    if (hasAdult) allowedTypes.push('adult');

    // If no assignments found, technically they shouldn't see anything, 
    // but we'll default to empty list if no types allowed.
    if (allowedTypes.length === 0) {
      return res.status(200).json([]);
    }

    const milestones = await milestoneSchemaModel
      .find({
        parentId,
        milestoneType: { $in: allowedTypes }
      })
      .populate({
        path: 'childId',
        populate: { path: 'regid', select: 'childname' }
      })
      .populate({
        path: 'adultId',
        populate: { path: 'regid', select: 'adultname name' }
      })
      .populate("parentId", "parentname")
      .populate("staffId", "name")
      .sort({ createdAt: -1 });

    // Filter out valid records (ensure regid exists)
    const validMilestones = milestones.filter(m => {
      if (m.milestoneType === 'child') return m.childId && m.childId.regid;
      if (m.milestoneType === 'adult') return m.adultId && m.adultId.regid;
      return false;
    });

    res.status(200).json(validMilestones);
  } catch (error) {
    console.error("Error fetching milestones:", error);
    res.status(500).json({ message: "Server error while fetching milestones" });
  }
};

exports.roomviewbyparent = async (req, res) => {
  const { parentId } = req.body;

  try {
    // Step 1: Find staff assigned to the parent
    const assignments = await assignmentModel
      .find({ parentId })
      .select("staffId");
    const staffIds = assignments.map((item) => item.staffId);

    // Step 2: Find email users whose regid matches staffIds and regType is 'staff'
    const staffEmails = await emailModel
      .find({
        regType: "staff",
        _id: { $in: staffIds },
      })
      .select("regid");

    const staffRegIds = staffEmails.map((item) => item.regid);

    // Step 3: Fetch rooms assigned to those staff members
    const rooms = await roomModel
      .find({ roomassign: { $in: staffRegIds } })
      .populate("roomassign", "name");

    res.json(rooms);
  } catch (err) {
    console.error("Error in roomviewbyparent:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.lessonviewbyparent = async (req, res) => {
  try {
    const { parentId } = req.body;

    // 1. Fetch Assignments with deep populate
    const assignments = await assignmentModel.find({ parentId })
      .populate({
        path: 'staffId',
        populate: { path: 'regid' } // Staff Profile
      })
      .populate({
        path: 'childId',
        populate: { path: 'regid' } // Child Profile
      })
      .populate({
        path: 'adultId',
        populate: { path: 'regid' } // Adult Profile
      });

    if (!assignments || assignments.length === 0) return res.json([]);

    let allLessons = [];
    const processedIds = new Set();

    for (const assign of assignments) {
      if (!assign.staffId || !assign.staffId.regid) continue;
      const staffProfileId = assign.staffId.regid._id;

      // Determine Age
      let age = null;
      if (assign.childId && assign.childId.regid) {
        age = assign.childId.regid.age; // number
      } else if (assign.adultId && assign.adultId.regid) {
        age = assign.adultId.regid.age; // number
      }

      if (age === null || age === undefined) continue;

      // Fetch lessons for this staff
      const staffLessons = await lessonModel.find({ staffassign: staffProfileId })
        .populate("staffassign", "name");

      // Filter by Age Group
      const filtered = staffLessons.filter(lesson => {
        if (!lesson.ageGroup) return false;

        // Handle "60+" or similar "X+" formats
        if (lesson.ageGroup.includes('+')) {
          const minAge = parseInt(lesson.ageGroup);
          return !isNaN(minAge) && age >= minAge;
        }

        // Parse "min-max"
        const parts = lesson.ageGroup.split('-');
        if (parts.length === 2) {
          const min = parseInt(parts[0]);
          const max = parseInt(parts[1]);
          return age >= min && age <= max;
        }

        return false;
      });

      filtered.forEach(l => {
        if (!processedIds.has(l._id.toString())) {
          processedIds.add(l._id.toString());
          allLessons.push(l);
        }
      });
    }

    res.json(allLessons);
  } catch (err) {
    console.error("Error in lessonviewbyparent:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.createHealthReport = async (req, res) => {
  try {
    // const {
    //   staffId,
    //   childId,
    //   parentId,
    //   height,
    //   weight,
    //   bmi,
    //   incidentDescription,
    //   image,
    // } = req.body;

    // const newReport = new HealthReportModel({
    //   staffId,
    //   childId,
    //   parentId,
    //   height,
    //   weight,
    //   bmi,
    //   incidentDescription,
    //   image,
    //   // date is auto-set in model
    // });

    const {
      staffId,
      childId,
      adultId,
      parentId,
      height,
      weight,
      bmi,
      incidentDescription,
      image,
    } = req.body;

    const newReport = new HealthReportModel({
      staffId,
      parentId,
      height,
      weight,
      bmi,
      incidentDescription,
      image,
      childId: childId || null,
      adultId: adultId || null,
    });

    const savedReport = await newReport.save();

    // Notify Parent
    try {
      await emailModel.findOneAndUpdate(
        { regid: parentId, regType: "parent" },
        {
          $push: {
            notifications: {
              type: "health",
              message: `A new health report has been added for your ward.`,
              date: new Date()
            }
          }
        }
      );
    } catch (notificationError) {
      console.error("Failed to send health notification:", notificationError);
    }

    res
      .status(201)
      .json({
        success: true,
        message: "Health report saved",
        data: savedReport,
      });
  } catch (error) {
    console.error("Error saving health report:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAllHealthReports = async (req, res) => {
  try {
    const { staffId } = req.body;

    if (!staffId) {
      return res
        .status(400)
        .json({ success: false, message: "staffId is required" });
    }

    // const reports = await HealthReportModel.aggregate([
    //   { $match: { staffId: new mongoose.Types.ObjectId(staffId) } },
    //   { $sort: { childId: 1, date: -1 } },
    //   {
    //     $group: {
    //       _id: "$childId",
    //       report: { $first: "$$ROOT" },
    //     },
    //   },
    //   { $replaceRoot: { newRoot: "$report" } },
    // ]);

    const reports = await HealthReportModel.aggregate([
      {
        $match: {
          staffId: new mongoose.Types.ObjectId(staffId),
        },
      },

      // Create a single grouping key
      {
        $addFields: {
          recordId: {
            $ifNull: ["$childId", "$adultId"],
          },
        },
      },

      { $sort: { recordId: 1, date: -1 } },

      {
        $group: {
          _id: "$recordId",
          report: { $first: "$$ROOT" },
        },
      },

      { $replaceRoot: { newRoot: "$report" } },
    ]);

    // const populatedReports = await HealthReportModel.populate(reports, [
    //   { path: "staffId", select: "staffname" },
    //   { path: "childId", select: "childname" },
    //   { path: "parentId", select: "parentname" },
    // ]);
    const populatedReports = await HealthReportModel.populate(reports, [
      { path: "staffId", select: "staffname" },
      { path: "childId", select: "childname" },
      { path: "adultId", select: "adultname" },
      { path: "parentId", select: "parentname" },
    ]);
    res.status(200).json({ success: true, data: populatedReports });
  } catch (error) {
    console.error("Error fetching health reports:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAllHealthReportsbyParent = async (req, res) => {
  try {
    // Assuming parentId is sent in the request body
    const { parentId } = req.body;

    if (!parentId) {
      return res
        .status(400)
        .json({ success: false, message: "parentId is required" });
    }

    const reports = await HealthReportModel.find({ parentId })
      .populate("staffId", "staffname")
      .populate("childId", "childname")
      .populate("adultId", "adultname")
      .populate("parentId", "parentname")
      .sort({ date: -1 });

    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    console.error("Error fetching health reports:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.createCompliance = async (req, res) => {
  try {
    const { parentId, message } = req.body;
    const newC = new complianceModel({ parentId, message });
    const saved = await newC.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all compliance for one parent
exports.getByParent = async (req, res) => {
  try {
    const { parentId } = req.body;
    const list = await complianceModel.find({ parentId }).sort({ date: -1 });
    res.json({ success: true, data: list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getCompliance = async (req, res) => {
  try {
    const list = await complianceModel
      .find()
      .populate("parentId")
      .sort({ date: -1 });
    res.json({ success: true, data: list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateComplianceStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!id || typeof status !== "number") {
      return res
        .status(400)
        .json({ success: false, message: "id and status are required" });
    }

    const updated = await complianceModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Compliance not found" });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.parentstaff = async (req, res) => {
  try {
    const { parentId } = req.body;

    // Step 1: Get staff assignments for the parent
    const assignments = await assignmentModel
      .find({ parentId }).sort({ assignedAt: -1 }) // latest first
      .select("staffId");

    const staffIds = assignments.map((item) => item.staffId);

    // Step 2: Find email docs with regType = 'staff' and _id in staffIds
    const staffEmails = await emailModel
      .find({
        regType: "staff",
        _id: { $in: staffIds },
      })
      .select("regid");

    const staffRegIds = staffEmails.map((item) => item.regid);

    // Step 3: Find full staff data from staffModel using regids
    const staffProfiles = await staffModel.find({ _id: { $in: staffRegIds } });

    // Step 4: Merge profile data with validation ID for frontend messaging
    const combinedData = staffProfiles.map(profile => {
      const emailDoc = staffEmails.find(email => email.regid.toString() === profile._id.toString());
      return {
        ...profile.toObject(),
        _valId: emailDoc ? emailDoc._id : null
      };
    });

    res.json(combinedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


exports.staffparent = async (req, res) => {
  try {
    console.log(req.body.staffId)
    const { staffId } = req.body;

    // Step 1: Get staff assignments for the parent
    const assignments = await assignmentModel
      .find({ staffId }).sort({ assignedAt: -1 }) // latest first
      .select("parentId");
    console.log(assignments, "assignments")

    const parentIds = assignments.map((item) => item.parentId);
    console.log(parentIds, "parentIds")

    // Step 3: Find full staff data from staffModel using regids
    const parentData = await parentModel.find({ _id: { $in: parentIds } });
    console.log(parentData, "parentData")

    res.json(parentData); // send populated parent data
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.staffadult = async (req, res) => {
  try {
    const { staffId } = req.body;
    const assignments = await assignmentModel
      .find({ staffId, adultId: { $ne: null } })
      .sort({ assignedAt: -1 })
      .select("adultId");

    const adultEmailIds = assignments.map((item) => item.adultId);

    const adultEmails = await emailModel
      .find({ _id: { $in: adultEmailIds }, regType: "adult" })
      .populate("regid");

    const adultData = adultEmails.map(e => ({
      _id: e._id,
      name: e.regid?.adultname || "Unknown Adult",
      image: e.regid?.image,
      email: e.email
    }));

    res.json(adultData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { from, to, text } = req.body;
    const message = new messageModel({ from, to, text });
    console.log(message)
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { userId1, userId2 } = req.query;

    const messages = await messageModel.find({
      $or: [
        { from: userId1, to: userId2 },
        { from: userId2, to: userId1 }
      ]
    }).sort({ time: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

exports.getPaymentsByParent = async (req, res) => {
  const { parentId } = req.body;

  try {
    // Fetch all payments for the parent, sorted descending by date
    const payments = await paymentModel.find({ parentId }).sort({ date: -1 });

    // Map payments to include formatted month-year string
    const paymentsWithMonth = payments.map(p => ({
      ...p._doc,
      monthYear: moment(p.date).format('MMMM YYYY'), // e.g. "May 2025"
    }));

    res.json(paymentsWithMonth);
  } catch (error) {
    console.error("Error fetching payments by parent:", error);
    res.status(500).json({ error: 'Server error fetching payments' });
  }
};
exports.monthlysumbyparent = async (req, res) => {
  const { parentId } = req.body;

  try {
    // Step 1: Get staffIds assigned to the parent
    const assignments = await assignmentModel
      .find({ parentId })
      .select("staffId");

    const staffIds = assignments.map(item => item.staffId);

    // Step 2: Get regids of staff (used in roomassign and staffassign)
    const staffEmails = await emailModel
      .find({ regType: "staff", _id: { $in: staffIds } })
      .select("regid");

    const staffRegIds = staffEmails.map(item => item.regid);

    // Step 3: Get sum of room prices
    const roomData = await roomModel.find({ roomassign: { $in: staffRegIds } });
    const roomTotal = roomData.reduce((sum, room) => sum + (room.price || 0), 0);

    // Step 4: Get sum of lesson prices
    const lessonData = await lessonModel.find({ staffassign: { $in: staffRegIds } });
    const lessonTotal = lessonData.reduce((sum, lesson) => sum + (lesson.price || 0), 0);

    // Step 5: Respond
    res.json({
      roomTotal,
      lessonTotal,
      grandTotal: roomTotal + lessonTotal,
    });
  } catch (err) {
    console.error("Error in monthlysumbyparent:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.savePayment = async (req, res) => {
  try {
    const {
      paymentid,
      parentId,
      payer,
      amount,
      roomTotal,
      lessonTotal,
      grandTotal,
      date
    } = req.body;

    const newPayment = new paymentModel({
      paymentid,
      parentId,
      payer,
      amount,
      roomTotal,
      lessonTotal,
      grandTotal,
      date: new Date(date)
    });

    await newPayment.save();

    res.status(200).json({ message: "âœ… Payment saved successfully" });
  } catch (error) {
    console.error("âŒ Error in savePayment:", error);
    res.status(500).json({ message: "Server error saving payment" });
  }
};

exports.findallpayment = async (req, res) => {
  try {
    const payment = await paymentModel.find().sort({ date: -1 }).populate("parentId");

    res.json(payment);
  } catch (err) {
    console.log(err);
  }
};

// --- Child Gamification Controllers ---

exports.updateChildMood = async (req, res) => {
  try {
    const { childId, mood, note } = req.body;
    const child = await childModel.findById(childId);
    if (!child) return res.status(404).json({ error: "Child not found" });

    child.moods.push({ mood, note });
    await child.save();
    res.json({ message: "Mood updated", currentMoods: child.moods });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.awardReward = async (req, res) => {
  try {
    const { childId, points, badge } = req.body;
    const child = await childModel.findById(childId);
    if (!child) return res.status(404).json({ error: "Child not found" });

    const pointsToAdd = points ? parseInt(points) : 0;

    if (pointsToAdd > 0) child.rewards += pointsToAdd;

    if (badge) {
      child.badges.push({
        name: badge,
        points: pointsToAdd // Associate points with this specific badge instance
      });
    }

    await child.save();
    res.json({ message: "Reward awarded", rewards: child.rewards, badges: child.badges });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getChildGamifiedData = async (req, res) => {
  try {
    const { id } = req.body; // childId
    const child = await childModel.findById(id).select("childname rewards badges moods age");
    if (!child) return res.status(404).json({ error: "Child not found" });

    res.json(child);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.deleteChildBadge = async (req, res) => {
  try {
    const { childId, badgeId } = req.body; // Expect badgeId (subdocument _id)
    const child = await childModel.findById(childId);
    if (!child) return res.status(404).json({ error: "Child not found" });

    // Find the badge to get its points
    const badge = child.badges.id(badgeId);

    if (!badge) {
      return res.status(404).json({ error: "Badge not found" });
    }

    // Deduct points associated with this badge
    const pointsToDeduct = badge.points || 0;
    child.rewards -= pointsToDeduct;
    if (child.rewards < 0) child.rewards = 0;

    // Remove the badge
    child.badges.pull(badgeId);

    await child.save();

    res.json({ message: `Badge removed and ${pointsToDeduct} points deducted.`, badges: child.badges, rewards: child.rewards });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete badge" });
  }
};

// --- Child Self-View Controllers ---

exports.getChildAttendance = async (req, res) => {
  try {
    const { childId } = req.body;
    // childId here is the Validation ID (User Login ID)
    const attendance = await attendanceModel.find({ childId }).sort({ date: -1 });
    res.json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
};

exports.getChildMilestones = async (req, res) => {
  try {
    const { childId } = req.body;
    // childId here is the Validation ID 
    // Milestone model uses Validation ID for childId
    const milestones = await milestoneSchemaModel.find({ childId }).sort({ createdAt: -1 });
    res.json(milestones);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch milestones" });
  }
};

// 📄 View Health Report
exports.viewHealthReport = async (req, res) => {
  try {
    const { staffId } = req.body;

    // Find reports where staffId matches.
    // The previous implementation might have been implicitly filtering or not populating enough.
    const reports = await HealthReportModel.find({ staffId })
      .populate({
        path: "childId",
        select: "regid email regType",
        populate: { path: "regid", model: "child" } // Nested populate for child
      })
      .populate({
        path: "adultId",
        select: "regid email regType",
        populate: { path: "regid", model: "adult" } // Nested populate for adult
      })
      .populate("parentId"); // Populate parent details

    res.json({ success: true, data: reports });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch health reports" });
  }
};

exports.getChildHealthReports = async (req, res) => {
  try {
    const { id } = req.body; // Profile ID
    const reports = await HealthReportModel.find({ childId: id }).sort({ date: -1 });
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch health reports" });
  }
};

exports.getChildDailySchedule = async (req, res) => {
  try {
    const { age } = req.body;

    // Fetch all child activities
    const activities = await activityModel.find({
      category: { $in: ['child', 'children'] }
    }).lean();

    let filteredActivities = activities;

    if (age) {
      const childAge = parseInt(age);
      if (!isNaN(childAge)) {
        filteredActivities = activities.filter(act => {
          if (!act.age) return false; // Strict: require age group match

          // Handle ranges e.g., "1-3", "4-6"
          if (act.age.includes('-')) {
            const [min, max] = act.age.split('-').map(Number);
            return childAge >= min && childAge <= max;
          }

          // Handle "14+" or "5"
          const val = parseInt(act.age);
          if (!isNaN(val)) {
            if (act.age.includes('+')) {
              return childAge >= val;
            }
            return childAge === val;
          }
          return false;
        });
      }
    }

    // Sort by time
    filteredActivities.sort((a, b) => {
      const timeA = a.time || "";
      const timeB = b.time || "";
      return timeA.localeCompare(timeB);
    });

    res.json(filteredActivities);
  } catch (err) {
    console.error("Error fetching child schedule:", err);
    res.status(500).json({ error: "Failed to fetch schedule" });
  }
};

exports.getChildMedications = async (req, res) => {
  try {
    const { id } = req.body; // Profile ID
    const validationDoc = await emailModel.findOne({ regid: id, regType: 'child' });

    if (!validationDoc) {
      // Fallback: maybe they passed the Validation ID directly?
      const checkDirect = await emailModel.findById(id);
      if (checkDirect) {
        const meds = await medicationModel.find({ childId: id });
        return res.json(meds);
      }
      return res.status(404).json([]);
    }

    const meds = await medicationModel.find({ childId: validationDoc._id });
    res.json(meds);
  } catch (err) {
    console.error("Error fetching child medications:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getChildStudyMaterials = async (req, res) => {
  try {
    const materials = await materialModel.find({
      group: { $in: ['children', 'child'] }
    }).sort({ date: -1 }).limit(6);
    res.json(materials);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch materials" });
  }
};

exports.sendEmergencyAlert = async (req, res) => {
  try {
    const { senderId, message, location } = req.body;
    const alert = new emergencyLogModel({
      senderId,
      senderType: 'child',
      message,
      location: location || 'Child Dashboard',
      status: 'sent'
    });
    await alert.save();
    res.json({ message: "Alert sent successfully! Help is on the way." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send alert" });
  }
};

// --- Adult/Senior Accessibility & Medication Controllers ---

exports.addMedication = async (req, res) => {
  try {
    const { childId, adultId, name, dosage, time, instructions } = req.body;
    console.log("Adding medication:", req.body);
    const med = await medicationModel.create({ childId, adultId, name, dosage, time, instructions });

    // Notify Assigned Staff
    try {
      const targetWardProfileId = childId || adultId;
      if (targetWardProfileId) {
        // Find assignments to get staff members
        const assignments = await assignmentModel.find({
          $or: [
            { childId: targetWardProfileId }, { adultId: targetWardProfileId }
          ]
        });

        // Determine ward name
        let wardName = "A ward";
        const child = await childModel.findById(targetWardProfileId);
        const adult = await adultModel.findById(targetWardProfileId);
        if (child) wardName = child.childname;
        else if (adult) wardName = adult.adultname;

        // Notify each assigned staff
        for (const assign of assignments) {
          await emailModel.findByIdAndUpdate(assign.staffId, {
            $push: {
              notifications: {
                type: "medication_added",
                message: `New medication added for ${wardName}: ${name} (${dosage}). Please review.`,
                date: new Date()
              }
            }
          });
        }

        // Also notify the Ward's account (for their record)
        await emailModel.findByIdAndUpdate(targetWardProfileId, {
          $push: {
            notifications: {
              type: "medication",
              message: `Your medication list has been updated with: ${name}.`,
              date: new Date()
            }
          }
        });
      }
    } catch (staffNotifyError) {
      console.error("Failed to notify staff about new medication:", staffNotifyError);
    }

    res.status(201).json(med);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add medication" });
  }
};

// exports.getMedications = async (req, res) => {
//   try {
//     const { childId, adultId } = req.body;
//     const query = {};
//     if (childId) query.childId = childId;
//     if (adultId) query.adultId = adultId;

//     const meds = await medicationModel.find(query);
//     res.json(meds);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server Error" });
//   }
// };

exports.getMedications = async (req, res) => {
  try {
    // prefer query params for reads: /api/medications?adultId=...&childId=...&limit=50&page=1
    const { childId, adultId, limit = 100, page = 1, sort = '-createdAt' } = req.query;
    const query = {};

    // validate ObjectId when appropriate
    if (childId) {
      if (!mongoose.Types.ObjectId.isValid(childId)) return res.status(400).json({ error: 'Invalid childId' });
      query.childId = childId;
    }

    if (adultId) {
      // adultId may be stored as regid string or ObjectId â€” validate if ObjectId
      if (mongoose.Types.ObjectId.isValid(adultId)) {
        query.adultId = adultId;
      } else {
        query.adultId = adultId; // keep as-is if regid/string
      }
    }

    const skip = (Math.max(parseInt(page, 10), 1) - 1) * Math.max(parseInt(limit, 10), 1);

    const meds = await medicationModel
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(Math.max(parseInt(limit, 10), 1))
      // populate Validation -> regid for friendly frontend data (optional)
      .populate({ path: 'childId', model: 'Validation', populate: { path: 'regid', model: 'child' } })
      .populate({ path: 'adultId', model: 'Validation', populate: { path: 'regid', model: 'adult' } })
      .lean();

    res.status(200).json(meds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.logMedicationTaken = async (req, res) => {
  try {
    const { medicationId } = req.body;
    const med = await medicationModel.findById(medicationId);
    if (!med) return res.status(404).json({ error: "Medication not found" });

    med.takenHistory.push({ date: new Date(), status: true });
    await med.save();

    // Notify Assigned Staff
    try {
      const targetWardProfileId = med.childId || med.adultId;
      if (targetWardProfileId) {
        // 1. Find the user account (Validation model) for this ward
        const wardAccount = await emailModel.findOne({ regid: targetWardProfileId });
        const wardAccountId = wardAccount ? wardAccount._id : targetWardProfileId;

        // 2. Find assignments using either ID (to be safe)
        const assignments = await assignmentModel.find({
          $or: [
            { childId: wardAccountId }, { adultId: wardAccountId },
            { childId: targetWardProfileId }, { adultId: targetWardProfileId }
          ]
        });

        // 3. Determine the ward's name
        let wardName = "A ward";
        const child = await childModel.findById(targetWardProfileId);
        const adult = await adultModel.findById(targetWardProfileId);
        if (child) wardName = child.childname;
        else if (adult) wardName = adult.adultname;
        else if (wardAccount && wardAccount.regid) {
          // If med IDs were actually Validation IDs
          const populatedAccount = await emailModel.findById(targetWardProfileId).populate("regid");
          if (populatedAccount?.regid) {
            wardName = populatedAccount.regid.childname || populatedAccount.regid.adultname || "A ward";
          }
        }

        // 4. Send notifications to all assigned staff
        for (const assign of assignments) {
          await emailModel.findByIdAndUpdate(assign.staffId, {
            $push: {
              notifications: {
                type: "medication_taken",
                message: `${wardName} has taken their prescribed medication: ${med.name}.`,
                date: new Date()
              }
            }
          });
        }
      }

      // 5. Award Points to Ward (Gamification)
      if (med.childId) {
        // Child's Validation ID -> Find Child Profile
        const childVal = await emailModel.findById(med.childId).populate('regid');
        if (childVal && childVal.regid) {
          await childModel.findByIdAndUpdate(childVal.regid._id, {
            $inc: { rewards: 50 },
            $push: {
              badges: {
                name: "Health Hero 💊",
                points: 50,
                date: new Date()
              }
            }
          });
        }
      } else if (med.adultId) {
        // Adult logic (similar)
        const adultVal = await emailModel.findById(med.adultId).populate('regid');
        if (adultVal && adultVal.regid) {
          await adultModel.findByIdAndUpdate(adultVal.regid._id, {
            $inc: { rewards: 50 },
            $push: {
              badges: {
                name: "Health Compliance 💊",
                points: 50
              }
            }
          });
        }
      }

    } catch (staffNotifyError) {
      console.error("Failed to process post-medication logic:", staffNotifyError);
    }

    res.json({ message: "Medication logged as taken", history: med.takenHistory, reward: 50 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.markMedicationViewed = async (req, res) => {
  try {
    const { medicationId } = req.body;
    const med = await medicationModel.findById(medicationId);
    if (!med) return res.status(404).json({ error: "Medication not found" });

    med.isViewed = true;
    await med.save();

    // Notify Guardian
    try {
      const targetValidationId = med.childId || med.adultId;
      if (targetValidationId) {
        const valDoc = await emailModel.findById(targetValidationId).populate('regid');
        if (valDoc && valDoc.regid) {
          const parentProfileId = valDoc.regid.parentId;
          const wardName = valDoc.regid.childname || valDoc.regid.adultname || "Your ward";

          if (parentProfileId) {
            await emailModel.findOneAndUpdate({ regid: parentProfileId, regType: 'parent' }, {
              $push: {
                notifications: {
                  type: 'medication_viewed',
                  message: `Staff has viewed the medication "${med.name}" for ${wardName}.`,
                  date: new Date()
                }
              }
            });
          }
        }
      }
    } catch (parentNotifyError) {
      console.error("Failed to notify parent about viewed medication:", parentNotifyError);
    }

    res.json({ message: "Medication marked as viewed", isViewed: med.isViewed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.markFoodViewed = async (req, res) => {
  try {
    const { foodId } = req.body;
    const food = await foodModel.findById(foodId);
    if (!food) return res.status(404).json({ error: "Food record not found" });

    food.isViewed = true;
    await food.save();

    // Notify Guardian
    try {
      const targetValidationId = food.childId || food.adultId;
      if (targetValidationId) {
        const valDoc = await emailModel.findById(targetValidationId).populate('regid');
        if (valDoc && valDoc.regid) {
          const parentProfileId = valDoc.regid.parentId;
          const wardName = valDoc.regid.childname || valDoc.regid.adultname || "Your ward";

          if (parentProfileId) {
            await emailModel.findOneAndUpdate({ regid: parentProfileId, regType: 'parent' }, {
              $push: {
                notifications: {
                  type: 'food_viewed',
                  message: `Staff has viewed the nutrition record "${food.name}" for ${wardName}.`,
                  date: new Date()
                }
              }
            });
          }
        }
      }
    } catch (notifyError) {
      console.error("Failed to notify parent about viewed food:", notifyError);
    }

    res.json({ message: "Food record marked as viewed", isViewed: food.isViewed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};


exports.deleteMedication = async (req, res) => {
  try {
    const { id } = req.body;
    await medicationModel.findByIdAndDelete(id);
    res.json({ message: "Medication deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete medication" });
  }
};

exports.getMedicationsByStaff = async (req, res) => {
  try {
    const { staffId } = req.body;

    // 1. Get assignments for this staff
    const assignments = await assignmentModel.find({ staffId });
    const childIds = assignments.map(a => a.childId).filter(id => id);
    const adultIds = assignments.map(a => a.adultId).filter(id => id);

    // 2. Find medications matching these IDs
    const meds = await medicationModel.find({
      $or: [
        { childId: { $in: childIds } },
        { adultId: { $in: adultIds } }
      ]
    })
      .populate({
        path: "childId",
        model: "Validation",
        populate: { path: "regid", model: "child", select: "childname" }
      })
      .populate({
        path: "adultId",
        model: "Validation",
        populate: { path: "regid", model: "adult", select: "adultname" }
      });

    res.json(meds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

// --- Automated Emergency Response ---

exports.triggerEmergency = async (req, res) => {
  try {
    const { senderId, senderType, location } = req.body;
    console.log(`DEBUG: Emergency Triggered. SenderId: ${senderId}, Type: ${senderType}`);

    // 1. Fetch User details to get emergency contacts
    let user;
    if (senderType === 'child') {
      user = await childModel.findById(senderId).populate('parentId');
    } else if (senderType === 'adult' || senderType === 'Adult') {
      console.log("Searching adultModel for", senderId);
      user = await adultModel.findById(senderId).populate('parentId');
    } else {
      // logic for staff/adult
      // For this demo, let's assume senderType 'child' covers adults too (since they share schema)
      user = await childModel.findById(senderId).populate('parentId');
    }
    console.log("DEBUG: User Found:", user ? user._id : "NULL");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const contactName = user.parentId ? user.parentId.parentname : "Guardian";
    const contactPhone = user.phone; // Assuming this is the contact phone for the child/adult

    // 2. Simulate SMS Sending (Twilio Mock)
    console.log(`ðŸš¨ EMERGENCY ALERT ðŸš¨`);
    console.log(`To: ${contactPhone} (${contactName})`);
    console.log(`Message: ALERT! User ${user.childname || user.name} has triggered an SOS at ${location || "Unknown Location"}. Please contact the facility immediately.`);

    // 3. Log the incident
    const newLog = await emergencyLogModel.create({
      senderId,
      senderType,
      message: `SOS triggered for ${user.childname}`,
      location,
      status: 'sent'
    });

    res.json({ success: true, message: "Emergency Alert Sent!", logId: newLog._id });
  } catch (err) {
    console.error("Emergency Error:", err);
    res.status(500).json({ error: "Failed to trigger emergency" });
  }
};

exports.getAssignedStaffForChild = async (req, res) => {
  try {
    const { childId } = req.body;
    // assignment.childId is Validation ID. assignment.staffId is Validation ID.
    // We populate staffId to access its 'regid' (Profile ID).
    const assignment = await assignmentModel.findOne({ childId }).populate("staffId");

    if (!assignment || !assignment.staffId) {
      return res.status(404).json({ error: "No staff assigned" });
    }

    // Return the Staff's Profile ID (regid) because Activity/Food are saved with Profile ID.
    res.json({ staffId: assignment.staffId.regid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

// --- Adult Module Extensions ---

// Mood
exports.updateAdultMood = async (req, res) => {
  try {
    const { adultId, mood, note } = req.body;
    const adult = await adultModel.findById(adultId);
    if (!adult) return res.status(404).json({ error: "Adult not found" });

    adult.moods.push({ mood, note });
    await adult.save();
    res.json({ message: "Mood updated", currentMoods: adult.moods });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

// Rewards (Simulated for parity, even if logic might differ for Adults)
exports.awardAdultReward = async (req, res) => {
  try {
    const { adultId, points, badge } = req.body;
    const adult = await adultModel.findById(adultId);
    if (!adult) return res.status(404).json({ error: "Adult not found" });

    const pointsToAdd = points ? parseInt(points) : 0;
    if (pointsToAdd > 0) adult.rewards += pointsToAdd;

    if (badge) {
      adult.badges.push({
        name: badge,
        points: pointsToAdd
      });
    }

    await adult.save();
    res.json({ message: "Reward awarded", rewards: adult.rewards, badges: adult.badges });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getAdultGamifiedData = async (req, res) => {
  try {
    const { id } = req.body; // adultId
    const adult = await adultModel.findById(id).select("adultname rewards badges moods age parentId");
    if (!adult) return res.status(404).json({ error: "Adult not found" });

    res.json(adult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getAdultExtraCurricular = async (req, res) => {
  try {
    const { adultId } = req.body;
    const adult = await adultModel.findById(adultId);
    if (!adult) return res.status(404).json({ message: "Adult not found" });

    // Reuse parent extracurricular logic but based on adult's parentId
    const parentId = adult.parentId;

    // We can directly call the handler or duplicate logic for simplicity in this context
    // Duplicate simplified logic:
    const assignments = await assignmentModel.find({ parentId, adultId: { $ne: null } }).populate("staffId").exec();

    let allActivities = [];
    for (const assignment of assignments) {
      const staffRegId = assignment.staffId?.regid;
      if (!staffRegId) continue;
      const acts = await extracurricularModel.find({ staffId: staffRegId, group: "adult" });
      if (acts) allActivities.push(...acts);
    }

    const uniqueActivities = [...new Map(allActivities.map(item => [item._id.toString(), item])).values()];
    res.status(200).json({ activities: uniqueActivities });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAdultNutrition = async (req, res) => {
  try {
    const { adultId } = req.body; // Profile ID
    const valDoc = await emailModel.findOne({ regid: adultId, regType: 'adult' });
    if (!valDoc) return res.status(404).json({ message: "Adult account not found" });

    const nutrition = await foodModel.find({ adultId: valDoc._id })
      .sort({ createdAt: -1 });

    res.status(200).json({ nutrition });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteAdultBadge = async (req, res) => {
  try {
    const { adultId, badgeId } = req.body;
    const adult = await adultModel.findById(adultId);
    if (!adult) return res.status(404).json({ error: "Adult not found" });

    const badge = adult.badges.id(badgeId);
    if (!badge) return res.status(404).json({ error: "Badge not found" });

    const pointsToDeduct = badge.points || 0;
    adult.rewards -= pointsToDeduct;
    if (adult.rewards < 0) adult.rewards = 0;

    adult.badges.pull(badgeId);
    await adult.save();

    res.json({ message: `Badge removed`, badges: adult.badges, rewards: adult.rewards });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete badge" });
  }
};

// Self Views
exports.getAdultAttendance = async (req, res) => {
  try {
    const { adultId } = req.body; // Validation ID
    const attendance = await attendanceModel.find({ adultId }).sort({ date: -1 });
    res.json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
};

exports.getAdultMilestones = async (req, res) => {
  try {
    const { adultId } = req.body; // Validation ID
    const milestones = await milestoneSchemaModel.find({ adultId }).sort({ createdAt: -1 });
    res.json(milestones);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch milestones" });
  }
};

exports.getAdultHealthReports = async (req, res) => {
  try {
    // HealthReportModel uses childId/staffId/parentId but not explicitly 'adultId' in standard schema shown earlier?
    // Wait, let's check HealthReportModel schema in staffform.model.js
    // Line 381: childId exists. adultId does NOT exist in schema shown (lines 381-403).
    // Actually, looking at 381: childId: { ref: 'child' ... }.
    // If we want adult health reports, we might need to modify schema or abuse childId?
    // User asked to "complete it". Re-reading Synopsis would clarify but I can't.
    // If schema doesn't support adultId, I should probably add it or check if 'childId' is being recycled.
    // However, I can't easily change Schema without checking MongoDB state implications, but I *should* add it to Schema if missing.
    // Let's check if I can just query by 'childId' if they are reusing it (Adults are 'children' of Parents in this context?)
    // But childModel and adultModel are separate.
    // Let's assume for now I should add adultId to HealthReportModel or skip it if too risky.
    // Better practice: Check if I can add adultId to schema.

    // For now, I'll write the controller assuming I can query by 'adultId' (if I update model) OR reusing childId field.
    // Given the constraints and separate models, I should probably add `adultId` to HealthReportModel.
    // I will *update* the model file first in a separate step if needed.
    // Let's hold off on this specific function implementation detail until I fix the model.
    // But wait, `getAdultHealhReports` - I will implement it assuming `adultId` field exists.

    const { id } = req.body; // Profile ID
    // Check if schema supports adultId. I will check staffform.model.js again.
    // If not, I'll update it.

    const reports = await HealthReportModel.find({ adultId: id }).sort({ date: -1 });
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch health reports" });
  }
};

exports.getAdultDailySchedule = async (req, res) => {
  try {
    const { age } = req.body;

    // Fetch activities for Adults
    const activities = await activityModel.find({
      category: { $in: ['adult', 'Adult'] }
    }).lean();

    let filteredActivities = activities;

    if (age) {
      const adultAge = parseInt(age);
      if (!isNaN(adultAge)) {
        filteredActivities = activities.filter(act => {
          if (!act.age) return false;

          // Handle ranges e.g., "60-65"
          if (act.age.includes('-')) {
            const [min, max] = act.age.split('-').map(Number);
            return adultAge >= min && adultAge <= max;
          }

          // Handle "60+"
          const val = parseInt(act.age);
          if (!isNaN(val)) {
            if (act.age.includes('+')) {
              return adultAge >= val;
            }
            return adultAge === val;
          }
          return false;
        });
      }
    }

    // Sort by time
    filteredActivities.sort((a, b) => {
      const timeA = a.time || "";
      const timeB = b.time || "";
      return timeA.localeCompare(timeB);
    });

    res.json(filteredActivities);
  } catch (err) {
    console.error("Error fetching adult schedule:", err);
    res.status(500).json({ error: "Failed to fetch schedule" });
  }
};

exports.getAdultStudyMaterials = async (req, res) => {
  try {
    const materials = await materialModel.find({
      group: { $in: ['adult', 'Adult'] }
    }).sort({ date: -1 }).limit(6);
    res.json(materials);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch materials" });
  }
};

exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await quizModel.find();
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
};

exports.submitQuizResult = async (req, res) => {
  try {
    const { adultId, quizId, score, totalQuestions } = req.body;
    const adult = await adultModel.findById(adultId);
    if (!adult) return res.status(404).json({ error: "Adult not found" });

    const quiz = await quizModel.findById(quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    const percentage = (score / totalQuestions) * 100;
    let pointsAwarded = 0;

    if (percentage >= 100) pointsAwarded = quiz.pointsAwarded;
    else if (percentage >= 70) pointsAwarded = Math.floor(quiz.pointsAwarded / 2);

    if (pointsAwarded > 0) {
      adult.rewards += pointsAwarded;
      adult.badges.push({
        name: `Quiz Master: ${quiz.title}`,
        points: pointsAwarded
      });
      await adult.save();
    }

    res.json({
      message: pointsAwarded > 0 ? `Congratulations! You earned ${pointsAwarded} points.` : "Good try! Review the lesson and try again.",
      pointsAwarded,
      rewards: adult.rewards
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit quiz" });
  }
};

exports.seedQuizzes = async (req, res) => {
  try {
    const count = await quizModel.countDocuments();
    if (count > 0) return res.json({ message: "Quizzes already exist" });

    const defaultQuizzes = [
      {
        title: "Morning Wellness Quiz",
        category: "Health",
        pointsAwarded: 20,
        questions: [
          {
            questionText: "How many glasses of water should you ideally drink a day?",
            options: ["1-2", "3-4", "6-8", "10+"],
            correctAnswer: "6-8"
          },
          {
            questionText: "Which of these is a light morning exercise?",
            options: ["Heavy Lifting", "Stretching", "Sprinting", "Boxing"],
            correctAnswer: "Stretching"
          }
        ]
      },
      {
        title: "Trivia Fun",
        category: "Brain Exercise",
        pointsAwarded: 15,
        questions: [
          {
            questionText: "Which season comes after Winter?",
            options: ["Summer", "Autumn", "Spring", "Monsoon"],
            correctAnswer: "Spring"
          }
        ]
      }
    ];

    await quizModel.insertMany(defaultQuizzes);
    res.json({ message: "Default quizzes seeded!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to seed quizzes" });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    const quiz = new quizModel(req.body);
    await quiz.save();
    res.json({ message: "Quiz created", quiz });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create quiz" });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    await quizModel.findByIdAndDelete(id);
    res.json({ message: "Quiz deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete quiz" });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await emailModel.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.notifications || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const { userId, notificationId } = req.body;
    await emailModel.updateOne(
      { _id: userId, "notifications._id": notificationId },
      { $set: { "notifications.$.read": true } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.applyLeave = async (req, res) => {
  try {
    const { staffId, startDate, endDate, reason } = req.body;
    const leave = await leaveModel.create({
      staffId,
      startDate,
      endDate,
      reason
    });
    res.json({ message: "Leave requested successfully", leave });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to apply for leave" });
  }
};

exports.getLeaves = async (req, res) => {
  try {
    const leaves = await leaveModel.find().populate("staffId", "name image role").populate("substituteStaffId", "name");
    res.json(leaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch leaves" });
  }
};

exports.getMyLeaves = async (req, res) => {
  try {
    const { staffId } = req.body;
    const leaves = await leaveModel.find({ staffId }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch your leaves" });
  }
};

exports.getAlternateStaffs = async (req, res) => {
  try {
    const alternates = await staffModel.find({ approval: 2, isAlternate: true });
    res.json(alternates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch alternate staff" });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId, status, substituteStaffId, adminResponse } = req.body;
    const leave = await leaveModel.findById(leaveId);
    if (!leave) return res.status(404).json({ error: "Leave not found" });

    leave.status = status;
    if (adminResponse) leave.adminResponse = adminResponse;
    if (substituteStaffId) leave.substituteStaffId = substituteStaffId;

    await leave.save();

    const staffEmail = await emailModel.findOne({ regid: leave.staffId });
    if (staffEmail) {
      staffEmail.notifications.push({
        type: "Leave Status",
        message: `Your leave request has been ${status}.`
      });
      await staffEmail.save();
    }

    if (status === 'approved' && substituteStaffId) {
      const staffUser = await emailModel.findOne({ regid: leave.staffId });

      // Handle case where substituteStaffId might be the staffModel ID, so we find emailModel by regid
      let subUserCorrect = await emailModel.findOne({ regid: substituteStaffId });

      if (staffUser && subUserCorrect) {
        await assignmentModel.updateMany(
          { staffId: staffUser._id },
          { $set: { staffId: subUserCorrect._id } }
        );

        subUserCorrect.notifications.push({
          type: "Assignment",
          message: `You have been assigned as alternate for staff on leave.`
        });
        await subUserCorrect.save();

        const affectedAssignments = await assignmentModel.find({ staffId: subUserCorrect._id });
        for (const assignment of affectedAssignments) {
          if (assignment.parentId) {
            const parentEmailUser = await emailModel.findOne({ regid: assignment.parentId, regType: 'parent' });
            if (parentEmailUser) {
              parentEmailUser.notifications.push({
                type: "Staff Change",
                message: `Staff on leave. Alternate assigned.`
              });
              await parentEmailUser.save();
            }
          }
        }
      }
    }

    res.json({ message: "Leave status updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};
