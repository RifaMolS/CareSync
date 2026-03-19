import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StaffNav from "./StaffNav";
import StaffSide from "./StaffSide";
import { motion } from "framer-motion";
import { FaUserEdit, FaCamera, FaSave, FaVenusMars, FaBriefcase, FaEnvelope, FaPhone, FaArrowLeft } from "react-icons/fa";

export default function StaffProfileEdit() {
  const [name, Setname] = useState("");
  const [email, Setemail] = useState("");
  const [phone, Setphone] = useState("");
  const [gender, Setgender] = useState("");
  const [role, Setrole] = useState("");
  const [shift, Setshift] = useState("");
  const [image, setImage] = useState(null);

  // New state for dynamic roles
  const [availableRoles, setAvailableRoles] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Fetch Staff Details
    if (!location.state?.id) return navigate('/staffprofile');

    const fetchStaffDetails = async () => {
      try {
        const res = await fetch("http://localhost:5000/demo/staffedit", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: location.state.id }),
        });
        const result = await res.json();
        Setname(result.edit.name);
        Setemail(result.valid.email); // Note: Backend seems to return email in 'valid' object
        Setphone(result.edit.phone);
        Setgender(result.edit.gender);
        Setrole(result.edit.role);
        Setshift(result.edit.shift);
        setImage(result.edit.image);
      } catch (err) {
        console.error(err);
      }
    }

    // 2. Fetch Dynamic Roles from Backend
    const fetchRoles = async () => {
      try {
        const res = await fetch("http://localhost:5000/demo/roleview");
        const data = await res.json();
        setAvailableRoles(data); // Assuming data is array of objects {role: "Caregiver", ...}
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };

    fetchStaffDetails();
    fetchRoles();
  }, [location.state, navigate]);

  const fileUpload = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    fetch("http://localhost:5000/util/fileUpload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((result) => {
        setImage(result);
      })
      .catch((error) => console.error("Error uploading file:", error));
  };

  const handleupdate = (e) => {
    e.preventDefault();
    let ids = {
      id: location.state.id,
      name,
      email,
      phone,
      gender,
      role,
      shift,
      image,
    };

    fetch("http://localhost:5000/demo/staffupdate", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ids),
    })
      .then((res) => res.json())
      .then(() => {
        alert("✅ Profile Updated Successfully!");
        navigate("/staffprofile");
      });
  };

  return (
    <div className="container-xxl position-relative bg-light d-flex p-0" style={{ minHeight: '100vh' }}>
      <StaffSide />
      <div className="content">
        <StaffNav />

        <div className="container-fluid pt-4 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="d-flex align-items-center mb-4"
          >
            <button onClick={() => navigate(-1)} className="btn btn-light rounded-circle me-3 shadow-sm"><FaArrowLeft /></button>
            <div>
              <h3 className="fw-bold text-dark mb-0">Update Profile</h3>
              <p className="text-muted mb-0">Edit staff personal information</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card border-0 shadow-lg rounded-4 overflow-hidden"
          >
            <div className="card-header bg-primary text-white p-4 border-bottom-0">
              <div className="d-flex align-items-center">
                <FaUserEdit className="display-6 me-3 opacity-50" />
                <h5 className="mb-0 fw-bold">Edit Details</h5>
              </div>
            </div>

            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleupdate}>
                <div className="row g-4">
                  {/* Profile Picture Section */}
                  <div className="col-md-4 text-center border-end">
                    <div className="mb-3 position-relative d-inline-block">
                      <div className="rounded-circle overflow-hidden border border-4 border-light shadow" style={{ width: '200px', height: '200px' }}>
                        {image ? (
                          <img src={`http://localhost:5000/${image}`} alt="Profile" className="w-100 h-100 object-fit-cover" />
                        ) : (
                          <div className="w-100 h-100 bg-secondary d-flex align-items-center justify-content-center text-white display-1">
                            {name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <label className="btn btn-warning rounded-circle position-absolute bottom-0 end-0 m-3 shadow-sm p-3" style={{ cursor: 'pointer' }}>
                        <FaCamera className="text-white" />
                        <input type="file" hidden accept="image/*" onChange={fileUpload} />
                      </label>
                    </div>
                    <h5 className="fw-bold">{name || "Staff Member"}</h5>
                    <span className="badge bg-primary-subtle text-primary rounded-pill px-3">{role || "Role"}</span>
                  </div>

                  {/* Form Fields */}
                  <div className="col-md-8 ps-md-5">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label text-muted fw-bold small text-uppercase">Full Name</label>
                        <input type="text" className="form-control form-control-lg bg-light border-0" value={name} onChange={(e) => Setname(e.target.value)} required />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label text-muted fw-bold small text-uppercase"><FaEnvelope className="me-2" />Email</label>
                        <input type="email" className="form-control bg-light border-0" value={email} onChange={(e) => Setemail(e.target.value)} required />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label text-muted fw-bold small text-uppercase"><FaPhone className="me-2" />Phone</label>
                        <input type="tel" className="form-control bg-light border-0" value={phone} onChange={(e) => Setphone(e.target.value)} required />
                      </div>

                      <div className="col-12 my-3">
                        <label className="form-label text-muted fw-bold small text-uppercase"><FaVenusMars className="me-2" />Gender</label>
                        <div className="d-flex gap-3">
                          {['Male', 'Female', 'Other'].map(opt => (
                            <label key={opt} className={`btn btn-outline-secondary px-4 rounded-pill ${gender.toLowerCase() === opt.toLowerCase() ? 'active fw-bold' : ''}`}>
                              <input type="radio" name="gender" value={opt.toLowerCase()} checked={gender.toLowerCase() === opt.toLowerCase()} onChange={(e) => Setgender(e.target.value)} className="d-none" />
                              {opt}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label text-muted fw-bold small text-uppercase"><FaBriefcase className="me-2" />Role</label>
                        <select className="form-select bg-light border-0" value={role} onChange={(e) => Setrole(e.target.value)} required>
                          <option value="">Select Role</option>
                          {availableRoles.map(r => (
                            <option key={r._id} value={r.role}>{r.role}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label text-muted fw-bold small text-uppercase">Preferred Shift</label>
                        <select className="form-select bg-light border-0" value={shift} onChange={(e) => Setshift(e.target.value)}>
                          <option value="">Select Shift</option>
                          <option value="Morning">Morning</option>
                          <option value="Evening">Evening</option>
                          <option value="Night">Night</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-5 text-end">
                      <button type="submit" className="btn btn-primary btn-lg rounded-pill px-5 shadow-sm">
                        <FaSave className="me-2" /> Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
