import React, { useEffect, useState } from "react";
import axios from "axios";
import Side from "./Side";
import AdminNav from "./AdminNav";
import { FaPhoneAlt, FaUserShield } from "react-icons/fa";

export default function EmergencyContacts() {
    const [wards, setWards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [childRes, adultRes] = await Promise.all([
                    axios.get("http://localhost:5000/demo/childview"),
                    axios.get("http://localhost:5000/demo/adultview")
                ]);

                console.log("Child Data:", childRes.data);
                console.log("Adult Data:", adultRes.data);

                // Normalize data
                const children = childRes.data.map((item) => ({
                    _id: item._id,
                    type: "Child",
                    name: item.regid?.childname || "Unknown",
                    image: item.regid?.image,
                    guardian: item.regid?.parentId?.parentname || "Unknown",
                    phone: item.regid?.parentId?.phone || "N/A",
                }));

                const adults = adultRes.data.map((item) => ({
                    _id: item._id,
                    type: "Adult/Senior",
                    name: item.regid?.adultname || "Unknown",
                    image: item.regid?.image,
                    guardian: item.regid?.parentId?.parentname || "Unknown",
                    phone: item.regid?.parentId?.phone || "N/A",
                }));

                setWards([...children, ...adults]);
            } catch (error) {
                console.error("Error fetching contacts", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="container-xxl position-relative bg-white d-flex p-0">
            <Side />
            <div className="content">
                <AdminNav />
                <div className="container-fluid pt-4 px-4">
                    <div className="text-center mb-5 mt-4">
                        <h1 className="text-danger fw-bold display-5">
                            <span role="img" aria-label="siren">🚨</span> Emergency Contacts
                        </h1>
                        <p className="lead text-secondary">
                            Quick access to guardian contact information
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center mt-5">
                            <div className="spinner-border text-danger" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {wards.length > 0 ? (
                                wards.map((ward, index) => (
                                    <div className="col-sm-6 col-lg-4 col-xl-3" key={index}>
                                        <div
                                            className="card border-0 shadow-lg h-100 overflow-hidden"
                                            style={{
                                                borderRadius: "20px",
                                                transition: "transform 0.3s ease",
                                            }}
                                            onMouseEnter={(e) =>
                                                (e.currentTarget.style.transform = "translateY(-10px)")
                                            }
                                            onMouseLeave={(e) =>
                                                (e.currentTarget.style.transform = "translateY(0)")
                                            }
                                        >
                                            <div className="position-relative">
                                                <img
                                                    src={
                                                        ward.image
                                                            ? `http://localhost:5000/${ward.image}`
                                                            : "https://via.placeholder.com/300?text=No+Image"
                                                    }
                                                    className="card-img-top"
                                                    alt={ward.name}
                                                    style={{
                                                        height: "220px",
                                                        objectFit: "cover",
                                                        filter: "brightness(0.95)",
                                                    }}
                                                />
                                                <div className="position-absolute top-0 start-0 m-3">
                                                    <span
                                                        className={`badge ${ward.type === "Child" ? "bg-info" : "bg-warning text-dark"
                                                            } rounded-pill shadow-sm px-3 py-2`}
                                                    >
                                                        {ward.type}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="card-body text-center p-4">
                                                <h4 className="fw-bold mb-1 text-dark">{ward.name}</h4>

                                                <div className="d-flex align-items-center justify-content-center mb-4 mt-3 p-2 bg-light rounded-3 border">
                                                    <FaUserShield className="text-secondary me-2" size={18} />
                                                    <span className="fw-semibold text-secondary">
                                                        Guardian: {ward.guardian}
                                                    </span>
                                                </div>

                                                <a
                                                    href={`tel:${ward.phone}`}
                                                    className="btn btn-danger btn-lg w-100 rounded-pill d-flex align-items-center justify-content-center shadow-sm"
                                                    style={{
                                                        background: "linear-gradient(45deg, #ff357a, #fff172)",
                                                        border: "none",
                                                        color: "white",
                                                        fontWeight: "bold",
                                                        letterSpacing: "1px"
                                                    }}
                                                >
                                                    <FaPhoneAlt className="me-2" />
                                                    {ward.phone}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12 text-center">
                                    <p className="text-muted">No contacts found.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
