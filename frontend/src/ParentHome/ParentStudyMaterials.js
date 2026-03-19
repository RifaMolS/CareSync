import React, { useEffect, useState } from "react";
import ParentSide from "./ParentSide";
import ParentNav from "./ParentNav";
import { FaBookOpen, FaDownload } from "react-icons/fa";

export default function ParentStudyMaterials() {
    const [materials, setMaterials] = useState([]);
    const auth = JSON.parse(localStorage.getItem("user"));
    const parentId = auth?.regid;

    useEffect(() => {
        if (parentId) {
            fetch("http://localhost:5000/demo/getmaterialbyparentid", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ parentId }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.material) setMaterials(data.material);
                })
                .catch((err) => console.error(err));
        }
    }, [parentId]);

    const handleDownload = async (pdfPath) => {
        try {
            const url = `http://localhost:5000/${encodeURI(pdfPath)}`;
            window.open(url, "_blank");
        } catch (err) {
            console.error("Download failed:", err);
            window.alert("❌ Download failed.");
        }
    };

    const styles = {
        container: {
            backgroundColor: "#f3f4f6",
            minHeight: "100vh",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        },
        header: {
            background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
            color: "white",
            padding: "3rem 1.5rem",
            borderRadius: "0 0 2rem 2rem",
            marginBottom: "2rem",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
        },
        title: {
            fontSize: "2.5rem",
            fontWeight: "800",
            marginBottom: "0.5rem",
        },
        card: {
            background: "white",
            borderRadius: "1rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            height: "100%",
            transition: "transform 0.2s",
            border: "1px solid #f3f4f6",
        },
        cardImg: {
            width: "100%",
            height: "180px",
            objectFit: "cover",
            borderBottom: "1px solid #f3f4f6",
        },
        cardBody: {
            padding: "1.5rem",
        },
        button: {
            background: "#ecfeff",
            color: "#06b6d4",
            border: "1px solid #cffafe",
            width: "100%",
            padding: "0.5rem",
            borderRadius: "0.5rem",
            fontWeight: "600",
            marginTop: "1rem"
        }
    };

    return (
        <div className="container-fluid p-0" style={{ ...styles.container, overflow: 'hidden' }}>
            <ParentSide />
            <div className="content" style={{
                marginLeft: "260px",
                flex: 1,
                overflowY: "auto",
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#f8fafc'
            }}>
                <ParentNav />

                {/* Header Section */}
                <div style={{ padding: '1.5rem 2rem' }}>
                    <div style={{
                        ...styles.header,
                        margin: 0,
                        padding: '3rem 2rem',
                        borderRadius: '24px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        textAlign: 'left'
                    }}>
                        <h1 style={{ ...styles.title, fontSize: '2.5rem' }}>Study Materials 📚</h1>
                        <p style={{ opacity: 0.9 }}>Access learning resources tailored for your needs.</p>
                    </div>
                </div>

                <div className="container-fluid px-4" style={{ maxWidth: '1400px', marginBottom: '3rem' }}>
                    {materials.length > 0 ? (
                        <div className="row g-4">
                            {materials.map((mat) => (
                                <div className="col-md-6 col-lg-4" key={mat._id}>
                                    <div
                                        style={styles.card}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = "translateY(-5px)";
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = "translateY(0)";
                                        }}
                                    >
                                        <img src={`http://localhost:5000/${mat.image}`} alt={mat.title} style={styles.cardImg} onError={(e) => e.target.style.display = 'none'} />
                                        <div style={styles.cardBody}>
                                            <h5 className="fw-bold text-dark">{mat.title}</h5>
                                            <p className="text-secondary mb-2 small"><span className="fw-bold">Subject:</span> {mat.subject}</p>
                                            <span className="badge bg-secondary-subtle text-dark border mb-3">
                                                {mat.group === 'children' ? '👶 Children' : '👴 Adult'}
                                            </span>

                                            <button
                                                style={styles.button}
                                                onClick={() => handleDownload(mat.pdf)}
                                            >
                                                <FaDownload className="me-2" /> Download/View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <div className="bg-white p-5 rounded-circle d-inline-block shadow-sm mb-3">
                                <FaBookOpen size={40} className="text-muted" />
                            </div>
                            <h3 className="text-secondary">No study materials found.</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
