import React, { useEffect, useState } from "react";
import Side from "./Side";
import AdminNav from "./AdminNav";
import { Link } from "react-router-dom";

export default function Staff() {
  const [staffList, SetstaffList] = useState([]);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    fetch("http://localhost:5000/demo/staffview")
      .then((res) => res.json())
      .then((result) => {
        SetstaffList(result);
      });
  }, [refresh]);


  const handleDelete = (delid) => {
    fetch("http://localhost:5000/demo/staffDelete", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: delid }),
    })
      .then((res) => res.json())
      .then(() => setRefresh((prev) => prev + 1));
  };

  const handleApprove = (approveId) => {
    fetch("http://localhost:5000/demo/approved", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: approveId, approval: 2 }),
    })
      .then((res) => res.json())
      .then(() => setRefresh((prev) => prev + 1));
  };

  const handleReject = (rejectId) => {
    fetch("http://localhost:5000/demo/reject", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: rejectId, approval: 1 }),
    })
      .then((res) => res.json())
      .then(() => setRefresh((prev) => prev + 1));
  };

  return (
    <div className="container-xxl position-relative bg-white d-flex p-0">
      <Side />
      <div className="content">
        <AdminNav />
        <div
          style={{
            padding: "40px",
            fontFamily: "Arial, sans-serif",
            backgroundColor: "#f9fafb",
            minHeight: "100vh",
          }}
        >
          <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>
            👨‍👩‍👧 Existing Staff
          </h2>
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Phone</th>
                  <th style={thStyle}>Gender</th>
                  <th style={thStyle}>Role</th>
                  <th style={thStyle}>Preferred Shift</th>
                  <th style={thStyle}>Image</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffList.filter(staff => !staff.regid?.isAlternate).map((staff, index) => {
                  const reg = staff.regid;
                  if (!reg) return null;
                  return (
                    <tr key={`reg-${index}`}>
                      <td style={tdStyle}>{reg?.name}</td>
                      <td style={tdStyle}>{staff.email}</td>
                      <td style={tdStyle}>{reg?.phone}</td>
                      <td style={tdStyle}>{reg?.gender}</td>
                      <td style={tdStyle}>{reg?.role}</td>
                      <td style={tdStyle}>{reg?.shift}</td>
                      <td style={tdStyle}>
                        <img
                          src={`http://localhost:5000/${reg?.image}`}
                          alt="User"
                          style={{ width: "100px", marginTop: "10px" }}
                        />
                      </td>
                      <td style={tdStyle}>
                        {reg?.approval === 0 && (
                          <>
                            <button
                              onClick={() => handleApprove(reg._id)}
                              style={btnApprove}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(reg._id)}
                              style={btnReject}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {reg?.approval === 2 && (
                          <button disabled style={btnDisabled}>
                            Approved
                          </button>
                        )}
                        {reg?.approval === 1 && (
                          <button disabled style={btnDisabled}>
                            Rejected
                          </button>
                        )}
                        <>
                          <Link to="/updatestaff" state={{ id: reg._id }}>
                            <button style={btnEdit}>Edit</button>
                          </Link>
                          <button
                            onClick={() => handleDelete(reg._id)}
                            style={btnDelete}
                          >
                            Delete
                          </button>
                        </>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Alternate Staff Section */}
            <h3 style={{ fontSize: "20px", marginTop: "40px", marginBottom: "20px", color: '#d97706' }}>
              🔄 Substitute / Alternate Staff
            </h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Phone</th>
                  <th style={thStyle}>Gender</th>
                  <th style={thStyle}>Role</th>
                  <th style={thStyle}>Preferred Shift</th>
                  <th style={thStyle}>Image</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffList.filter(staff => staff.regid?.isAlternate).map((staff, index) => {
                  const reg = staff.regid;
                  if (!reg) return null;
                  return (
                    <tr key={`alt-${index}`}>
                      <td style={tdStyle}>{reg?.name}</td>
                      <td style={tdStyle}>{staff.email}</td>
                      <td style={tdStyle}>{reg?.phone}</td>
                      <td style={tdStyle}>{reg?.gender}</td>
                      <td style={tdStyle}>{reg?.role}</td>
                      <td style={tdStyle}>{reg?.shift}</td>
                      <td style={tdStyle}>
                        <img
                          src={`http://localhost:5000/${reg?.image}`}
                          alt="User"
                          style={{ width: "100px", marginTop: "10px" }}
                        />
                      </td>
                      <td style={tdStyle}>
                        {reg?.approval === 0 && (
                          <>
                            <button
                              onClick={() => handleApprove(reg._id)}
                              style={btnApprove}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(reg._id)}
                              style={btnReject}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {reg?.approval === 2 && (
                          <button disabled style={btnDisabled}>
                            Approved
                          </button>
                        )}
                        {reg?.approval === 1 && (
                          <button disabled style={btnDisabled}>
                            Rejected
                          </button>
                        )}
                        <>
                          <Link to="/updatestaff" state={{ id: reg._id }}>
                            <button style={btnEdit}>Edit</button>
                          </Link>
                          <button
                            onClick={() => handleDelete(reg._id)}
                            style={btnDelete}
                          >
                            Delete
                          </button>
                        </>
                      </td>
                    </tr>
                  );
                })}
                {staffList.filter(staff => staff.regid?.isAlternate).length === 0 && (
                  <tr>
                    <td colSpan="8" style={{ ...tdStyle, textAlign: 'center', color: '#666' }}>No substitute staff found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "12px",
  backgroundColor: "#f1f5f9",
  borderBottom: "1px solid #e2e8f0",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #e2e8f0",
};

const btnApprove = {
  backgroundColor: "#10b981",
  color: "white",
  border: "none",
  borderRadius: "5px",
  padding: "6px 12px",
  marginRight: "8px",
  cursor: "pointer",
};

const btnReject = {
  backgroundColor: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "5px",
  padding: "6px 12px",
  marginRight: "8px",
  cursor: "pointer",
};

const btnEdit = {
  backgroundColor: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "5px",
  padding: "6px 12px",
  marginRight: "8px",
  cursor: "pointer",
};

const btnDelete = {
  backgroundColor: "#f97316",
  color: "white",
  border: "none",
  borderRadius: "5px",
  padding: "6px 12px",
  cursor: "pointer",
};

const btnDisabled = {
  backgroundColor: "#9ca3af",
  color: "white",
  border: "none",
  borderRadius: "5px",
  padding: "6px 12px",
  cursor: "not-allowed",
};
