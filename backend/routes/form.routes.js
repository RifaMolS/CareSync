var express = require('express')
var router = express.Router()


var formController = require("../controller/form.controller")


router.post("/staffRegister", formController.staffRegister)
router.get("/staffview", formController.staffView)
router.post("/staffDelete", formController.staffDelete)
router.post("/staffedit", formController.staffEditById)
router.post("/staffupdate", formController.staffEditByUpdate)
router.post('/parentregisterpage', formController.parentRegisterPage)
router.post('/childregisterpage', formController.childRegisterPage)
router.get('/parentview', formController.parentView)
router.get('/childview', formController.childView)
router.get('/adultview', formController.adultView)
router.post('/login', formController.loginForm)
router.post('/approved', formController.approved)
router.post('/reject', formController.handleReject)
router.post('/role', formController.Role)
router.get('/roleview', formController.roleView)
router.post('/food', formController.food)
router.post('/foodview', formController.foodview)
router.post('/fooddelete', formController.fooddelete)
router.post('/foodupdate/:id', formController.foodupdate)
router.post('/roledelete', formController.roledelete)
router.post('/deactive', formController.deactivate)
router.post('/room', formController.room)
router.get('/approval', formController.getApprovedStaff)
router.get('/roomview', formController.roomview)
router.post('/roomdelete', formController.roomdelete)
router.post('/roomedit', formController.roomEditById)
router.post('/roomupdate', formController.roomupdate)
router.post('/roomidview', formController.roomIdview)
router.post('/parentid', formController.getParentById)
router.post("/parentedit", formController.parentEditById)
router.post('/activity', formController.activity)
router.post('/activityview', formController.activityview)
router.post('/activityid', formController.activityEditById)
router.post('/activityupdate', formController.activityupdate)
router.post('/lesson', formController.lesson)
router.post('/lessonidview', formController.lessonIdview)
router.post('/lessonedit', formController.lessonEditById)
router.post('/lessonupdate', formController.lessonupdate)
router.get('/lessonview', formController.lessonview)
router.post('/lessondelete', formController.lessondelete)
router.post('/attendance', formController.attendance)
router.post('/getattendance', formController.getAttendanceByDate);
router.post('/getattendancebystaff', formController.getAttendanceByStaffId);
router.post('/staffidview', formController.getShiftForLoggedInUser)
router.post('/shift', formController.shift)
router.get('/shiftview', formController.shiftview)
router.post('/updateStatus', formController.updateStatus)
router.post('/staffprofileview', formController.staffProfile)
router.post('/health', formController.health)
router.get('/healthview', formController.healthview)
router.post('/addmaterial', formController.addMaterial);
router.post('/materialidview', formController.materialIdview);
router.post('/materialedit', formController.materialEditById);
router.post('/materialupdate', formController.materialUpdate);
router.post('/materialview', formController.materialView);
router.post('/deletematerial', formController.deleteMaterialById);
router.post('/assign', formController.assign);
router.get("/assignments", formController.getAssignments);
router.post("/deleteassignment", formController.deleteAssignments);
router.post("/getassignmentsbystaff", formController.getAssignmentsByStaff);
router.post('/addactivity', formController.addActivity);
router.post('/viewactivity', formController.viewActivities);
router.post('/activitydelete', formController.deleteActivity);
router.post('/updateactivity/:id', formController.updateActivity);
router.post("/getactivitybyparentid", formController.getActivitiesByParentId);
router.post("/getmaterialbyparentid", formController.getMaterialByParentId);
router.post("/getfoodbyparentid", formController.getFoodByParentId);
router.post("/adult/mark-food-viewed", formController.markFoodViewed);
router.post("/parentupdate", formController.parentEditByUpdate)
router.post('/getChildrenByParentId', formController.getChildrenByParentId);
router.post("/childedit", formController.childeditById)
router.post("/childupdate", formController.childEditByUpdate)
router.post("/childDelete", formController.childDelete)
router.post("/adultregisterpage", formController.adultRegisterPage)
router.post("/getAdultsByParentId", formController.getAdultsByParentId)
router.post("/adultedit", formController.adultEditById)
router.post("/adultupdate", formController.adultEditByUpdate)
router.post("/adultDelete", formController.adultDelete)
router.post("/addmilestone", formController.addMilestone);
router.post("/getmilestonesbystaff", formController.getMilestonesByStaff);
router.post("/getmilestonebyid", formController.getMilestoneById);
router.post("/deletemilestone", formController.deleteMilestone);
router.post("/updatemilestone", formController.updateMilestone);
router.post("/getmilestonesbyparent", formController.getMilestonesByParent);
router.post('/roomviewbyparent', formController.roomviewbyparent)
router.post('/lessonviewbyparent', formController.lessonviewbyparent)
router.post('/healthreport', formController.createHealthReport);
router.post('/viewhealthreport', formController.getAllHealthReports);
router.post('/viewhealthreportbyparent', formController.getAllHealthReportsbyParent);
router.post('/createCompliance', formController.createCompliance);
router.post('/getComplianceByParent', formController.getByParent);
router.get('/getCompliance', formController.getCompliance);
router.post('/updateComplianceStatus', formController.updateComplianceStatus);
router.post('/parentstaff', formController.parentstaff);
router.post('/staffparent', formController.staffparent);
router.post('/staffadult', formController.staffadult);
router.post('/send', formController.sendMessage);
router.get('/messages', formController.getMessages);
router.post('/monthlysum', formController.monthlysumbyparent);
router.post('/payment-success', formController.savePayment);
router.post('/payments-by-parent', formController.getPaymentsByParent);
router.get('/findallpayment', formController.findallpayment)


