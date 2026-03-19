import React, { useEffect, useState } from "react";
import AdminNav from "./AdminNav";
import Side from "./Side";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserTag, FaTrash, FaPlus, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const RoleTable = () => {
  const [role, setRole] = useState("");
  const [rolesList, setRolesList] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/demo/roleview")
      .then((res) => res.json())
      .then((result) => {
        setRolesList(result);
        console.log(result, "result")
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching roles:", err);
        setLoading(false);
      });
  }, [refresh]);

  const handleAddRole = async (e) => {
    e.preventDefault();
    try {
      const trimmedRole = role.trim();
      if (!trimmedRole) return alert("Role name cannot be empty.");

      // Check duplicate locally for immediate feedback
      if (rolesList.some(r => r.role.toLowerCase() === trimmedRole.toLowerCase())) {
        return alert("This role already exists!");
      }

      const response = await fetch("http://localhost:5000/demo/role", {
        method: 'POST',
        headers: {
          Accept: "application/json",
          'Content-Type': "application/json"
        },
        body: JSON.stringify({ role: trimmedRole })
      });

      const result = await response.json();

      if (response.ok) {
        setRefresh((prev) => prev + 1);
        setRole("");
        alert("✅ Role added successfully!");
      } else {
        alert("Failed to add role.");
      }
    } catch (error) {
      console.error("Error adding role:", error);
      alert("Network error.");
    }
  }

  const handleDeleteRole = async (id) => {
    if (!window.confirm("Are you sure you want to delete this role? It might affect assigned staff.")) return;
    try {
      // Assuming there is a delete endpoint, if not this is a placeholder
      // await fetch(`http://localhost:5000/demo/role/${id}`, { method: 'DELETE' });
      alert("Delete feature depends on backend implementation. (Endpoint not provided in context)");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container-xxl position-relative bg-light d-flex p-0" style={{ minHeight: '100vh' }}>
      <Side />
      <div className="content">
        <AdminNav />

        <div className="container-fluid pt-4 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="d-flex justify-content-between align-items-center mb-5"
          >
            <div>
              <h2 className="fw-bold text-dark">User Roles & Permissions</h2>
              <p className="text-muted">Manage the diverse roles within the care facility.</p>
            </div>
          </motion.div>

          <div className="row g-4">
            {/* Add Role Card */}
            <div className="col-md-5">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="card border-0 shadow-sm rounded-4 h-100"
              >
                <div className="card-header bg-primary text-white p-4 border-bottom-0 rounded-top-4">
                  <h5 className="mb-0 fw-bold"><FaPlus className="me-2" /> Create New Role</h5>
                </div>
                <div className="card-body p-4 d-flex flex-column justify-content-center">
                  <form onSubmit={handleAddRole}>
                    <div className="mb-4">
                      <label className="form-label text-muted fw-bold small text-uppercase">Role Title</label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-light border-0"><FaUserTag className="text-primary" /></span>
                        <input
                          type="text"
                          className="form-control bg-light border-0"
                          placeholder="e.g. Caregiver, Specialist..."
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-text mt-2">
                        Define clear roles to streamline staff responsibilities (Caregiver, Nurse, etc.)
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary w-100 btn-lg rounded-pill fw-bold shadow-sm"
                      disabled={!role.trim()}
                    >
                      Save Role
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>

            {/* Roles List */}
            <div className="col-md-7">
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="card border-0 shadow-lg rounded-4 h-100"
              >
                <div className="card-header bg-white p-4 border-bottom-0">
                  <h5 className="mb-0 fw-bold">📋 Active Roles</h5>
                </div>
                <div className="card-body p-0">
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status"></div>
                      <p className="mt-2 text-muted">Loading roles...</p>
                    </div>
                  ) : rolesList.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                      <FaExclamationCircle size={40} className="mb-3 opacity-25" />
                      <p>No roles defined yet.</p>
                    </div>
                  ) : (
                    <div className="list-group list-group-flush">
                      {rolesList.map((item, index) => (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="list-group-item p-4 border-bottom-0 border-top d-flex justify-content-between align-items-center bg-transparent hover-bg-light"
                        >
                          <div className="d-flex align-items-center">
                            <span className="badge bg-light text-secondary border rounded-pill me-3 px-3">
                              #{index + 1}
                            </span>
                            <h5 className="mb-0 fw-bold text-dark">{item.role}</h5>
                          </div>
                          <div className="text-success small fw-bold d-flex align-items-center">
                            <FaCheckCircle className="me-1" /> Active
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoleTable;
