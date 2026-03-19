import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ParentSide from "./ParentSide";
import ParentNav from "./ParentNav";
import { Link, useNavigate } from "react-router-dom";

// Reusable Input Component
const Input = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    readOnly = false,
    background,
}) => (
    <div style={{ marginBottom: "15px" }}>
        <label style={{ color: "#475569", fontWeight: "600", fontSize: "0.9rem", marginBottom: "5px", display: "block" }}>{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                backgroundColor: background || "#fff",
                fontSize: "1rem"
            }}
        />
    </div>
);

const btnEdit = {
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "8px 16px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "0.85rem"
};

const btnDelete = {
    backgroundColor: "#fef2f2",
    color: "#ef4444",
    border: "1px solid #fee2e2",
    borderRadius: "8px",
    padding: "8px 16px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "0.85rem"
};

export default function MyAdult() {
    const [auth, setAuth] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user"));
        } catch {
            return null;
        }
    });
    const parentId = auth?.regid;
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        parentId: parentId || "",
        childname: "",
        dob: "",
        age: "",
        category: "Adult",
        address: "",
        gender: "",
        phone: "",
        email: "",
        password: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [image, setImage] = useState(null);
    const [dependents, setDependents] = useState([]);

    const fileUpload = (e) => {
        const file = e.target.files[0];
        const data = new FormData();
        data.append("file", file);

        fetch("http://localhost:5000/util/fileUpload", {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((result) => {
                setImage(result);
            })
            .catch((err) => {
                console.error("Error uploading file:", err);
            });
    };

    const handleDelete = (delid) => {
        if (!window.confirm("Are you sure you want to delete this profile?")) return;
        fetch("http://localhost:5000/demo/adultDelete", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: delid }),
        })
            .then((res) => res.json())
            .then(() => {
                alert("Profile deleted successfully");
                fetchDependents();
            });
    };

    const calculateAge = (dob) => {
        if (!dob) return "";
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };
            if (name === "dob") {
                updated.age = calculateAge(value);
            }
            return updated;
        });
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const fetchDependents = () => {
        fetch("http://localhost:5000/demo/getAdultsByParentId", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ parentId }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setDependents(data);
            })
            .catch((err) => console.error("Error fetching dependents:", err));
    };

    useEffect(() => {
        if (parentId) fetchDependents();
    }, [parentId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = {};
        if (!formData.childname) errors.childname = "Name is required.";
        if (!formData.age) errors.age = "Age is required.";
        else if (parseInt(formData.age) < 18) errors.age = "Must be 18 or above.";
        if (!formData.address) errors.address = "Address is required.";
        if (!formData.gender) errors.gender = "Gender is required.";
        if (!formData.phone) errors.phone = "Phone number is required.";
        if (!formData.email) errors.email = "Email is required.";
        if (!formData.password) errors.password = "Password is required.";
        if (!image) errors.image = "Profile picture is required.";

        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        fetch("http://localhost:5000/demo/adultRegisterPage", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...formData, image, approval: 2, status: 4, parentId }),
        })
            .then((res) => res.json())
            .then(() => {
                alert("Adult Profile Added Successfully");
                fetchDependents();
                setFormData({
                    parentId: parentId || "",
                    childname: "", dob: "", age: "", category: "Adult", address: "", gender: "", phone: "", email: "", password: "",
                });
                setImage(null);
            });
    };

    return (
        <div className="container-fluid p-0" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', overflow: 'hidden' }}>
            <ParentSide />
            <div className="content" style={{ marginLeft: "260px", flex: 1, overflowY: "auto", display: 'flex', flexDirection: 'column' }}>
                <ParentNav />

                {/* Header Section */}
                <div style={{ padding: '1.5rem 2rem' }}>
                    <div style={{
                        background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
                        color: "white",
                        padding: '3rem 2rem',
                        borderRadius: '24px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        textAlign: 'left'
                    }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Adult Dependents 🧑</h1>
                        <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>Manage profiles and care information for the adults in your care.</p>
                    </div>
                </div>

                <div className="container-fluid px-4" style={{ maxWidth: '1400px', paddingBottom: '4rem' }}>
                    {/* HORIZONTAL GRID */}
                    <div className="row g-4 mt-2">
                        {dependents && dependents.map((adult) => (
                            <div className="col-12 col-md-6 col-xl-6" key={adult._id}>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    style={{
                                        backgroundColor: "#ffffff",
                                        borderRadius: "20px",
                                        padding: "24px",
                                        boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                                        border: "1px solid #f1f5f9",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "24px",
                                        borderLeft: "6px solid #16a34a"
                                    }}
                                >
                                    {adult.image ? (
                                        <img
                                            src={`http://localhost:5000/${adult.image}`}
                                            alt={adult.childname}
                                            style={{
                                                width: "110px",
                                                height: "110px",
                                                objectFit: "cover",
                                                borderRadius: "50%",
                                                border: "3px solid #16a34a",
                                                boxShadow: "0 4px 10px rgba(22, 163, 74, 0.2)"
                                            }}
                                        />
                                    ) : (
                                        <div style={{ width: "110px", height: "110px", borderRadius: "50%", backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', border: '3px solid #16a34a' }}>🧑</div>
                                    )}

                                    <div style={{ flex: 1 }}>
                                        <h2 style={{
                                            margin: "0 0 10px 0",
                                            color: "#16a34a",
                                            fontWeight: "700",
                                            fontSize: "1.6rem",
                                            borderBottom: "2px solid #16a34a",
                                            display: 'inline-block',
                                            paddingBottom: '2px'
                                        }}>
                                            {adult.childname}
                                        </h2>

                                        <div style={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr",
                                            gap: "8px 16px",
                                            marginTop: "12px",
                                            fontSize: "0.95rem",
                                            color: "#475569"
                                        }}>
                                            <span><strong>Age:</strong> {adult.age} yrs</span>
                                            <span><strong>Gender:</strong> {adult.gender}</span>
                                            <span className="col-span-2"><strong>Phone:</strong> {adult.phone}</span>
                                            <span className="col-span-2 text-truncate" style={{ maxWidth: '200px' }}><strong>Email:</strong> {adult.email}</span>
                                        </div>

                                        <div className="mt-3 d-flex gap-2">
                                            <Link to="/updateadult" state={{ id: adult._id }}>
                                                <button style={btnEdit}>Edit</button>
                                            </Link>
                                            <button onClick={() => handleDelete(adult._id)} style={btnDelete}>Delete</button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>

                    <div style={{
                        maxWidth: "800px",
                        margin: "4rem auto 0",
                        padding: "2.5rem",
                        background: "#fff",
                        borderRadius: "24px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                        border: "1px solid #f1f5f9"
                    }}>
                        <h2 style={{ textAlign: "center", color: "#1e293b", fontWeight: "800", marginBottom: "2rem" }}>Add New Adult Profile 👴</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-12">
                                    <Input label="Full Name" name="childname" value={formData.childname} onChange={handleChange} />
                                    {formErrors.childname && <small className="text-danger">{formErrors.childname}</small>}
                                </div>
                                <div className="col-md-6">
                                    <Input label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleChange} />
                                </div>
                                <div className="col-md-6">
                                    <Input label="Age" type="number" name="age" value={formData.age} readOnly={true} background="#f8fafc" />
                                </div>
                                <div className="col-12">
                                    <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
                                </div>
                                <div className="col-md-6">
                                    <label className="d-block mb-2 fw-semibold small text-muted">Gender</label>
                                    <div className="d-flex gap-3 mt-2">
                                        <label><input type="radio" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleChange} /> Male</label>
                                        <label><input type="radio" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleChange} /> Female</label>
                                    </div>
                                    {formErrors.gender && <small className="text-danger">{formErrors.gender}</small>}
                                </div>
                                <div className="col-md-6">
                                    <label className="d-block mb-2 fw-semibold small text-muted">Profile Picture</label>
                                    <input type="file" onChange={fileUpload} className="form-control" style={{ borderRadius: '10px' }} />
                                    {formErrors.image && <small className="text-danger">{formErrors.image}</small>}
                                </div>
                                <div className="col-md-6">
                                    <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
                                </div>
                                <div className="col-md-6">
                                    <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                                </div>
                                <div className="col-12">
                                    <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-success w-100 mt-4 py-3 shadow" style={{ borderRadius: '12px', fontWeight: '700', fontSize: '1.1rem' }}>Add Adult Profile</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
