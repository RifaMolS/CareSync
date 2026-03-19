import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    FaTachometerAlt, FaChild, FaUser, FaUserCircle,
    FaMoneyBillWave, FaChartPie, FaCalendarCheck,
    FaPills, FaRunning, FaBook, FaAppleAlt,
    FaFlagCheckered, FaHeartbeat, FaComments,
    FaFileAlt, FaDoorOpen, FaSyringe
} from 'react-icons/fa';

export default function ParentSide() {
    const [userData, setUserData] = useState(null);
    const [auth] = useState(JSON.parse(localStorage.getItem("user")));
    const location = useLocation();

    useEffect(() => {
        fetch('http://localhost:5000/demo/parentid', {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: auth?.regid }),
        })
            .then((res) => res.json())
            .then((result) => {
                setUserData(result);
            })
            .catch(err => console.error("ParentSide Fetch Error:", err));
    }, [auth]);

    const NavItem = ({ to, icon, label, color }) => {
        const isActive = location.pathname.toLowerCase() === to.toLowerCase();
        return (
            <Link
                to={to}
                className={`custom-nav-item ${isActive ? 'active' : ''}`}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 20px',
                    margin: '4px 16px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? '600' : '500',
                    color: isActive ? '#0d6efd' : '#5c636a',
                    backgroundColor: isActive ? '#e7f1ff' : 'transparent',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {isActive && (
                    <div style={{
                        position: 'absolute',
                        left: 0,
                        top: '20%',
                        bottom: '20%',
                        width: '4px',
                        backgroundColor: '#0d6efd',
                        borderRadius: '0 4px 4px 0'
                    }} />
                )}
                <span style={{
                    marginRight: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    fontSize: '1.2rem',
                    color: isActive ? '#0d6efd' : color || '#6c757d',
                    backgroundColor: isActive ? 'transparent' : '#f8f9fa',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease'
                }}>
                    {icon}
                </span>
                <span style={{ flex: 1 }}>{label}</span>
            </Link>
        );
    };

    return (
        <div className="sidebar" style={{
            width: "260px",
            height: '100vh',
            zIndex: 1000,
            backgroundColor: '#ffffff',
            borderRight: '1px solid #f1f5f9',
            position: 'fixed',
            top: 0,
            left: 0,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '4px 0 20px rgba(15, 23, 42, 0.03)'
        }}>
            <style>{`
                .custom-nav-item:hover {
                    background-color: #f8f9fa !important;
                    color: #212529 !important;
                    transform: translateX(4px);
                }
                .custom-nav-item.active:hover {
                    background-color: #e7f1ff !important;
                    color: #0d6efd !important;
                    transform: none;
                }
                .custom-nav-item:hover span:first-of-type {
                    background-color: #fff !important;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
                }
                .sidebar::-webkit-scrollbar {
                    width: 5px;
                }
                .sidebar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .sidebar::-webkit-scrollbar-thumb {
                    background: #e0e0e0;
                    border-radius: 10px;
                }
                .sidebar::-webkit-scrollbar-thumb:hover {
                    background: #d0d0d0;
                }
            `}</style>

            <div style={{ overflowY: 'auto', flex: 1, paddingBottom: '20px' }}>
                {/* Brand Section */}
                <div className="px-4 py-3 mb-1">
                    <Link to="/parenthome" style={{ textDecoration: 'none' }} className="d-flex align-items-center">
                        <div className="bg-primary rounded-3 p-2 me-3 d-flex align-items-center justify-content-center" style={{
                            width: '32px',
                            height: '32px',
                            background: 'linear-gradient(135deg, #0d6efd 0%, #0043a8 100%)',
                            boxShadow: '0 4px 10px rgba(13, 110, 253, 0.2)'
                        }}>
                            <FaChild className="text-white" size={14} />
                        </div>
                        <span className="fw-bold fs-5" style={{ color: '#0f172a', letterSpacing: '-0.5px' }}>CareSync</span>
                    </Link>
                </div>

                {/* Profile Section */}
                <div className="mx-3 mb-3 p-2 d-flex align-items-center rounded-4" style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 2px 4px rgba(15, 23, 42, 0.02)'
                }}>
                    <div className="position-relative">
                        {userData?.image ? (
                            <img
                                className="rounded-circle object-fit-cover shadow-sm"
                                src={`http://localhost:5000/${userData.image}`}
                                alt=""
                                style={{ width: "36px", height: "36px", border: '2px solid #fff' }}
                            />
                        ) : (
                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center border" style={{ width: '36px', height: '36px' }}>
                                <FaUserCircle size={28} className="text-secondary opacity-40" />
                            </div>
                        )}
                        <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-2 border-white rounded-circle shadow-sm" style={{
                            width: '8px',
                            height: '8px'
                        }}></span>
                    </div>
                    <div className="ms-3 overflow-hidden">
                        <h6 className="mb-0 fw-bold text-truncate" style={{ fontSize: '0.75rem', color: '#1e293b' }}>{userData?.parentname || "Guardian"}</h6>
                        <small className="text-muted fw-semibold" style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Guardian Portal</small>
                    </div>
                </div>

                {/* Navigation Menu */}
                <div className="navbar-nav w-100">
                    <div className="small fw-bold text-uppercase text-muted mx-4 mb-2" style={{ fontSize: '0.6rem', letterSpacing: '1.5px', opacity: 0.5 }}>Overview</div>

                    <NavItem to="/parenthome" icon={<FaTachometerAlt />} label="Dashboard" color="#6366f1" />
                    <NavItem to="/ParentCommunication" icon={<FaComments />} label="Communication" color="#06b6d4" />

                    <NavItem to="/Payment" icon={<FaMoneyBillWave />} label="Payment" color="#1cc88a" />
                    <NavItem to="/ActivityFeed" icon={<FaChartPie />} label="Activity Feed" color="#36b9cc" />
                    <NavItem to="/ParentAttendance" icon={<FaCalendarCheck />} label="Attendance" color="#f6c23e" />
                    <NavItem to="/ParentMedications" icon={<FaPills />} label="Medications" color="#ef4444" />
                    <NavItem to="/ParentImmunization" icon={<FaSyringe />} label="Immunization" color="#4f46e5" />
                    <NavItem to="/ParentActivities" icon={<FaRunning />} label="Extracurriculars" color="#6366f1" />
                    <NavItem to="/ParentStudyMaterials" icon={<FaBook />} label="Study Material" color="#8b5cf6" />
                    <NavItem to="/NutritionFeed" icon={<FaAppleAlt />} label="Nutrition" color="#f97316" />
                    <NavItem to="/Milestones" icon={<FaFlagCheckered />} label="Milestones" color="#14b8a6" />
                    <div className="small fw-bold text-uppercase text-muted mx-4 mt-4 mb-2" style={{ fontSize: '0.6rem', letterSpacing: '1.5px', opacity: 0.5 }}>Management</div>

                    <NavItem to="/MyChild" icon={<FaChild />} label="My Child" color="#6366f1" />
                    <NavItem to="/MyAdult" icon={<FaUser />} label="My Adults" color="#7c3aed" />
                    <NavItem to="/parentcompliance" icon={<FaFileAlt />} label="Compliance" color="#64748b" />
                    <NavItem to="/RoomOverview" icon={<FaDoorOpen />} label="Room Overview" color="#22c55e" />
                </div>
            </div>
        </div>
    );
}



