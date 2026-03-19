import React, { useEffect, useState } from "react";
import axios from "axios";
import { MultiSelect } from "react-multi-select-component";
import AdminNav from "./AdminNav";
import Side from "./Side";
import { motion } from "framer-motion";
import { FaUserNurse, FaChild, FaUserTie, FaTrashAlt, FaSearch, FaExchangeAlt } from "react-icons/fa";

export default function StaffAssignment() {
  const [staffList, setStaffList] = useState([]);
  const [childList, setChildList] = useState([]);
  const [adultList, setAdultList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [selectedAdults, setSelectedAdults] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [filterStaff, setFilterStaff] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffRes, childRes, adultRes, assignRes] = await Promise.all([
          axios.get("http://localhost:5000/demo/staffview"),
          axios.get("http://localhost:5000/demo/childview"),
          axios.get("http://localhost:5000/demo/adultview"),
          axios.get("http://localhost:5000/demo/assignments")
        ]);
        const regularStaff = staffRes.data.filter(staff => !staff.regid?.isAlternate);
        setStaffList(regularStaff);
        setChildList(childRes.data);
        setAdultList(adultRes.data);
        setAssignments(assignRes.data);
      } catch (error) {
        console.error("Error loading data", error);
      }
    }
    fetchData();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/demo/assignments");
      setAssignments(res.data);
    } catch (error) {
      console.error("Error fetching assignments", error);
    }
  };

  const handleAssign = async () => {
    if (!selectedStaff || (selectedChildren.length === 0 && selectedAdults.length === 0)) {
      alert("Please select staff and at least one child or adult.");
      return;
    }

    const childIds = selectedChildren.map((child) => child.value);
    const adultIds = selectedAdults.map((adult) => adult.value);

    try {
      await axios.post("http://localhost:5000/demo/assign", {
        staffId: selectedStaff,
        childIds,
        adultIds,
      });
      alert("✅ Assignment successful!");
      setSelectedStaff("");
      setSelectedChildren([]);
      setSelectedAdults([]);
      fetchAssignments();
    } catch (err) {
      if (err.response?.data?.errors) {
        alert("Errors:\n" + err.response.data.errors.join("\n"));
      } else {
        alert("Error assigning: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this assignment?")) {
      try {
        await axios.post("http://localhost:5000/demo/deleteassignment", { id });
        alert("🗑️ Assignment removed.");
        fetchAssignments();
      } catch (err) {
        console.error("Error deleting assignment", err);
        alert("Failed to delete assignment");
      }
    }
  };

  const filteredAssignments = assignments.filter((assign) =>
    assign.staffId?.regid?.name?.toLowerCase().includes(filterStaff.toLowerCase())
  );

  return (
    <div className="container-xxl position-relative bg-light d-flex p-0" style={{ minHeight: '100vh' }}>
      <Side />
      <div className="content">
        <AdminNav />
        <div className="container-fluid pt-4 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-5"
          >
            <h2 className="fw-bold text-primary">🤝 Staff & Care Recipient Management</h2>
            <p className="text-muted">Efficiently assign caregivers to children and adults</p>
          </motion.div>

          <div className="row g-4">
            {/* Assignment Form Section */}
            <div className="col-lg-4">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="card border-0 shadow-lg rounded-4"
              >
                <div className="card-header bg-primary text-white p-4">
                  <h4 className="mb-0 fw-bold"><FaExchangeAlt className="me-2" /> New Assignment</h4>
                </div>
                <div className="card-body p-4 bg-white">
                  <div className="mb-4">
                    <label className="form-label fw-bold text-secondary">Select Caregiver (Staff)</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light"><FaUserNurse className="text-primary" /></span>
                      <select
                        className="form-select"
                        value={selectedStaff}
                        onChange={(e) => setSelectedStaff(e.target.value)}
                        style={{ height: '50px' }}
                      >
                        <option value="">-- Choose Staff Member --</option>
                        {staffList
                          .filter(staff => !assignments.some(assign => assign.staffId?._id === staff._id))
                          .map((staff) => (
                            <option key={staff._id} value={staff._id}>
                              {staff.regid?.name || staff.email}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold text-secondary">Select Children</label>
                    <MultiSelect
                      options={childList.map((child) => ({
                        label: `👶 ${child?.regid?.childname || child?.email}`,
                        value: child._id,
                      }))}
                      value={selectedChildren}
                      onChange={setSelectedChildren}
                      labelledBy="Select Children"
                      className="custom-multiselect"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold text-secondary">Select Adults/Seniors</label>
                    <MultiSelect
                      options={adultList.map((adult) => ({
                        label: `👴 ${adult?.regid?.adultname || adult?.email}`,
                        value: adult._id,
                      }))}
                      value={selectedAdults}
                      onChange={setSelectedAdults}
                      labelledBy="Select Adults"
                      className="custom-multiselect"
                    />
                  </div>

                  <button
                    className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow-sm hover-scale"
                    onClick={handleAssign}
                    style={{ transition: 'transform 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    Confirm Assignment
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Assignment List Section */}
            <div className="col-lg-8">
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-white rounded-4 shadow-lg p-4 h-100"
              >
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                  <h4 className="fw-bold text-secondary mb-0">Active Assignments</h4>
                  <div className="input-group" style={{ maxWidth: '300px' }}>
                    <span className="input-group-text bg-light border-end-0"><FaSearch className="text-muted" /></span>
                    <input
                      type="text"
                      className="form-control border-start-0 bg-light"
                      placeholder="Search staff..."
                      value={filterStaff}
                      onChange={(e) => setFilterStaff(e.target.value)}
                    />
                  </div>
                </div>

                {filteredAssignments.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <FaExchangeAlt size={50} className="mb-3 opacity-25" />
                    <p>No assignments found. Assign a caregiver to get started.</p>
                  </div>
                ) : (
                  <div className="row g-3" style={{ maxHeight: '700px', overflowY: 'auto' }}>
                    {filteredAssignments.map((assign, index) => (
                      <div key={index} className="col-md-6">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="card border-0 shadow-sm h-100 assignment-card"
                          style={{ backgroundColor: '#f8f9fa' }}
                        >
                          <div className="card-body position-relative p-3">
                            <button
                              className="btn btn-sm btn-light text-danger position-absolute top-0 end-0 m-2 rounded-circle shadow-sm"
                              onClick={() => handleDelete(assign._id)}
                              title="Remove"
                              style={{ width: '32px', height: '32px', padding: 0 }}
                            >
                              <FaTrashAlt size={12} />
                            </button>

                            <div className="d-flex align-items-center mb-3">
                              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '45px', height: '45px' }}>
                                <FaUserNurse size={20} />
                              </div>
                              <div className="ms-3">
                                <h6 className="mb-0 fw-bold text-dark">{assign.staffId?.regid?.name || "Unknown Staff"}</h6>
                                <small className="text-muted">Caregiver</small>
                              </div>
                            </div>

                            <div className="ps-4 border-start border-3 border-secondary ms-3">
                              <div className="d-flex align-items-center mb-1">
                                {(() => {
                                  // Logic to determine what to show based on real regType
                                  const assignedEntity = assign.childId || assign.adultId;
                                  const regType = assignedEntity?.regType;
                                  const details = assignedEntity?.regid || {};

                                  let displayType = "Unknown";
                                  if (regType === 'child') displayType = "Child";
                                  else if (regType === 'adult') displayType = "Adult";
                                  else if (assign.childId) displayType = "Child"; // Fallback
                                  else if (assign.adultId) displayType = "Adult"; // Fallback

                                  // Overwrite if misassigned
                                  const isMisassigned = (assign.childId && regType === 'adult') || (assign.adultId && regType === 'child');

                                  return (
                                    <>
                                      <span className="text-secondary me-2">
                                        {displayType === "Child" ? <FaChild size={14} /> : <FaUserTie size={14} />}
                                      </span>
                                      <span className="fw-semibold" style={{ color: displayType === 'Child' ? '#0d6efd' : '#198754' }}>
                                        {details.childname || details.adultname || "Unknown"}
                                      </span>
                                      {isMisassigned && (
                                        <span className="badge bg-danger ms-2" style={{ fontSize: '0.65rem' }}>Misassigned</span>
                                      )}
                                    </>
                                  );
                                })()}
                              </div>
                              <small className="text-muted d-block ms-4">
                                Guardian: {assign.parentId?.parentname || "N/A"}
                              </small>
                            </div>

                            <div className="mt-3 text-end">
                              <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                Assigned: {new Date(assign.assignedAt).toLocaleDateString()}
                              </small>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
