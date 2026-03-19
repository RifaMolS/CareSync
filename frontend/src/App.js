import "./App.css";
import NotificationPage from "./UserHome/NotificationPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./i18n";
import { Routes, Route, Navigate } from "react-router-dom";
import Content from "./UserHome/Content";
import About from "./UserHome/About";
import LoginPage from "./UserHome/LoginPage";
import Contact from "./UserHome/Contact";
import DashBoard from "./Admin/DashBoard";
import Billing from "./Admin/Billing";
import User from "./Admin/User";
import Analytics from "./Admin/Analytics";
import Compliance from "./Admin/Compliance";
import Staff from "./Admin/Staff";
import Parent from "./Admin/parent";
import StaffRegister from "./UserHome/StaffRegister";
import ParentRegister from "./UserHome/ParentRegister";
import ChildRegister from "./UserHome/ChildRegister";
import UpdateStaff from "./Admin/UpdateStaff";
import Register from "./Admin/Register";
import { useState } from "react";
import StaffHome from "./StaffHome/StaffDash";
import StudyMaterialPage from "./StaffHome/StudyMaterialPage";
import HealthAnalysis from "./StaffHome/HealthAnalysis";
import NutritionalFood from "./StaffHome/NutritionalFood";
import DailyActivities from "./StaffHome/DailyActivities";
import ExtracurricularActivities from "./StaffHome/ExtracurricularActivities";
import StaffQuiz from "./StaffHome/StaffQuiz";
import Attendance from "./StaffHome/Attendance";
import ParentHome from "./ParentHome/ParentDash";
import Payment from "./ParentHome/Payment";
import Role from "./Admin/Role";
import StaffCommunication from "./StaffHome/Staff Communication";
import ManageOperations from "./Admin/ManageOperations";
import MyChild from "./ParentHome/MyChild";
import RoomView from "./Admin/RoomView";
import RoomUpdate from "./Admin/roomUpdate";
import StaffRole from "./StaffHome/StaffRole";
import LessonPlanning from "./StaffHome/Lessonplanning";
import ActivityUpdate from "./StaffHome/ActivityUpdate";
import LessonUpdate from "./StaffHome/LessonUpdate";
import Staffroom from "./StaffHome/StaffRoom";
import MyShift from "./StaffHome/MyShift";
import StaffShift from "./Admin/StaffShift";
import LeaveRequests from "./Admin/LeaveRequests";
import MyLeave from "./StaffHome/MyLeave";
import StaffList from "./StaffHome/StaffProfile";
import HealthDevelopment from "./StaffHome/HealthDevelopment";
import StaffProfileEdit from "./StaffHome/StaffProfileEdit";
import StaffAssignment from "./Admin/StaffAssignment";
import ParentProfile from "./ParentHome/ParentProfile";
import ParentProfileEdit from "./ParentHome/ParentProfileEdit";
import ChildMilestone from "./StaffHome/ChildMilestone";
import AssignRewards from "./StaffHome/AssignRewards";
import ManageMedications from "./StaffHome/ManageMedications";
import Immunization from "./StaffHome/Immunization";
import Telemedicine from "./Common/Telemedicine";
import MyAdult from "./ParentHome/MyAdult";
import UserAdult from "./Admin/UserAdult";
import EmergencyContacts from "./Admin/EmergencyContacts";
import ParentPortal from "./ParentHome/ParentPortal";
import ActivityFeed from "./ParentHome/ActivityFeed";
import RoomOverview from "./ParentHome/RoomOverview";
import UpdateChild from "./ParentHome/UpdateChild";
import UpdateAdult from "./ParentHome/UpdateAdult";
import ParentCompliance from "./ParentHome/ParentCompliance";
import ParentImmunization from "./ParentHome/ParentImmunization";
import StudyMaterialView from "./ParentHome/StudyMaterialView";
import ParentAttendance from "./ParentHome/ParentAttendance";
import ParentMedications from "./ParentHome/ParentMedications";
import ParentActivities from "./ParentHome/ParentActivities";
import ParentStudyMaterials from "./ParentHome/ParentStudyMaterials";
import NutritionFeed from "./ParentHome/NutritionFeed";
import Milestones from "./ParentHome/Milestones";
import ParentCommunication from "./ParentHome/ParentCommunication";
import ChildDashboard from "./ChildTheme/ChildDashboard";
import MilestonePage from "./UserHome/MilestonePage";
import ChildCareAttendance from "./UserHome/ChildCareAttendance";
import ChildActivities from "./ChildTheme/ChildActivities";
import AdultDashboard from "./Adult/AdultDashboard";
import AssignedStaff from "./Adult/AssignedStaff";
import AdultAttendance from "./Adult/AdultAttendance";
import AdultMilestones from "./Adult/AdultMilestones";
import AdultHealth from "./Adult/AdultHealth";
import AdultActivities from './Adult/AdultActivities';
import AdultQuiz from "./Adult/AdultQuiz";
import AdultCommunication from "./Adult/AdultCommunication";
import AdultImmunization from "./Adult/AdultImmunization";

