import React, { useEffect, useState } from "react";
import Side from "./Side";
import AdminNav from "./AdminNav";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBed, FaBath, FaEdit, FaTrash, FaLayerGroup, FaDoorOpen } from "react-icons/fa";

export default function RoomView() {
  const [roomData, SetroomData] = useState([]);
  const [refresh, setRefresh] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/demo/roomview")
      .then((res) => res.json())
      .then((result) => {
        SetroomData(result);
      })
      .catch((err) => {
        console.error("Error fetching rooms:", err);
      });
  }, [refresh]);

  const handleDelete = async (delid) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      await fetch("http://localhost:5000/demo/roomdelete", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: delid }),
      });
      SetroomData((prev) => prev.filter((room) => room._id !== delid));
    } catch (err) {
      console.error("Error deleting room:", err);
      alert("Failed to delete room.");
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
              <h2 className="fw-bold text-dark">Managed Spaces</h2>
              <p className="text-muted">Overview of all registered care rooms and facilities</p>
            </div>
            <Link to="/manageoperations" className="btn btn-primary btn-lg rounded-pill shadow-sm px-4 fw-bold">
              + Add New Room
            </Link>
          </motion.div>

          {roomData.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3 text-muted display-1">🛏️</div>
              <h4>No rooms found</h4>
              <p className="text-muted">Get started by creating a new room assignment.</p>
            </div>
          ) : (
            <div className="row g-4">
              {roomData.map((item, index) => (
                <div key={item._id} className="col-md-6 col-lg-4 col-xl-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="card border-0 shadow-lg h-100 overflow-hidden"
                    style={{ borderRadius: '20px' }}
                  >
                    <div className="card-header bg-white border-bottom-0 p-4 pb-0 d-flex justify-content-between align-items-start">
                      <div>
                        <span className="badge bg-light text-primary mb-2 rounded-pill px-3 py-2 border">
                          <FaLayerGroup className="me-2" /> Floor {item.floor}
                        </span>
                        <h4 className="fw-bold mb-0 text-dark">{item.roomname}</h4>
                        <small className="text-muted">Room No: {item.room}</small>
                      </div>
                      <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center shadow-lg"
                        style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>
                        ${item.price}
                      </div>
                    </div>

                    <div className="card-body p-4">
                      <div className="row g-3 mb-4">
                        <div className="col-6">
                          <div className="p-3 bg-light rounded-3 text-center h-100">
                            <FaBed className="text-secondary mb-2" size={20} />
                            <div className="fw-semibold small">{item.bed}</div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="p-3 bg-light rounded-3 text-center h-100">
                            <FaBath className="text-secondary mb-2" size={20} />
                            <div className="fw-semibold small">{item.washroom}</div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="text-muted small fw-bold text-uppercase">Facilities</label>
                        <div className="d-flex flex-wrap gap-2 mt-1">
                          {item.services.split(',').map((u, i) => (
                            <span key={i} className="badge bg-light text-dark border">
                              {u.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="d-flex align-items-center py-3 border-top border-bottom mt-3">
                        <div className="rounded-circle bg-warning text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                          <FaDoorOpen />
                        </div>
                        <div className="ms-3">
                          <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Assigned Staff</small>
                          <span className="fw-semibold">{item.roomassign?.name || "Unassigned"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="card-footer bg-white p-3 border-top-0 d-flex justify-content-between">
                      <Link
                        to="/roomupdate"
                        state={{ id: item._id }}
                        className="btn btn-outline-primary btn-sm rounded-pill px-4"
                      >
                        <FaEdit className="me-2" /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="btn btn-outline-danger btn-sm rounded-pill px-4"
                      >
                        <FaTrash className="me-2" /> Delete
                      </button>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
