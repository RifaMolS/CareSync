import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
    FaTachometerAlt, FaClock, FaCommentDots, FaUtensils, FaTasks,
    FaFlag, FaClipboardCheck, FaChartLine, FaStar, FaHeartbeat,
    FaCapsules, FaBook, FaRunning, FaChalkboardTeacher,
    FaDoorOpen, FaUserCircle, FaChild, FaShieldVirus, FaGraduationCap, FaCalendarMinus
} from 'react-icons/fa';

export default function StaffSide() {
    const location = useLocation();
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStaffProfile = async () => {
            try {
                const auth = JSON.parse(localStorage.getItem("user"));
                const staffId = auth?._id || auth?.regid;
                if (!staffId) return;

                const res = await axios.get('http://localhost:5000/demo/staffview');
                const staff = res.data.find(
                    (item) => String(item._id) === String(staffId) || String(item.regid) === String(staffId)
                );
                if (staff) setUserData(staff);
            } catch (err) {
                console.error("StaffSide Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStaffProfile();
    }, []);

    const role = (userData?.role || userData?.regid?.role || "").toLowerCase();

    // Custom NavItem to avoid template CSS conflicts (No 'nav-link' class)
    const NavItem = ({ to, icon, label }) => {
        const isActive = location.pathname.toLowerCase() === to.toLowerCase();

        return (
            <Link
                to={to}
                className="custom-nav-item"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 20px',
                    margin: '4px 12px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? '600' : '400',
                    color: isActive ? '#009CFF' : '#757575',
                    backgroundColor: isActive ? '#eef8ff' : 'transparent',
                    borderLeft: isActive ? '4px solid #009CFF' : '4px solid transparent',
                    transition: 'all 0.2s ease-in-out',
                    outline: 'none',
                    boxShadow: 'none'
                }}
            >
                <span style={{
                    marginRight: '15px',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    width: '20px'
                }}>
                    {icon}
                </span>
                <span>{label}</span>
            </Link>
        );
    };

    return (
        <div className="sidebar pb-3" style={{
            width: "250px",
            minHeight: '100vh',
            zIndex: 1000,
            backgroundColor: '#F3F6F9', // Solid light background
            borderRight: '1px solid #e0e0e0',
            position: 'fixed',
            top: 0,
            left: 0,
            overflowY: 'auto'
        }}>
            <style>{`
                .custom-nav-item:hover {
                    background-color: #eef8ff !important;
                    color: #009CFF !important;
                    transform: translateX(5px);
                }
                .custom-nav-item {
                    transition: all 0.3s ease;
                }
            `}</style>
            <nav className="w-100 mt-2">
                {/* Brand Section */}
                <Link to="/staffhome" style={{ textDecoration: 'none' }} className="mx-4 mb-4 mt-3 d-flex align-items-center">
                    <div className="bg-primary rounded-circle p-2 me-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        <FaChild className="text-white" size={24} />
                    </div>
                    <span className="text-primary fw-bold fs-4">CareSync</span>
                </Link>

                {/* Profile Section */}
                <div className="mx-3 mb-4 p-3 d-flex align-items-center bg-white rounded-3 shadow-none border-0" style={{ border: 'none' }}>
                    <div className="position-relative">
                        {userData?.regid?.image ? (
                            <img
                                className="rounded-circle object-fit-cover"
                                src={`http://localhost:5000/${userData.regid.image}`}
                                alt=""
                                style={{ width: "45px", height: "45px" }}
                            />
                        ) : (
                            <FaUserCircle size={45} className="text-secondary" />
                        )}
                        <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-2 border-white rounded-circle" style={{ width: '12px', height: '12px' }}></span>
                    </div>
                    <div className="ms-3 overflow-hidden">
                        <h6 className="mb-0 fw-bold text-truncate" style={{ fontSize: '0.9rem', color: '#333' }}>{userData?.regid?.name || "Staff"}</h6>
                        <small className="text-muted text-capitalize" style={{ fontSize: '0.7rem' }}>{role || "Member"}</small>
                    </div>
                </div>

                {/* Navigation Menu */}
                <div className="mt-2">
                    <div className="small fw-bold text-uppercase text-muted mx-4 mb-2" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>Main Menu</div>
                    <NavItem to="/staffhome" icon={<FaTachometerAlt />} label="Dashboard" />
                    <NavItem to="/myshift" icon={<FaClock />} label="My Shift" />
                    <NavItem to="/myleave" icon={<FaCalendarMinus />} label="My Leave" />
                    <NavItem to="/staffcommunication" icon={<FaCommentDots />} label="Messages" />
                    <NavItem to="/staffroom" icon={<FaDoorOpen />} label="Rooms" />

                    <div className="small fw-bold text-uppercase text-muted mx-4 mt-4 mb-2" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>Care & Health</div>
                    <NavItem to="/DailyActivities" icon={<FaTasks />} label="Activities" />
                    <NavItem to="/NutritionalFood" icon={<FaUtensils />} label="Nutrition" />
                    <NavItem to="/Attendance" icon={<FaClipboardCheck />} label="Attendance" />
                    <NavItem to="/childmilestone" icon={<FaFlag />} label="Milestones" />
                    <NavItem to="/assignrewards" icon={<FaStar />} label="Rewards" />

                    <div className="small fw-bold text-uppercase text-muted mx-4 mt-4 mb-2" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>Medical</div>
                    <NavItem to="/healthdevelopment" icon={<FaChartLine />} label="Health Logs" />
                    <NavItem to="/HealthAnalysis" icon={<FaHeartbeat />} label="Analysis" />
                    <NavItem to="/managemedications" icon={<FaCapsules />} label="Medications" />
                    <NavItem to="/immunization" icon={<FaShieldVirus />} label="Immunization" />

                    <div className="small fw-bold text-uppercase text-muted mx-4 mt-4 mb-2" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>Programs</div>
                    <NavItem to="/lessonplanning" icon={<FaChalkboardTeacher />} label="Lesson Plans" />
                    <NavItem to="/ExtracurricularActivities" icon={<FaRunning />} label="Extra Acts" />
                    <NavItem to="/StudyMaterialPage" icon={<FaBook />} label="Study Materials" />
                    <NavItem to="/StaffQuiz" icon={<FaGraduationCap />} label="Quizzes" />
                </div>
            </nav>
        </div>
    );
}
