import React, { useEffect, useState } from "react";
import StaffSide from "./StaffSide";
import StaffNav from "./StaffNav";
import axios from "axios";
import { FaShieldVirus, FaCalendarPlus, FaHistory, FaCheckCircle, FaUserInjured, FaSearch, FaSyringe } from "react-icons/fa";

const Immunization = () => {
    const auth = JSON.parse(localStorage.getItem("user"));
    const staffId = auth?._id;

    const [assignments, setAssignments] = useState([]);
    const [records, setRecords] = useState([]);
    const [formData, setFormData] = useState({
        targetId: "",
        targetType: "child", // or adult
        vaccineName: "",
        dateAdministered: new Date().toISOString().split("T")[0],
        nextDueDate: "",
        notes: "",
        status: "due"
    });
    const [loading, setLoading] = useState(false);
    const [staffName, setStaffName] = useState(auth?.name || "Staff Member");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchAssignments = async () => {
        try {
            const res = await axios.post("http://localhost:5000/demo/getassignmentsbystaff", { staffId });
            setAssignments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAllRecords = async () => {
        try {
            const res = await axios.post("http://localhost:5000/demo/get-immunizations", {});
            setRecords(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchStaffProfile = async () => {
        if (!auth?.name && staffId) {
            try {
                const res = await axios.post("http://localhost:5000/demo/staffprofileview", { id: auth?._id });
                if (res.data?.name) {
                    setStaffName(res.data.name);
                    // Update localStorage so it's there next time
                    const updatedAuth = { ...auth, name: res.data.name };
                    localStorage.setItem("user", JSON.stringify(updatedAuth));
                }
            } catch (err) {
                console.error("Error fetching staff name:", err);
            }
        }
    };

    useEffect(() => {
        fetchAssignments();
        fetchAllRecords();
        fetchStaffProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "targetId") {
            const selected = assignments.find(a => (a.childId?.regid?._id || a.adultId?.regid?._id) === value);
            setFormData(prev => ({
                ...prev,
                targetId: value,
                targetType: selected?.childId ? "child" : "adult"
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                vaccineName: formData.vaccineName,
                dateAdministered: formData.dateAdministered,
                nextDueDate: formData.nextDueDate,
                notes: formData.notes,
                status: formData.status,
                administeredBy: staffName
            };

            if (formData.targetType === "child") payload.childId = formData.targetId;
            else payload.adultId = formData.targetId;

            await axios.post("http://localhost:5000/demo/add-immunization", payload);
            alert("Immunization record added successfully! 🛡️");
            setFormData({
                targetId: "",
                targetType: "child",
                vaccineName: "",
                dateAdministered: new Date().toISOString().split("T")[0],
                nextDueDate: "",
                notes: "",
                status: "due"
            });
            fetchAllRecords();
        } catch (err) {
            console.error(err);
            alert("Failed to add record.");
        } finally {
            setLoading(false);
        }
    };

    const filteredRecords = records.filter(r =>
        r.vaccineName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="d-flex min-vh-100 bg-light">
            <StaffSide />
            <div className="content w-100">
                <StaffNav />
                <div className="container-fluid pt-4 px-4">
                    <div className="row g-4">
                        {/* Add Record Form */}
                        <div className="col-lg-5">
                            <div className="bg-white rounded-4 shadow-sm p-4 border border-light">
                                <h5 className="mb-4 text-primary fw-bold">
                                    <FaSyringe className="me-2" /> Log New Immunization
                                </h5>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted">SELECT PERSON</label>
                                        <select
                                            className="form-select bg-light border-0"
                                            name="targetId"
                                            value={formData.targetId}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">-- Select Assigned Ward --</option>
                                            {assignments.map(a => (
                                                <option key={a._id} value={a.childId?.regid?._id || a.adultId?.regid?._id}>
                                                    {a.childId?.regid?.childname || a.adultId?.regid?.adultname || "Unknown"} ({a.childId ? "Child" : "Adult"})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted">VACCINE NAME</label>
                                        <input
                                            type="text"
                                            className="form-control bg-light border-0"
                                            name="vaccineName"
                                            placeholder="e.g. Flu, COVID-19, MMR"
                                            value={formData.vaccineName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col">
                                            <label className="form-label small fw-bold text-muted">DATE GIVEN</label>
                                            <input
                                                type="date"
                                                className="form-control bg-light border-0"
                                                name="dateAdministered"
                                                value={formData.dateAdministered}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col">
                                            <label className="form-label small fw-bold text-muted">NEXT DUE (OPTIONAL)</label>
                                            <input
                                                type="date"
                                                className="form-control bg-light border-0"
                                                name="nextDueDate"
                                                value={formData.nextDueDate}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label small fw-bold text-muted">NOTES</label>
                                        <textarea
                                            className="form-control bg-light border-0"
                                            name="notes"
                                            rows="3"
                                            value={formData.notes}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-2 rounded-pill fw-bold shadow-sm"
                                        disabled={loading}
                                    >
                                        {loading ? "Saving..." : <><FaCheckCircle className="me-2" /> Save Record</>}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Record History */}
                        <div className="col-lg-7">
                            <div className="bg-white rounded-4 shadow-sm p-4 border border-light h-100">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="mb-0 text-secondary fw-bold">
                                        <FaHistory className="me-2 text-warning" /> Shield History
                                    </h5>
                                    <div className="input-group" style={{ maxWidth: '250px' }}>
                                        <span className="input-group-text bg-light border-0"><FaSearch className="text-muted" /></span>
                                        <input
                                            type="text"
                                            className="form-control bg-light border-0 small"
                                            placeholder="Search vaccine..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="table-responsive" style={{ maxHeight: '500px' }}>
                                    <table className="table table-hover align-middle">
                                        <thead className="table-light text-secondary small text-uppercase">
                                            <tr>
                                                <th>WARD</th>
                                                <th>VACCINE</th>
                                                <th>DATE</th>
                                                <th>STATUS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredRecords.length > 0 ? (
                                                filteredRecords.map((r, idx) => (
                                                    <tr key={idx}>
                                                        <td className="fw-bold">
                                                            {r.childId?.childname || r.adultId?.adultname || "User"}
                                                            <small className="d-block text-muted">{r.childId ? "Child" : "Adult"}</small>
                                                        </td>
                                                        <td className="text-primary fw-bold">{r.vaccineName}</td>
                                                        <td className="small text-muted">{new Date(r.dateAdministered).toLocaleDateString()}</td>
                                                        <td>
                                                            <span className={`badge rounded-pill ${r.status === 'completed' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                                                                {r.status.toUpperCase()}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-5 text-muted opacity-50">No records found.</td>
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
};

export default Immunization;
