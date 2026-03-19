import React from "react";
import ParentSide from "./ParentSide";
import ParentNav from "./ParentNav";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

const styles = {
  container: {
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)", // Green to Blue gradient for Parents/Students
    color: "white",
    padding: "3rem 1.5rem",
    borderRadius: "0 0 2rem 2rem",
    marginBottom: "2rem",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "800",
    marginBottom: "0.5rem",
    letterSpacing: "-0.025em",
  },
  subtitle: {
    opacity: 0.9,
    fontSize: "1.1rem",
  },
  sectionTitle: {
    fontSize: "1.75rem",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "2rem",
    marginBottom: "3rem",
  },
  card: {
    background: "white",
    borderRadius: "1rem",
    overflow: "hidden",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    transition: "transform 0.2s, box-shadow 0.2s",
    border: "1px solid #f3f4f6",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  cardImg: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderBottom: "1px solid #f3f4f6",
  },
  cardHeader: {
    padding: "1.25rem 1.5rem",
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
  },
  cardBody: {
    padding: "0 1.5rem 1.5rem 1.5rem",
    flexGrow: 1,
    color: "#475569",
  },
  cardFooter: {
    padding: "1rem 1.5rem",
    background: "#f9fafb",
    borderTop: "1px solid #f3f4f6",
    display: "flex", // Ensure flexbox
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.5rem",
  },
  primaryBtn: {
    flex: 1, // Take equal space
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: "none",
    fontWeight: "600",
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "center",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "white",
    textDecoration: "none",
    display: "inline-block", // Important for anchor tags
  },
  secondaryBtn: {
    flex: 1,
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: "1px solid #3b82f6",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontWeight: "600",
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "center",
  },
  emptyState: {
    textAlign: "center",
    padding: "3rem",
    background: "white",
    borderRadius: "1rem",
    border: "2px dashed #e2e8f0",
    color: "#94a3b8",
    marginBottom: "2rem",
  }
};

export default function StudyMaterialView() {
  const [auth, setAuth] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });
  const parentId = auth?.regid;
  const [staffmaterial, setStaffmaterial] = useState([]);

  const handleViewDownload = async (pdfPath) => {
    try {
      const url = `http://localhost:5000/${encodeURI(pdfPath)}`;
      // 1) Open in new tab
      // window.open(url, "_blank");

      // 2) Fetch the file as a blob
      const response = await fetch(url);
      const blob = await response.blob();

      // 3) Create a temporary object URL & download link
      const blobUrl = window.URL.createObjectURL(blob);
      const filename = pdfPath.split("/").pop();

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 4) Revoke the object URL to free memory
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      window.alert("❌ Download failed.");
    }
  };

  useEffect(() => {
    axios
      .post("http://localhost:5000/demo/getmaterialbyparentid", {
        parentId: auth?.regid,
      })
      .then((res) => {
        setStaffmaterial(res.data.material);
        console.log(res.data.material);
      })
      .catch((err) => console.error("Error:", err));
  }, [auth]); // Added dependency

  const childMaterials = staffmaterial.filter(
    (item) => item.group === "children"
  );
  const adultMaterials = staffmaterial.filter((item) => item.group === "adult");

  const renderSection = (title, emoji, materials) => (
    <div className="section">
      <div style={styles.sectionTitle}>
        <span style={{ fontSize: "2rem" }}>{emoji}</span>
        <span>{title}</span>
        <span className="badge bg-secondary rounded-pill fs-6 ms-2">{materials.length}</span>
      </div>

      {materials.length > 0 ? (
        <div style={styles.grid}>
          {materials.map((material, index) => (
            <div
              key={index}
              style={styles.card}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
              }}
            >
              <img
                src={`http://localhost:5000/${material.image}`}
                alt={material.title}
                style={styles.cardImg}
              />
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>{material.title}</h3>
              </div>
              <div style={styles.cardBody}>
                <div style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center" }}>
                  <span style={{ marginRight: "0.5rem" }}>📚</span>
                  <strong>Subject: </strong> <span style={{ marginLeft: "0.5rem" }}>{material.subject}</span>
                </div>
              </div>
              <div style={styles.cardFooter}>
                <a
                  href={`http://localhost:5000/${material.pdf}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.secondaryBtn}
                >
                  👁️ View
                </a>
                <button
                  onClick={() => handleViewDownload(material.pdf)}
                  style={styles.primaryBtn}
                  onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
                  onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                >
                  ⬇️ Download
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <h3>📂 No Materials Found</h3>
          <p>There are no study materials uploaded for this category yet.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="container-fluid position-relative d-flex p-0" style={styles.container}>
      <ParentSide />
      <div className="content" style={{ flex: 1, overflowY: "auto" }}>
        <ParentNav />

        {/* Header Section */}
        <div style={{ padding: '1.5rem 2rem' }}>
          <div style={{
            ...styles.header,
            margin: 0,
            padding: '3rem 2rem',
            borderRadius: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            textAlign: 'left',
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          }}>
            <h1 style={{ ...styles.title, fontSize: '2.5rem' }}>Study Material Hub 📚</h1>
            <p style={{ ...styles.subtitle, opacity: 0.9 }}>Access curated learning resources for your family's growth.</p>
          </div>
        </div>

        <div className="container-fluid px-4" style={{ maxWidth: '1400px', paddingBottom: '4rem' }}>
          <div className="mt-4">
            {renderSection("Child Study Materials", "🧒", childMaterials)}
          </div>
          <hr className="my-5" style={{ opacity: 0.1 }} />
          <div className="mt-4">
            {renderSection("Adult Study Materials", "🧑", adultMaterials)}
          </div>
        </div>
      </div>
    </div>
  );
}