// Child Gamification
router.post('/child/mood', formController.updateChildMood);
router.post('/child/reward', formController.awardReward);
router.post('/child/gamified-data', formController.getChildGamifiedData);
router.post('/child/badge/delete', formController.deleteChildBadge);
router.post('/child/attendance/self', formController.getChildAttendance);
router.post('/child/milestones/self', formController.getChildMilestones);
router.post('/child/health/self', formController.getChildHealthReports);
router.post('/child/schedule', formController.getChildDailySchedule);
router.post('/child/learning-materials', formController.getChildStudyMaterials);
router.post('/child/emergency-alert', formController.sendEmergencyAlert);
router.post('/child/get-staff', formController.getAssignedStaffForChild);
router.post('/child/medications', formController.getChildMedications);

// Adult/Senior Features
router.post('/adult/add-medication', formController.addMedication);
router.post('/adult/get-medications', formController.getMedications);
router.post('/adult/log-medication', formController.logMedicationTaken);
router.post('/adult/mark-medication-viewed', formController.markMedicationViewed);
router.post('/adult/delete-medication', formController.deleteMedication);
router.post('/adult/get-medications-by-staff', formController.getMedicationsByStaff);
router.get('/adult/medications', formController.getMedications);
router.post('/adult/mood', formController.updateAdultMood);
router.post('/adult/reward', formController.awardAdultReward);
router.post('/adult/gamified-data', formController.getAdultGamifiedData);
router.post('/adult/badge/delete', formController.deleteAdultBadge);
router.post('/adult/attendance/self', formController.getAdultAttendance);
router.post('/adult/milestones/self', formController.getAdultMilestones);
router.post('/adult/health/self', formController.getAdultHealthReports);
router.post('/adult/schedule', formController.getAdultDailySchedule);
router.post('/adult/learning-materials', formController.getAdultStudyMaterials);


router.post('/adult/get-extra-curricular', formController.getAdultExtraCurricular);
router.post('/adult/get-nutrition', formController.getAdultNutrition);
router.get('/adult/get-quizzes', formController.getQuizzes);
router.post('/adult/submit-quiz', formController.submitQuizResult);
router.post('/adult/create-quiz', formController.createQuiz);
router.delete('/adult/quiz/:id', formController.deleteQuiz);
router.post('/seed-quizzes', formController.seedQuizzes);


// Adult: Get Assigned Staff
router.post('/adult/get-staff', formController.getAssignedStaffForAdult);

// Emergency
router.post('/emergency/trigger', formController.triggerEmergency);
router.post('/getattendancebyparentid', formController.getAttendanceByParentId);
router.post('/getmedicationsbyparentid', formController.getMedicationsByParentId);
router.post('/getextracurricularbyparentid', formController.getExtracurricularByParentId);

router.post('/get-notifications', formController.getNotifications);
router.post('/mark-notification-read', formController.markNotificationRead);

router.post('/apply-leave', formController.applyLeave);
router.get('/get-leaves', formController.getLeaves);
router.post('/get-my-leaves', formController.getMyLeaves);
router.get('/get-alternate-staff', formController.getAlternateStaffs);
router.post('/update-leave-status', formController.updateLeaveStatus);

// Immunization
router.post('/add-immunization', formController.addImmunizationRecord);
router.post('/get-immunizations', formController.getImmunizationRecords);
router.post('/get-immunizations-by-parent-id', formController.getImmunizationsByParentId);
router.post('/update-immunization-status', formController.updateImmunizationStatus);

module.exports = router
