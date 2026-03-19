import React, { useEffect, useState } from "react";
import ParentSide from "./ParentSide";
import ParentNav from "./ParentNav";
import { FaSyringe, FaCalendarAlt, FaUserMd, FaNotesMedical, FaRegClock } from "react-icons/fa";
import moment from "moment";

export default function ParentImmunization() {
    const [records, setRecords] = useState([]);
    const auth = JSON.parse(localStorage.getItem("user"));
    const parentId = auth?.regid;

    const fetchRecords = () => {
        if (parentId) {
            fetch("http://localhost:5000/demo/get-immunizations-by-parent-id", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ parentId }),
            })
                .then((res) => res.json())
                .then((data) => setRecords(data))
                .catch((err) => console.error(err));
        }
    };

    useEffect(() => {
        fetchRecords();
    }, [parentId]);

    const handleComplete = (id) => {
        fetch("http://localhost:5000/demo/update-immunization-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status: "completed" }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    alert("Status updated to Completed! ✅");
                    fetchRecords(); // Refresh
                }
            })
            .catch((err) => console.error(err));
    };

    const styles = {
        container: {
            backgroundColor: "#f0f2f5",
            minHeight: "100vh",
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        },
        header: {
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            color: "white",
            padding: "3rem 2rem",
            borderRadius: "1.5rem",
            marginBottom: "2.5rem",
            boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.2)",
        },
        card: {
            background: "white",
            borderRadius: "1.25rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
            overflow: "hidden",
            border: "none",
            transition: "all 0.3s ease",
            height: "100%",
        },
        badge: {
            padding: "0.5rem 1rem",
            borderRadius: "9999px",
            fontSize: "0.75rem",
            fontWeight: "600",
            textTransform: "uppercase",
        },
        completed: { backgroundColor: "#dcfce7", color: "#166534" },
        pending: { backgroundColor: "#fef9c3", color: "#854d0e" },
        due: { backgroundColor: "#fee2e2", color: "#991b1b" },
    };

    return (
        <div className="container-fluid p-0" style={styles.container}>
            <ParentSide />
            <div className="content" style={{ marginLeft: "260px", padding: "1.5rem 2rem" }}>
                <ParentNav />

                <div style={styles.header}>
                    <h1 className="display-5 fw-bold mb-2">Immunization Registry 💉</h1>
                    <p className="lead opacity-90 mb-0">Track vaccinations and upcoming boosters for your loved ones.</p>
                </div>

                {records.length > 0 ? (
                    <div className="row g-4">
                        {records.map((record) => (
                            <div className="col-md-6 col-xl-4" key={record._id}>
                                <div style={styles.card} className="p-4 shadow-hover">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="bg-indigo-50 p-3 rounded-3 text-indigo-600">
                                            <FaSyringe size={24} />
                                        </div>
                                        <span style={{
                                            ...styles.badge,
                                            ...(record.status === 'completed' ? styles.completed : record.status === 'pending' ? styles.pending : styles.due)
                                        }}>
                                            {record.status}
                                        </span>
                                    </div>

                                    <h4 className="fw-bold text-gray-900 mb-1">{record.vaccineName}</h4>
                                    <div className="d-flex align-items-center mb-4">
                                        <span className="badge bg-indigo-100 text-indigo-700 rounded-pill px-3">
                                            {record.childId?.childname || record.adultId?.adultname || "Member"}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="d-flex align-items-start gap-3 mb-2">
                                            <FaCalendarAlt className="mt-1 text-gray-400" />
                                            <div>
                                                <small className="text-gray-500 d-block uppercase tracking-wider font-semibold" style={{ fontSize: '0.65rem' }}>Administered Date</small>
                                                <span className="text-gray-700 fw-medium">{moment(record.dateAdministered).format('MMMM DD, YYYY')}</span>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-start gap-3 mb-2">
                                            <FaRegClock className="mt-1 text-gray-400" />
                                            <div>
                                                <small className="text-gray-500 d-block uppercase tracking-wider font-semibold" style={{ fontSize: '0.65rem' }}>Next Booster / Due Date</small>
                                                <span className={`fw-bold ${moment(record.nextDueDate).isBefore(moment()) ? 'text-danger' : 'text-indigo-600'}`}>
                                                    {record.nextDueDate ? moment(record.nextDueDate).format('MMMM DD, YYYY') : "N/A"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-start gap-3 mb-2">
                                            <FaUserMd className="mt-1 text-gray-400" />
                                            <div>
                                                <small className="text-gray-500 d-block uppercase tracking-wider font-semibold" style={{ fontSize: '0.65rem' }}>Authorized Clinician</small>
                                                <span className="text-gray-700">{record.administeredBy || "Not Recorded"}</span>
                                            </div>
                                        </div>

                                        {record.notes && (
                                            <div className="d-flex align-items-start gap-3 mt-3 pt-3 border-top">
                                                <FaNotesMedical className="mt-1 text-gray-400" />
                                                <div>
                                                    <small className="text-gray-500 d-block uppercase tracking-wider font-semibold" style={{ fontSize: '0.65rem' }}>Clinical Notes</small>
                                                    <p className="text-gray-600 small mb-0">{record.notes}</p>
                                                </div>
                                            </div>
                                        )}

                                        {record.status !== 'completed' && (
                                            <div className="mt-4 pt-3 border-top">
                                                <button
                                                    onClick={() => handleComplete(record._id)}
                                                    className="btn btn-success w-100 rounded-pill fw-bold shadow-sm py-2"
                                                    style={{ transition: 'all 0.3s ease' }}
                                                >
                                                    Mark as Completed ✅
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-5 bg-white rounded-4 shadow-sm">
                        <div className="mb-4">
                            <div className="bg-gray-100 d-inline-flex p-4 rounded-circle">
                                <FaSyringe size={48} className="text-gray-300" />
                            </div>
                        </div>
                        <h3 className="fw-bold text-gray-700">No immunization records found</h3>
                        <p className="text-gray-500">When staff add vaccination records, they will appear here.</p>
                    </div>
                )}
            </div>
            <style>
                {`
                .text-indigo-600 { color: #4f46e5; }
                .text-indigo-700 { color: #4338ca; }
                .bg-indigo-50 { background-color: #eef2ff; }
                .bg-indigo-100 { background-color: #e0e7ff; }
                .text-gray-400 { color: #9ca3af; }
                .text-gray-500 { color: #6b7280; }
                .text-gray-600 { color: #4b5563; }
                .text-gray-700 { color: #374151; }
                .text-gray-900 { color: #111827; }
                .shadow-hover:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
                }
                `}
            </style>
        </div >
    );
}
