import React, { useState, useEffect } from "react";
import axios from "axios";
import Side from "./Side";
import AdminNav from "./AdminNav";
import { motion } from "framer-motion";
import { FaClipboardList, FaCheckCircle, FaExclamationTriangle, FaSearch, FaFilter } from "react-icons/fa";

export default function Compliance() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Ratio Data
  const [ratios, setRatios] = useState({
    childStaff: 0,
    adultStaff: 0,
    totalStaff: 0,
    violation: false
  });

  // Fetch all compliance data + stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compRes, staffRes, childRes, adultRes] = await Promise.all([
          axios.get("http://localhost:5000/demo/getCompliance"),
          axios.get("http://localhost:5000/demo/staffview"),
          axios.get("http://localhost:5000/demo/childview"),
          axios.get("http://localhost:5000/demo/adultview")
        ]);

        setRequests(compRes.data.data || []);

        const staffCount = staffRes.data.length || 1; // avoid divide by zero
        const childCount = childRes.data.length;
        const adultCount = adultRes.data.length;

        setRatios({
          childStaff: (childCount / staffCount).toFixed(1),
          adultStaff: (adultCount / staffCount).toFixed(1),
          totalStaff: staffCount,
          violation: (childCount / staffCount) > 10 // Example rule: Max 10 children per staff
        });

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateStatus = (id, newStatus) => {
    axios
      .post("http://localhost:5000/demo/updateComplianceStatus", {
        id,
        status: newStatus,
      })
      .then((r) => {
        if (r.data.success) {
          setRequests((prev) =>
            prev.map((req) =>
              req._id === id ? { ...req, status: newStatus } : req
            )
          );
        }
      })
      .catch((err) => {
        console.error("Status update failed", err);
        alert("Failed to update status");
      });
  };

  const handleApprove = (id) => updateStatus(id, 2);
  const handleInProgress = (id) => updateStatus(id, 1);
  const handleReject = (id) => updateStatus(id, 3);

  const filtered = requests
    .filter((r) =>
      filterStatus === "" ? true : String(r.status) === filterStatus
    )
    .filter(
      (r) =>
        r.parentId?.parentname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const statusBadge = {
    0: { text: "Pending", class: "bg-warning text-dark", icon: <FaExclamationTriangle className="me-1" /> },
    1: { text: "In Progress", class: "bg-info text-white", icon: <FaClipboardList className="me-1" /> },
    2: { text: "Resolved", class: "bg-success text-white", icon: <FaCheckCircle className="me-1" /> },
    3: { text: "Rejected", class: "bg-danger text-white", icon: <FaExclamationTriangle className="me-1" /> },
  };

  return (
    <div className="container-xxl position-relative bg-light d-flex p-0" style={{ minHeight: '100vh' }}>
      <Side />
      <div className="content">
        <AdminNav />

        <section className="mt-4 container-fluid px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-5"
          >
            <h3 className="fw-bold text-dark">🛡️ Regulatory Compliance</h3>
            <p className="text-muted">Monitor staffing ratios and manage guardian complaints</p>
          </motion.div>

          {/* Safety & Ratio Checks */}
          <div className="row mb-5 g-4">
            <div className="col-md-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`card text-white ${ratios.violation ? 'bg-danger' : 'bg-success'} shadow-lg border-0 h-100`}
              >
                <div className="card-body p-4 text-center">
                  <div className="mb-3 display-4">👶</div>
                  <h5 className="card-title text-white fw-bold">Staff-to-Child Ratio</h5>
                  <h2 className="display-6 fw-bold">1 : {ratios.childStaff}</h2>
                  <p className="card-text opacity-75 mt-2"><small>Target: 1 Staff per 10 Children</small></p>
                  {ratios.violation && <div className="badge bg-warning text-dark mt-2 animate__animated animate__pulse animate__infinite">ACTION REQUIRED</div>}
                </div>
              </motion.div>
            </div>
            <div className="col-md-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="card bg-info text-white shadow-lg border-0 h-100"
              >
                <div className="card-body p-4 text-center">
                  <div className="mb-3 display-4">👵</div>
                  <h5 className="card-title text-white fw-bold">Staff-to-Adult Ratio</h5>
                  <h2 className="display-6 fw-bold">1 : {ratios.adultStaff}</h2>
                  <p className="card-text opacity-75 mt-2"><small>Flexible Care Standards</small></p>
                </div>
              </motion.div>
            </div>
            <div className="col-md-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="card bg-dark text-white shadow-lg border-0 h-100"
              >
                <div className="card-body p-4 text-center">
                  <div className="mb-3 display-4">✅</div>
                  <h5 className="card-title text-white fw-bold">Safety Inspection</h5>
                  <h2 className="display-6 fw-bold text-success">Passed</h2>
                  <button className="btn btn-outline-light btn-sm mt-3 px-4 rounded-pill" onClick={() => alert("Last Inspection: Today\nFire Extinguishers: OK\nExits: Clear")}>
                    View Audit Log
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-header bg-white p-4 border-bottom-0">
              <h4 className="fw-bold mb-0">📣 Complaint Tracker</h4>
            </div>
            <div className="card-body p-4 pt-0">
              {/* Filters */}
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><FaFilter className="text-secondary" /></span>
                    <select
                      className="form-select border-start-0 bg-light"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="">Filter by Status</option>
                      <option value="0">Pending</option>
                      <option value="1">In Progress</option>
                      <option value="2">Resolved</option>
                      <option value="3">Rejected</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><FaSearch className="text-secondary" /></span>
                    <input
                      type="text"
                      className="form-control border-start-0 bg-light"
                      placeholder="Search by guardian name or message content..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table align-middle table-hover">
                  <thead className="bg-light text-secondary small text-uppercase">
                    <tr>
                      <th className="border-0 p-3">Guardian Name</th>
                      <th className="border-0 p-3">Date Submitted</th>
                      <th className="border-0 p-3" style={{ width: '40%' }}>Issue Description</th>
                      <th className="border-0 p-3">Current Status</th>
                      <th className="border-0 p-3 text-end">Management</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="5" className="text-center py-5">Loading compliance data...</td></tr>
                    ) : filtered.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-5 text-muted">No records found matching criteria.</td></tr>
                    ) : (
                      filtered.map((req) => (
                        <motion.tr
                          key={req._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-bottom"
                        >
                          <td className="p-3 fw-bold text-dark">{req.parentId?.parentname || "Unknown"}</td>
                          <td className="p-3 text-muted">{new Date(req.date).toLocaleDateString()}</td>
                          <td className="p-3 text-secondary">{req.message}</td>
                          <td className="p-3">
                            <span className={`badge rounded-pill px-3 py-2 ${statusBadge[req.status]?.class || "bg-secondary"}`}>
                              {statusBadge[req.status]?.icon} {statusBadge[req.status]?.text || "Unknown"}
                            </span>
                          </td>
                          <td className="p-3 text-end">
                            <div className="btn-group shadow-sm">
                              <button onClick={() => handleInProgress(req._id)} className="btn btn-light btn-sm" title="In Progress">⏳</button>
                              <button onClick={() => handleApprove(req._id)} className="btn btn-light btn-sm text-success" title="Resolve">✅</button>
                              <button onClick={() => handleReject(req._id)} className="btn btn-light btn-sm text-danger" title="Reject">❌</button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </section>
      </div>
    </div>
  );
}