function App() {
  const [auth] = useState(JSON.parse(localStorage.getItem("user")));
  return (
    auth === null ? (
      <Routes>
        <Route path="/" element={<Content />}></Route>
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/staffregister" element={<StaffRegister />} />
        <Route path="/parentregister" element={<ParentRegister />} />
        <Route path="/childregister" element={<ChildRegister />} />
      </Routes>
    ) : auth.status === 1 ? (
      <Routes>
        <Route path="/" element={<Navigate to="/staffhome" replace />} />
        <Route path="/staffhome" element={<StaffHome />}></Route>
        <Route path="/StudyMaterialPage" element={<StudyMaterialPage />}></Route>
        <Route path="/HealthAnalysis" element={<HealthAnalysis />}></Route>
        <Route path="/NutritionalFood" element={<NutritionalFood />}></Route>
        <Route path="/DailyActivities" element={<DailyActivities />}></Route>
        <Route path="/ExtracurricularActivities" element={<ExtracurricularActivities />}></Route>
        <Route path="/StaffQuiz" element={<StaffQuiz />}></Route>
        <Route path="/Attendance" element={<Attendance />}></Route>
        <Route path="/StaffCommunication" element={<StaffCommunication />}></Route>
        <Route path="/Payment" element={<Payment />}></Route>
        <Route path="/staffrole" element={<StaffRole />}></Route>
        <Route path="/lessonplanning" element={<LessonPlanning />}></Route>
        <Route path="/updateactivity" element={<ActivityUpdate />} />
        <Route path="/updatelesson" element={<LessonUpdate />} />
        <Route path="/staffroom" element={<Staffroom />} />
        <Route path="/myshift" element={<MyShift />} />
        <Route path="/myleave" element={<MyLeave />} />
        <Route path="/staffprofile" element={<StaffList />} />
        <Route path="/staffprofileedit" element={<StaffProfileEdit />} />
        <Route path="/assignrewards" element={<AssignRewards />} />
        <Route path="/managemedications" element={<ManageMedications />} />
        <Route path="/immunization" element={<Immunization />} />
        <Route path="/healthdevelopment" element={<HealthDevelopment />} />
        <Route path="/childmilestone" element={<ChildMilestone />} />
      </Routes>
    ) : auth.status === 2 ? (
      <Routes>
        <Route path="/" element={<Navigate to="/parenthome" replace />} />
        <Route path="/parenthome" element={<ParentHome />}></Route>
        <Route path="/Payment" element={<Payment />}></Route>
        <Route path="/ActivityFeed" element={<ActivityFeed />}></Route>
        <Route path="/StudyMaterialView" element={<StudyMaterialView />}></Route>
        <Route path="/ParentAttendance" element={<ParentAttendance />} />
        <Route path="/ParentMedications" element={<ParentMedications />} />
        <Route path="/ParentActivities" element={<ParentActivities />} />
        <Route path="/ParentStudyMaterials" element={<ParentStudyMaterials />} />
        <Route path="/NutritionFeed" element={<NutritionFeed />}></Route>
        <Route path="/Milestones" element={<Milestones />}></Route>
        {/* <Route path="/HealthDevelopmentView" element={<HealthDevelopmentView />}></Route> */}
        <Route path="/ParentCommunication" element={<ParentCommunication />}></Route>
        <Route path="/MyChild" element={<MyChild />}></Route>
        <Route path="/MyAdult" element={<MyAdult />}></Route>
        <Route path="/Parentportal" element={<ParentPortal />}></Route>
        <Route path="/RoomOverview" element={<RoomOverview />}></Route>
        <Route path="/parentprofile" element={<ParentProfile />} />
        <Route path="/parentprofileedit" element={<ParentProfileEdit />} />
        <Route path="/updatechild" element={<UpdateChild />} />
        <Route path="/updateadult" element={<UpdateAdult />} />
        <Route path="/parentcompliance" element={<ParentCompliance />} />
        <Route path="/ParentImmunization" element={<ParentImmunization />} />

      </Routes>
    ) : auth.status === 3 ? (
      <Routes>
        <Route path="/" element={<ChildDashboard />}></Route>
        <Route path="/home" element={<Content />}></Route>
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/childmilestones" element={<MilestonePage />} />
        <Route path="/childattendance" element={<ChildCareAttendance />} />
        <Route path="/childactivities" element={<ChildActivities />} />
      </Routes>
    ) : auth.status === 4 ? (
      <Routes>
        <Route path="/" element={<AdultDashboard />} />
        <Route path="/adult/dashboard" element={<AdultDashboard />} />
        <Route path="/adult/staff" element={<AssignedStaff />} />
        <Route path="/adult/attendance" element={<AdultAttendance />} />
        <Route path="/adult/milestones" element={<AdultMilestones />} />
        <Route path="/adult/health" element={<AdultHealth />} />
        <Route path="/adult/activities" element={<AdultActivities />} />

        <Route path="/adult/quiz" element={<AdultQuiz />} />
        <Route path="/adult/communication" element={<AdultCommunication />} />
        <Route path="/adult/immunization" element={<AdultImmunization />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    ) : auth?.role === "admin" ? (
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<DashBoard />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/parent" element={<Parent />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/user" element={<User />} />
        <Route path="/useradult" element={<UserAdult />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/updatestaff" element={<UpdateStaff />} />
        <Route path="/register" element={<Register />} />
        <Route path="/role" element={<Role />} />
        <Route path="/manageoperations" element={<ManageOperations />} />
        <Route path="/ManageRoom" element={<RoomView />} />
        <Route path="/roomupdate" element={<RoomUpdate />} />
        <Route path="/staffshift" element={<StaffShift />} />
        <Route path="/leaverequests" element={<LeaveRequests />} />
        <Route path="/staffassignment" element={<StaffAssignment />} />
        <Route path="/telemedicine" element={<Telemedicine />} />
        <Route path="/emergency-contacts" element={<EmergencyContacts />} />
        <Route path="/notificationpage" element={<NotificationPage />} />
      </Routes>
    ) : null
  );
}

export default App;