import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NotificationBell from "../Common/NotificationBell";

export default function StaffNav() {
  const handlelogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const [userData, setUserData] = useState({});

  const auth = JSON.parse(localStorage.getItem("user"));
  const staffId = auth?._id || auth?.regid; // fallback if _id not present

  useEffect(() => {
    if (!staffId) {
      return;
    }

    fetch("http://localhost:5000/demo/staffview")
      .then((res) => res.json())
      .then((result) => {
        // Try to match by _id or regid (string comparison)
        const staff = result.find(
          (item) =>
            String(item._id) === String(staffId) ||
            String(item.regid) === String(staffId)
        );
        if (!staff) {
          setUserData({});
        } else {
          setUserData(staff);
        }
      })
      .catch((err) => {
        console.error("Error fetching staff:", err);
      });
  }, []);

  return (
    <div>
      <nav
        className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-0"
        style={{ marginLeft: "0px" }}
      >
        <a href="/" className="navbar-brand d-flex d-lg-none me-4">
          <h2 className="text-primary mb-0">CareSync</h2>
        </a>
        <a href="#" className="sidebar-toggler flex-shrink-0">
          <i className="fa fa-bars"></i>
        </a>
        <form className="d-none d-md-flex ms-4">
          <input
            className="form-control border-0"
            type="search"
            placeholder="Search"
          />
        </form>
        <div className="navbar-nav align-items-center ms-auto">
          <div className="nav-item me-3">
            <NotificationBell iconColor="#0d6efd" />
          </div>
          <div className="nav-item dropdown">
            <a
              href="#"
              className="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              <img
                className="rounded-circle me-lg-2"
                src={`http://localhost:5000/${userData?.regid?.image}`}
                alt=""
                style={{ width: "40px", height: "40px" }}
              />
              <span className="d-none d-lg-inline-flex">
                <h6 className="mb-0">
                  {userData?.regid?.name || "No Name Found"}
                </h6>
              </span>
            </a>
            <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
              <Link to="/staffprofile" className="dropdown-item">
                My Profile
              </Link>
              <a href="#" className="dropdown-item" onClick={handlelogout}>
                LogOut
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
