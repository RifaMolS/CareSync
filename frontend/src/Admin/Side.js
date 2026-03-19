import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaTachometerAlt, FaMoneyBill, FaShieldAlt, FaUsers,
  FaUserShield, FaChild, FaUser, FaUserEdit, FaPhone,
  FaCogs, FaClock, FaDoorOpen, FaEye, FaUserCircle, FaTasks, FaChartPie, FaChevronDown, FaChevronUp
} from 'react-icons/fa';

export default function Side() {
  const location = useLocation();
  const [isManageOpen, setIsManageOpen] = useState(false);

  const NavItem = ({ to, icon, label }) => {
    const isActive = location.pathname.toLowerCase() === to.toLowerCase();

    return (
      <NavLink
        to={to}
        className="admin-side-item"
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 20px',
          margin: '4px 15px',
          borderRadius: '10px',
          textDecoration: 'none',
          fontSize: '1rem',
          fontWeight: isActive ? '600' : '400',
          color: isActive ? '#007bff' : '#555',
          backgroundColor: isActive ? '#f0f7ff' : 'transparent',
          transition: 'all 0.3s ease',
          border: 'none',
          outline: 'none',
          borderLeft: isActive ? '4px solid #007bff' : '4px solid transparent'
        }}
      >
        <span style={{
          marginRight: '15px',
          width: '20px',
          display: 'flex',
          alignItems: 'center',
          fontSize: '1.1rem',
          color: '#007bff'
        }}>
          {icon}
        </span>
        <span>{label}</span>
      </NavLink>
    );
  };

  return (
    <div className="sidebar pb-3" style={{
      width: "270px",
      minHeight: '100vh',
      zIndex: 1000,
      backgroundColor: '#F3F6F9',
      borderRight: '1px solid #e0e0e0',
      position: 'fixed',
      top: 0,
      left: 0,
      overflowY: 'auto'
    }}>
      <style>{`
                .admin-side-item:hover {
                    background-color: #f0f7ff !important;
                    color: #007bff !important;
                    transform: translateX(5px);
                }
                .admin-side-sub-item {
                    padding: 8px 20px 8px 55px;
                    font-size: 0.95rem;
                    color: #555;
                    text-decoration: none;
                    display: block;
                    transition: all 0.2s;
                    border-radius: 8px;
                    margin: 2px 15px 2px 35px;
                }
                .admin-side-sub-item:hover {
                    background-color: #ffffff;
                    color: #007bff;
                    padding-left: 60px;
                }
                .admin-side-sub-item.active {
                    color: #007bff;
                    font-weight: bold;
                    background-color: #ffffff;
                }
            `}</style>

      <nav className="w-100 mt-2">
        {/* Brand Section */}
        <NavLink to="/admin" style={{ textDecoration: 'none' }} className="mx-4 mb-4 mt-3 d-flex align-items-center">
          <div className="bg-primary rounded-circle p-2 me-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
            <FaChild className="text-white" size={24} />
          </div>
          <span className="text-primary fw-bold fs-4">CareSync</span>
        </NavLink>

        {/* Profile Section */}
        <div className="mx-3 mb-4 p-3 d-flex align-items-center bg-white rounded-4 shadow-sm border-0">
          <div className="position-relative">
            <img
              className="rounded-circle"
              src="Dash/img/user.jpg"
              alt="Admin"
              style={{ width: "45px", height: "45px", objectFit: 'cover', border: '2px solid #f0f7ff' }}
            />
            <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-2 border-white rounded-circle"></span>
          </div>
          <div className="ms-3 overflow-hidden">
            <h6 className="mb-0 fw-bold text-dark" style={{ fontSize: '0.95rem' }}>Admin User</h6>
            <small className="text-muted fw-medium" style={{ fontSize: '0.75rem' }}>Control Panel</small>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="navbar-nav w-100">
          <NavItem to="/admin" icon={<FaTachometerAlt />} label="Dashboard" />
          <NavItem to="/role" icon={<FaTasks />} label="Role" />
          <NavItem to="/staff" icon={<FaUsers />} label="Staff" />
          <NavItem to="/parent" icon={<FaUserShield />} label="Guardian" />
          <NavItem to="/useradult" icon={<FaUser />} label="Adult" />
          <NavItem to="/user" icon={<FaChild />} label="Child" />
          <NavItem to="/staffassignment" icon={<FaUserEdit />} label="Staff Assignment" />
          <NavItem to="/leaverequests" icon={<FaClock />} label="Leave Requests" />
          <NavItem to="/compliance" icon={<FaShieldAlt />} label="Compliance" />
          <NavItem to="/emergency-contacts" icon={<FaPhone />} label="Emergency" />
          <NavItem to="/analytics" icon={<FaChartPie />} label="Analytics" />
          <NavItem to="/billing" icon={<FaMoneyBill />} label="Billing" />


          {/* Management Toggle Section (Pushes content down) */}
          <div className="nav-item">
            <div
              onClick={() => setIsManageOpen(!isManageOpen)}
              className="admin-side-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 20px',
                margin: '4px 15px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1rem',
                color: '#555',
                transition: 'all 0.3s ease',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '15px', color: '#007bff', fontSize: '1.1rem' }}><FaCogs /></span>
                <span>Manage</span>
              </div>
              {isManageOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </div>

            {isManageOpen && (
              <div style={{ paddingBottom: '10px' }}>
                <NavLink to="/staffshift" className="admin-side-sub-item">Shift</NavLink>
                <NavLink to="/ManageOperations" className="admin-side-sub-item">Room</NavLink>
                <NavLink to="/ManageRoom" className="admin-side-sub-item">View</NavLink>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
