import React, { useEffect, useState } from "react";
import StaffSide from "./StaffSide";
import StaffNav from "./StaffNav";
import axios from "axios";
import { FaCalendarAlt, FaHistory, FaCheckCircle, FaUserCheck, FaUserTimes, FaClock, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

export default function Attendance() {
  const auth = JSON.parse(localStorage.getItem("user"));
  const staffId = auth?._id;

  const [assignments, setAssignments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [status, setStatus] = useState({});
  const [submittedData, setSubmittedData] = useState([]); // Store submitted attendance data
  const [refresh, setRefresh] = useState(0);

  // Fetch Assigned Students
  const fetchAssignedStudents = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/demo/getassignmentsbystaff",
        { staffId }
      );
      setAssignments(response.data);
    } catch (error) {
      console.error("Error fetching assigned students:", error);
      alert("Failed to fetch assigned students.");
    }
  };

  // Fetch Submitted Attendance
  const fetchSubmittedAttendance = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/demo/getattendancebystaff",
        { staffId: auth?.regid } // Fetch using Profile ID (regid) match
      );
      setSubmittedData(response.data);
    } catch (error) {
      console.error("Error fetching submitted attendance:", error);
    }
  };

  useEffect(() => {
    fetchAssignedStudents();
    fetchSubmittedAttendance();
  }, [staffId, refresh]);

  // Handle Radio Button Change
  const handleStatusChange = (index, statusValue) => {
    setStatus((prev) => ({
      ...prev,
      [index]: statusValue,
    }));
  };

  const handleSubmit = async () => {
    try {
      const responseEdit = await fetch("http://localhost:5000/demo/staffedit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: auth.regid }),
      });
      const dataEdit = await responseEdit.json();
      let staffName = dataEdit?.edit?.name;

      const formattedData = assignments.map((item, index) => ({
        childId: item.childId?._id, // Only set if it's a child
        adultId: item.adultId?._id, // Only set if it's an adult
        childName:
          item.childId?.regid?.childname ||
          item.childId?.regid?.name ||
          item.adultId?.regid?.adultname ||
          item.adultId?.regid?.name ||
          item.childId?.childname ||
          item.childId?.name ||
          item.adultId?.adultname ||
          item.adultId?.name ||
          item.parentId?.childname ||
          "Unknown",
        parentName: item.parentId?.parentname,
        staffId: auth?.regid,
        staffName: staffName,
        date: selectedDate,
        status: status[index] || "Present",
      }));

      const response = await fetch("http://localhost:5000/demo/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        alert("Attendance submitted successfully!");
        setRefresh((prev) => prev + 1); // Refresh data
        setStatus({});
        fetchSubmittedAttendance(); // Re-fetch immediately
      } else {
        alert("Failed to submit attendance.");
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
      alert("Error submitting attendance.");
    }
  };

  // Filter submitted data based on selected date (for logic checks only)
  const todaysAttendance = submittedData.filter(
    (item) => new Date(item.date).toISOString().split("T")[0] === selectedDate
  );

  return (
    <div className="d-flex min-vh-100 bg-light">
      <StaffSide />
      <div className="content w-100">
        <StaffNav />
        <div className="container-fluid pt-4 px-4">
          <div className="row g-4 d-flex align-items-stretch">
            {/* Left Column: Attendance Form - Only show if NO records for this date OR if date is not today */}
            {(todaysAttendance.length === 0 || selectedDate !== new Date().toISOString().split("T")[0]) && (
              <div className="col-sm-12 col-xl-7">
                <div className="bg-white rounded-4 shadow-sm h-100 p-4 border border-light">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0 text-primary fw-bold">
                      <FaUserCheck className="me-2" /> Mark Attendance
                    </h5>
                    <div className="input-group" style={{ maxWidth: '250px' }}>
                      <span className="input-group-text bg-light border-0"><FaCalendarAlt className="text-muted" /></span>
                      <input
                        type="date"
                        className="form-control bg-light border-0 fw-bold text-secondary"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="bg-light text-secondary small text-uppercase">
                        <tr>
                          <th scope="col" className="border-0 ps-3 rounded-start">#</th>
                          <th scope="col" className="border-0">Assigned Ward</th>
                          <th scope="col" className="border-0">Guardian</th>
                          <th scope="col" className="border-0 rounded-end text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignments.length > 0 ? (
                          assignments.map((item, index) => (
                            <tr key={item._id} className="border-bottom-0">
                              <th scope="row" className="ps-3 text-muted">{index + 1}</th>
                              <td className="fw-semibold text-dark">
                                {item.childId?.regid?.childname ||
                                  item.childId?.regid?.name ||
                                  item.adultId?.regid?.adultname ||
                                  item.adultId?.regid?.name ||
                                  item.childId?.childname ||
                                  item.childId?.name ||
                                  item.adultId?.adultname ||
                                  item.adultId?.name ||
                                  item.parentId?.childname ||
                                  "Unknown"}
                                {item.adultId && <span className="badge bg-secondary ms-2" style={{ fontSize: '0.65rem' }}>Adult</span>}
                              </td>
                              <td className="text-secondary small">
                                {item.parentId?.parentname || "Unknown"}
                              </td>
                              <td className="text-center">
                                <div className="btn-group btn-group-sm" role="group">
                                  <input
                                    type="radio"
                                    className="btn-check"
                                    name={`status-${index}`}
                                    id={`present-${index}`}
                                    autoComplete="off"
                                    checked={status[index] === "✅ Present"}
                                    onChange={() => handleStatusChange(index, "✅ Present")}
                                  />
                                  <label className="btn btn-outline-success rounded-start-pill px-3" htmlFor={`present-${index}`}>Present</label>

                                  <input
                                    type="radio"
                                    className="btn-check"
                                    name={`status-${index}`}
                                    id={`absent-${index}`}
                                    autoComplete="off"
                                    checked={status[index] === "❌ Absent"}
                                    onChange={() => handleStatusChange(index, "❌ Absent")}
                                  />
                                  <label className="btn btn-outline-danger" htmlFor={`absent-${index}`}>Absent</label>

                                  <input
                                    type="radio"
                                    className="btn-check"
                                    name={`status-${index}`}
                                    id={`checkin-${index}`}
                                    autoComplete="off"
                                    checked={status[index] === "🔓 Check-in"}
                                    onChange={() => handleStatusChange(index, "🔓 Check-in")}
                                  />
                                  <label className="btn btn-outline-info" htmlFor={`checkin-${index}`}>In</label>

                                  <input
                                    type="radio"
                                    className="btn-check"
                                    name={`status-${index}`}
                                    id={`checkout-${index}`}
                                    autoComplete="off"
                                    checked={status[index] === "🔒 Check-out"}
                                    onChange={() => handleStatusChange(index, "🔒 Check-out")}
                                  />
                                  <label className="btn btn-outline-secondary rounded-end-pill" htmlFor={`checkout-${index}`}>Out</label>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center text-muted py-5">
                              No students assigned.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <button
                    className="btn btn-primary w-100 mt-4 py-2 rounded-pill fw-bold shadow-sm"
                    onClick={handleSubmit}
                    disabled={assignments.length === 0}
                  >
                    <FaCheckCircle className="me-2" /> Submit Attendance
                  </button>
                </div>
              </div>
            )}

            {/* Right Column: Submitted Data Display - Full width if form hidden */}
            <div className={`col-sm-12 ${(todaysAttendance.length === 0 || selectedDate !== new Date().toISOString().split("T")[0]) ? 'col-xl-5' : 'col-xl-12'}`}>
              <div className="bg-white rounded-4 shadow-sm h-100 p-4 border border-light">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0 text-secondary fw-bold d-flex align-items-center">
                    <FaHistory className="me-2 text-warning" /> Full History
                  </h5>
                  {/* Show date picker here if form is hidden */}
                  {(todaysAttendance.length > 0 && selectedDate === new Date().toISOString().split("T")[0]) && (
                    <div className="input-group" style={{ maxWidth: '250px' }}>
                      <span className="input-group-text bg-light border-0"><FaCalendarAlt className="text-muted" /></span>
                      <input
                        type="date"
                        className="form-control bg-light border-0 fw-bold text-secondary"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div className="table-responsive" style={{ maxHeight: '600px' }}>
                  <table className="table table-hover align-middle">
                    <thead className="table-light text-secondary small text-uppercase">
                      <tr>
                        <th scope="col" className="ps-3 border-0 rounded-start">#</th>
                        <th scope="col" className="border-0">Name</th>
                        <th scope="col" className="border-0">Date</th>
                        <th scope="col" className="border-0 rounded-end text-end pe-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submittedData.length > 0 ? (
                        submittedData.map((data, index) => (
                          <tr key={data._id}>
                            <th scope="row" className="ps-3 text-muted">{index + 1}</th>
                            <td className="fw-semibold">{data.childName}</td>
                            <td className="text-muted small">{new Date(data.date).toLocaleDateString()}</td>
                            <td className="text-end pe-3">
                              <span className={`badge rounded-pill px-3 py-2 ${data.status.includes("Present") ? "bg-success-subtle text-success" :
                                data.status.includes("Absent") ? "bg-danger-subtle text-danger" :
                                  data.status.includes("Late") ? "bg-warning-subtle text-warning" :
                                    "bg-info-subtle text-info"
                                }`}>
                                {data.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center text-muted py-5 opacity-50">
                            <FaClock className="mb-2" size={24} />
                            <br />
                            No history available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
