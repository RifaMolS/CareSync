import React from "react";
import ParentHome from "./ParentDash";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import NotificationBell from "../Common/NotificationBell";

export default function ParentNav() {
  const handlelogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  const [userData, setUserData] = useState([]);
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("user")));
  const location = useLocation(); // Get the current route location

  useEffect(() => {
    // let id = { regid: auth?.regid };
    fetch("http://localhost:5000/demo/parentid", {
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
        // console.log(result, "resultside");
      });
  }, [auth]);
  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '10px 20px 0 20px' }}>
      <nav
        className="navbar navbar-expand bg-white sticky-top px-4 py-2 shadow-sm"
        style={{
          borderRadius: '16px',
          border: '1px solid #f1f5f9',
          marginTop: '10px'
        }}
      >
        <div className="container-fluid p-0">
          <a href="#" className="sidebar-toggler flex-shrink-0 me-2 d-lg-none">
            <i className="fa fa-bars text-primary"></i>
          </a>

          <form className="d-none d-md-flex ms-2" style={{ flex: 1, maxWidth: '400px' }}>
            <div className="input-group" style={{ backgroundColor: '#f1f5f9', borderRadius: '10px', overflow: 'hidden', padding: '2px 10px' }}>
              <span className="input-group-text bg-transparent border-0">
                <i className="fa fa-search text-muted"></i>
              </span>
              <input
                className="form-control border-0 bg-transparent"
                type="search"
                placeholder="Search resources, activities..."
                style={{ boxShadow: 'none', fontSize: '0.9rem' }}
              />
            </div>
          </form>

          <div className="navbar-nav align-items-center ms-auto">
            <div className="nav-item me-3">
              <NotificationBell iconColor="#4f46e5" />
            </div>
            <div className="nav-item dropdown">
              <a
                href="#"
                className="nav-link dropdown-toggle d-flex align-items-center p-0"
                data-bs-toggle="dropdown"
                style={{ color: '#1e293b' }}
              >
                <div className="position-relative">
                  <img
                    className="rounded-circle"
                    src={`http://localhost:5000/${userData.image}`}
                    alt=""
                    style={{ width: "38px", height: "38px", border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                  />
                  <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-white rounded-circle" style={{ width: '10px', height: '10px' }}></span>
                </div>
                <span className="d-none d-lg-inline-flex ms-2 fw-bold" style={{ fontSize: '0.9rem' }}>
                  {userData ? userData.parentname : "n/a"}
                </span>
              </a>
              <div className="dropdown-menu dropdown-menu-end bg-white border-0 shadow-lg rounded-3 mt-3 py-2 px-2" style={{ minWidth: '200px' }}>
                <div className="px-3 py-2 mb-2 border-bottom">
                  <p className="mb-0 fw-bold" style={{ fontSize: '0.9rem' }}>{userData?.parentname}</p>
                  <small className="text-muted" style={{ fontSize: '0.75rem' }}>Guardian  Account</small>
                </div>
                <Link to="/parentprofile" className="dropdown-item rounded-2 py-2 mb-1" style={{ fontSize: '0.9rem' }}>
                  <i className="fa fa-user-circle me-3 text-primary opacity-75"></i>My Profile
                </Link>
                <div className="dropdown-divider"></div>

                <a href="#" className="dropdown-item rounded-2 py-2 text-danger" onClick={handlelogout} style={{ fontSize: '0.9rem' }}>
                  <i className="fa fa-power-off me-3 text-danger opacity-75"></i>Log Out
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
