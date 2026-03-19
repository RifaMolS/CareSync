// import React, { useEffect, useState } from "react";
// import StaffSide from "./StaffSide";
// import StaffNav from "./StaffNav";
// import axios from "axios";
// import { useRef } from "react";
// const StudyMaterialPage = () => {
//   const [auth, setAuth] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem("user"));
//     } catch {
//       return null;
//     }
//   });
//   const pdfInputRef = useRef(null);
//   const imageInputRef = useRef(null);
//   const staffId = auth?.regid;

//   const [materials, setMaterials] = useState({
//     children: [], // Initialize empty, will be filled by fetch
//     adult: [],
//   });

//   const [newMaterial, setNewMaterial] = useState({
//     title: "",
//     subject: "",
//     image: null,
//     pdf: "",
//     group: "children",
//   });

//   const [image, setImage] = useState(null);
//   const [pdf, setPdf] = useState(null);
//   const [editIndex, setEditIndex] = useState(null);
//   const [editingGroup, setEditingGroup] = useState(null);

//   const styles = {
//     container: {
//       backgroundColor: "#f3f4f6",
//       minHeight: "100vh",
//       fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//     },
//     header: {
//       background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
//       color: "white",
//       padding: "3rem 1.5rem",
//       borderRadius: "0 0 2rem 2rem",
//       marginBottom: "2rem",
//       boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
//       textAlign: "center",
//     },
//     title: {
//       fontSize: "2.5rem",
//       fontWeight: "800",
//       marginBottom: "0.5rem",
//       letterSpacing: "-0.025em",
//     },
//     subtitle: {
//       opacity: 0.9,
//       fontSize: "1.1rem",
//     },
//     formCard: {
//       background: "white",
//       borderRadius: "1.5rem",
//       padding: "2.5rem",
//       boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
//       marginBottom: "3rem",
//       border: "1px solid rgba(229, 231, 235, 0.5)",
//       maxWidth: "800px",
//       margin: "0 auto 3rem auto",
//     },
//     inputGroup: {
//       marginBottom: "1.5rem",
//     },
//     label: {
//       display: "block",
//       fontSize: "0.875rem",
//       fontWeight: "600",
//       color: "#374151",
//       marginBottom: "0.5rem",
//       marginLeft: "0.25rem",
//     },
//     input: {
//       width: "100%",
//       padding: "0.75rem 1rem",
//       borderRadius: "0.75rem",
//       border: "1px solid #e5e7eb",
//       backgroundColor: "#f9fafb",
//       transition: "all 0.2s ease",
//       fontSize: "1rem",
//       color: "#1f2937",
//     },
//     button: {
//       background: editIndex !== null
//         ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
//         : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
//       color: "white",
//       fontWeight: "700",
//       padding: "1rem 2rem",
//       borderRadius: "0.75rem",
//       border: "none",
//       cursor: "pointer",
//       width: "100%",
//       transition: "transform 0.2s, box-shadow 0.2s",
//       boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//     },
//     sectionTitle: {
//       fontSize: "1.75rem",
//       fontWeight: "700",
//       color: "#1e293b",
//       marginBottom: "1.5rem",
//       // display: "flex",
//       alignItems: "center",
//       gap: "0.75rem",
//     },
//     grid: {
//       display: "grid",
//       gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
//       gap: "2rem",
//       marginBottom: "3rem",
//     },
//     card: {
//       background: "white",
//       borderRadius: "1rem",
//       overflow: "hidden",
//       boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//       transition: "transform 0.2s, box-shadow 0.2s",
//       border: "1px solid #f3f4f6",
//       display: "flex",
//       flexDirection: "column",
//       height: "100%",
//     },
//     cardImg: {
//       width: "100%",
//       height: "180px",
//       objectFit: "cover",
//       borderBottom: "1px solid #f3f4f6",
//     },
//     cardHeader: {
//       padding: "1.25rem 1.5rem",
//     },
//     cardTitle: {
//       fontSize: "1.25rem",
//       fontWeight: "700",
//       color: "#0f172a",
//       margin: 0,
//     },
//     cardBody: {
//       padding: "0 1.5rem 1.5rem 1.5rem",
//       flexGrow: 1,
//       color: "#475569",
//     },
//     cardFooter: {
//       padding: "1rem 1.5rem",
//       background: "#f9fafb",
//       borderTop: "1px solid #f3f4f6",
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       gap: "0.5rem",
//     },
//     actionBtn: {
//       flex: 1,
//       padding: "0.5rem",
//       borderRadius: "0.5rem",
//       border: "1px solid transparent",
//       fontWeight: "600",
//       fontSize: "0.85rem",
//       cursor: "pointer",
//       transition: "all 0.2s",
//       textAlign: "center",
//     },
//     viewBtn: {
//       background: "#ecfeff",
//       color: "#06b6d4",
//       border: "1px solid #cffafe",
//     },
//     editBtn: {
//       background: "#fff",
//       border: "1px solid #e2e8f0",
//       color: "#475569",
//     },
//     deleteBtn: {
//       background: "#fee2e2",
//       color: "#ef4444",
//       border: "1px solid #fecaca",
//     },
//     emptyState: {
//       textAlign: "center",
//       padding: "3rem",
//       background: "white",
//       borderRadius: "1rem",
//       border: "2px dashed #e2e8f0",
//       color: "#94a3b8",
//     }
//   };

//   const fileUpload = (e, setFile) => {
//     const file = e.target.files[0];
//     const formData = new FormData();
//     formData.append("file", file);

//     fetch("http://localhost:5000/util/fileUpload", {
//       method: "POST",
//       body: formData,
//     })
//       .then((res) => res.json())
//       .then((result) => setImage(result))
//       .catch((error) => console.error("Error uploading file:", error));
//   };

//   const filepdfUpload = (e, setFile) => {
//     const file = e.target.files[0];
//     const formData = new FormData();
//     formData.append("file", file);

//     fetch("http://localhost:5000/util/fileUpload", {
//       method: "POST",
//       body: formData,
//     })
//       .then((res) => res.json())
//       .then((result) => setPdf(result))
//       .catch((error) => console.error("Error uploading file:", error));
//   };

//   const fetchMaterials = async () => {
//     try {
//       const res = await axios.post("http://localhost:5000/demo/materialview", { staffId });
//       const data = res.data;
//       setMaterials({
//         children: data.filter((mat) => mat.group === "children"),
//         adult: data.filter((mat) => mat.group === "adult"),
//       });
//     } catch (err) {
//       console.error("❌ Failed to fetch materials:", err);
//     }
//   };

//   useEffect(() => {
//     fetchMaterials();
//   }, []);

//   const handleViewDownload = async (pdfPath) => {
//     try {
//       const url = `http://localhost:5000/${encodeURI(pdfPath)}`;
//       window.open(url, "_blank");
//       const response = await fetch(url);
//       const blob = await response.blob();
//       const blobUrl = window.URL.createObjectURL(blob);
//       const filename = pdfPath.split("/").pop();
//       const link = document.createElement("a");
//       link.href = blobUrl;
//       link.download = filename;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(blobUrl);
//     } catch (err) {
//       console.error("Download failed:", err);
//       window.alert("❌ Download failed.");
//     }
//   };

//   const handleAdd = async () => {
//     const { title, subject, group } = newMaterial; // Removed class

//     if (!title || !subject || !pdf || !image || !group) {
//       window.alert("❗ Please fill all fields: Title, Subject, Group, Image, and PDF.");
//       return;
//     }

//     const completeMaterial = {
//       ...newMaterial,
//       // Ensure class is not sent or sent as empty if backend requires it (assuming schema allows empty/optional)
//       // If backend requires it, I might need to send a dummy value. Let's assume it's optional now or I send "N/A"
//       class: "N/A",
//       image,
//       pdf,
//       staffassign: staffId,
//     };

//     try {
//       await axios.post("http://localhost:5000/demo/addmaterial", completeMaterial);
//       window.alert("✅ Material added successfully!");
//       fetchMaterials();

//       // Reset
//       setImage(null);
//       setPdf(null);
//       if (pdfInputRef.current) pdfInputRef.current.value = "";
//       if (imageInputRef.current) imageInputRef.current.value = "";
//       setNewMaterial({ title: "", subject: "", image: null, pdf: "", group: "children" });
//     } catch (err) {
//       console.error("❌ Material upload failed:", err);
//       window.alert("❌ Failed to upload material.");
//     }
//   };

//   const handleEdit = async (index, group) => {
//     const materialToEdit = materials[group][index];
//     try {
//       const res = await axios.post(`http://localhost:5000/demo/materialedit`, { id: materialToEdit._id });
//       const materialData = res.data;
//       setEditIndex(index);
//       setEditingGroup(group);
//       setNewMaterial({ ...materialData, group });
//       setPdf(materialData.pdf);
//       setImage(materialData.image);
//     } catch (error) {
//       console.error("❌ Error fetching material for edit:", error);
//       window.alert("❌ Failed to load material for editing.");
//     }
//   };

//   const handleUpdate = async () => {
//     const { title, subject, group } = newMaterial; // Removed class

//     if (!title || !subject || !pdf || !image || !group) {
//       window.alert("❗ Please fill all fields: Title, Subject, Group, Image, and PDF.");
//       return;
//     }

//     const updatedMaterial = {
//       ...newMaterial,
//       image,
//       pdf,
//       class: "N/A", // Ensure class is handled
//       staffassign: staffId,
//       id: newMaterial._id,
//     };

//     try {
//       await axios.post("http://localhost:5000/demo/materialupdate", updatedMaterial);
//       window.alert("✅ Material updated successfully!");
//       fetchMaterials();

//       // Reset
//       setImage(null);
//       setPdf(null);
//       if (pdfInputRef.current) pdfInputRef.current.value = "";
//       if (imageInputRef.current) imageInputRef.current.value = "";
//       setNewMaterial({ title: "", subject: "", image: null, pdf: null, group: "children" });
//       setEditIndex(null);
//       setEditingGroup(null);
//     } catch (err) {
//       console.error("❌ Update failed:", err);
//       window.alert("❌ Failed to update material.");
//     }
//   };

//   const handleDelete = async (index, group) => {
//     const materialToDelete = materials[group][index];
//     if (!window.confirm(`Are you sure you want to delete "${materialToDelete.title}"?`)) return;

//     try {
//       await axios.post('http://localhost:5000/demo/deletematerial', { id: materialToDelete._id });
//       window.alert("🗑️ Material deleted successfully!");
//       fetchMaterials();
//     } catch (error) {
//       console.error("❌ Error deleting material:", error);
//       window.alert("❌ Failed to delete material.");
//     }
//   };

//   const renderCard = (material, index, group) => (
//     <div
//       key={material._id || index}
//       style={styles.card}
//       onMouseOver={(e) => {
//         e.currentTarget.style.transform = "translateY(-5px)";
//         e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
//       }}
//       onMouseOut={(e) => {
//         e.currentTarget.style.transform = "translateY(0)";
//         e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
//       }}
//     >
//       <img src={`http://localhost:5000/${material.image}`} alt={material.title} style={styles.cardImg} />
//       <div style={styles.cardHeader}>
//         <h3 style={styles.cardTitle}>{material.title}</h3>
//       </div>
//       <div style={styles.cardBody}>
//         <div style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center" }}>
//           <span style={{ marginRight: "0.5rem" }}>📚</span>
//           <strong>Subject: </strong> <span style={{ marginLeft: "0.5rem" }}>{material.subject}</span>
//         </div>
//       </div>
//       <div style={styles.cardFooter}>
//         <button
//           style={{ ...styles.actionBtn, ...styles.viewBtn }}
//           onClick={() => handleViewDownload(material.pdf)}
//         >
//           📄 View
//         </button>
//         <button
//           style={{ ...styles.actionBtn, ...styles.editBtn }}
//           onClick={() => handleEdit(index, group)}
//         >
//           ✏️ Edit
//         </button>
//         <button
//           style={{ ...styles.actionBtn, ...styles.deleteBtn }}
//           onClick={() => handleDelete(index, group)}
//         >
//           🗑️ Del
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="container-fluid position-relative d-flex p-0" style={styles.container}>
//       <StaffSide />
//       <div className="content" style={{ flex: 1, overflowY: "auto" }}>
//         <StaffNav />

//         {/* Header Section */}
//         <div style={styles.header}>
//           <div className="container">
//             <h1 style={styles.title}>Knowledge Hub</h1>
//             <p style={styles.subtitle}>Upload and manage study materials for your students.</p>
//           </div>
//         </div>

//         <div className="container pb-5">
//           {/* Form Section */}
//           <div style={styles.formCard}>
//             <div className="d-flex align-items-center mb-4">
//               <span style={{ fontSize: "1.5rem", marginRight: "1rem" }}>{editIndex !== null ? "✏️" : "✨"}</span>
//               <h3 className="m-0 fw-bold text-dark">{editIndex !== null ? "Edit Material" : "Upload New Material"}</h3>
//             </div>

//             <div className="row g-4">
//               <div className="col-md-6">
//                 <div style={styles.inputGroup}>
//                   <label style={styles.label}>Title</label>
//                   <input
//                     type="text"
//                     value={newMaterial.title}
//                     onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
//                     style={styles.input}
//                     placeholder="e.g. Chapter 1: Basics"
//                   />
//                 </div>
//               </div>

//               <div className="col-md-6">
//                 <div style={styles.inputGroup}>
//                   <label style={styles.label}>Subject</label>
//                   <input
//                     type="text"
//                     value={newMaterial.subject}
//                     onChange={(e) => setNewMaterial({ ...newMaterial, subject: e.target.value })}
//                     style={styles.input}
//                     placeholder="e.g. Mathematics"
//                   />
//                 </div>
//               </div>

//               <div className="col-md-12">
//                 <div style={styles.inputGroup}>
//                   <label style={styles.label}>Target Group</label>
//                   <select
//                     value={newMaterial.group}
//                     onChange={(e) => setNewMaterial({ ...newMaterial, group: e.target.value })}
//                     style={styles.input}
//                   >
//                     <option value="children">🧒 Children</option>
//                     <option value="adult">👨‍🎓 Adult</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="col-md-6">
//                 <div style={styles.inputGroup}>
//                   <label style={styles.label}>📄 Upload PDF</label>
//                   <input
//                     type="file"
//                     accept=".pdf"
//                     ref={pdfInputRef}
//                     onChange={(e) => filepdfUpload(e, setPdf)}
//                     style={styles.input}
//                   />
//                   {pdf && (
//                     <div className="mt-2 p-2 border rounded bg-light">
//                       <small className="text-success">✅ PDF Selected: ...{pdf.slice(-15)}</small>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="col-md-6">
//                 <div style={styles.inputGroup}>
//                   <label style={styles.label}>🖼️ Cover Image</label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     ref={imageInputRef}
//                     onChange={(e) => fileUpload(e, setImage)}
//                     style={styles.input}
//                   />
//                   {image && (
//                     <img src={`http://localhost:5000/${image}`} alt="Preview" style={{ height: "60px", marginTop: "10px", borderRadius: "8px" }} />
//                   )}
//                 </div>
//               </div>

//               <div className="col-12 mt-4">
//                 <button
//                   style={styles.button}
//                   onClick={editIndex !== null ? handleUpdate : handleAdd}
//                   onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
//                   onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
//                 >
//                   {editIndex !== null ? "Update Material" : "Upload Material"}
//                 </button>
//               </div>
//             </div>
//           </div>

//           <hr className="my-5" style={{ opacity: 0.1 }} />

//           {/* Lists */}
//           <div>
//             <div style={styles.sectionTitle}>
//               <span style={{ fontSize: "2rem" }}>🧒</span>
//               <span>Children's Resources</span>
//               <span className="badge bg-primary rounded-pill fs-6 ms-2">{materials.children.length}</span>
//             </div>

//             {materials.children.length > 0 ? (
//               <div style={styles.grid}>
//                 {materials.children.map((mat, idx) => renderCard(mat, idx, "children"))}
//               </div>
//             ) : (
//               <div style={styles.emptyState}>
//                 <p className="m-0">No study materials used for children.</p>
//               </div>
//             )}
//           </div>

//           <div className="mt-5">
//             <div style={styles.sectionTitle}>
//               <span style={{ fontSize: "2rem" }}>👨‍🎓</span>
//               <span>Adult Resources</span>
//               <span className="badge bg-info text-dark rounded-pill fs-6 ms-2">{materials.adult.length}</span>
//             </div>

//             {materials.adult.length > 0 ? (
//               <div style={styles.grid}>
//                 {materials.adult.map((mat, idx) => renderCard(mat, idx, "adult"))}
//               </div>
//             ) : (
//               <div style={styles.emptyState}>
//                 <p className="m-0">No study materials used for adults.</p>
//               </div>
//             )}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };


// export default StudyMaterialPage;


import React, { useEffect, useState } from "react";
import StaffSide from "./StaffSide";
import StaffNav from "./StaffNav";
import axios from "axios";
import { useRef } from "react";

const StudyMaterialPage = () => {
  const [auth, setAuth] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });
  const pdfInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const staffId = auth?.regid;

  const [materials, setMaterials] = useState({
    children: [],
    adult: [],
  });

  const [newMaterial, setNewMaterial] = useState({
    title: "",
    subject: "",
    image: null,
    pdf: "",
    group: "children",
  });

  const [image, setImage] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);

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
    formCard: {
      background: "white",
      borderRadius: "1.5rem",
      padding: "2.5rem",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      marginBottom: "3rem",
      border: "1px solid rgba(229, 231, 235, 0.5)",
      maxWidth: "800px",
      margin: "0 auto 3rem auto",
    },
    inputGroup: {
      marginBottom: "1.5rem",
    },
    label: {
      display: "block",
      fontSize: "0.875rem",
      fontWeight: "600",
      color: "#374151",
      marginBottom: "0.5rem",
      marginLeft: "0.25rem",
    },
    input: {
      width: "100%",
      padding: "0.75rem 1rem",
      borderRadius: "0.75rem",
      border: "1px solid #e5e7eb",
      backgroundColor: "#f9fafb",
      transition: "all 0.2s ease",
      fontSize: "1rem",
      color: "#1f2937",
    },
    button: {
      background: editIndex !== null
        ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
        : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: "white",
      fontWeight: "700",
      padding: "1rem 2rem",
      borderRadius: "0.75rem",
      border: "none",
      cursor: "pointer",
      width: "100%",
      transition: "transform 0.2s, box-shadow 0.2s",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    },
    sectionTitle: {
      fontSize: "1.75rem",
      fontWeight: "700",
      color: "#1e293b",
      marginBottom: "1.5rem",
      alignItems: "center",
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
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "0.5rem",
    },
    actionBtn: {
      flex: 1,
      padding: "0.5rem",
      borderRadius: "0.5rem",
      border: "1px solid transparent",
      fontWeight: "600",
      fontSize: "0.85rem",
      cursor: "pointer",
      transition: "all 0.2s",
      textAlign: "center",
    },
    viewBtn: {
      background: "#ecfeff",
      color: "#06b6d4",
      border: "1px solid #cffafe",
    },
    editBtn: {
      background: "#fff",
      border: "1px solid #e2e8f0",
      color: "#475569",
    },
    deleteBtn: {
      background: "#fee2e2",
      color: "#ef4444",
      border: "1px solid #fecaca",
    },
    emptyState: {
      textAlign: "center",
      padding: "3rem",
      background: "white",
      borderRadius: "1rem",
      border: "2px dashed #e2e8f0",
      color: "#94a3b8",
    }
  };

  const fileUpload = (e, setFile) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    fetch("http://localhost:5000/util/fileUpload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((result) => setImage(result))
      .catch((error) => console.error("Error uploading file:", error));
  };

  const filepdfUpload = (e, setFile) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    fetch("http://localhost:5000/util/fileUpload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((result) => setPdf(result))
      .catch((error) => console.error("Error uploading file:", error));
  };

  const fetchMaterials = async () => {
    try {
      const res = await axios.post("http://localhost:5000/demo/materialview", { staffId });
      const data = res.data;
      setMaterials({
        children: data.filter((mat) => mat.group === "children"),
        adult: data.filter((mat) => mat.group === "adult"),
      });
    } catch (err) {
      console.error("❌ Failed to fetch materials:", err);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleViewDownload = async (pdfPath) => {
    try {
      const url = `http://localhost:5000/${encodeURI(pdfPath)}`;
      window.open(url, "_blank");
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const filename = pdfPath.split("/").pop();
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      window.alert("❌ Download failed.");
    }
  };

  const handleAdd = async () => {
    const { title, subject, group } = newMaterial;

    if (!title || !subject || !pdf || !image || !group) {
      window.alert("❗ Please fill all fields: Title, Subject, Group, Image, and PDF.");
      return;
    }

    const completeMaterial = {
      ...newMaterial,
      class: "N/A",
      image,
      pdf,
      staffassign: staffId,
    };

    try {
      await axios.post("http://localhost:5000/demo/addmaterial", completeMaterial);
      window.alert("✅ Material added successfully!");
      fetchMaterials();

      setImage(null);
      setPdf(null);
      if (pdfInputRef.current) pdfInputRef.current.value = "";
      if (imageInputRef.current) imageInputRef.current.value = "";
      setNewMaterial({ title: "", subject: "", image: null, pdf: "", group: "children" });
    } catch (err) {
      console.error("❌ Material upload failed:", err);
      window.alert("❌ Failed to upload material.");
    }
  };

  const handleEdit = async (index, group) => {
    const materialToEdit = materials[group][index];
    try {
      const res = await axios.post(`http://localhost:5000/demo/materialedit`, { id: materialToEdit._id });
      const materialData = res.data;
      setEditIndex(index);
      setEditingGroup(group);
      setNewMaterial({ ...materialData, group });
      setPdf(materialData.pdf);
      setImage(materialData.image);
    } catch (error) {
      console.error("❌ Error fetching material for edit:", error);
      window.alert("❌ Failed to load material for editing.");
    }
  };

  const handleUpdate = async () => {
    const { title, subject, group } = newMaterial;

    if (!title || !subject || !pdf || !image || !group) {
      window.alert("❗ Please fill all fields: Title, Subject, Group, Image, and PDF.");
      return;
    }

    const updatedMaterial = {
      ...newMaterial,
      image,
      pdf,
      class: "N/A",
      staffassign: staffId,
      id: newMaterial._id,
    };

    try {
      await axios.post("http://localhost:5000/demo/materialupdate", updatedMaterial);
      window.alert("✅ Material updated successfully!");
      fetchMaterials();

      setImage(null);
      setPdf(null);
      if (pdfInputRef.current) pdfInputRef.current.value = "";
      if (imageInputRef.current) imageInputRef.current.value = "";
      setNewMaterial({ title: "", subject: "", image: null, pdf: null, group: "children" });
      setEditIndex(null);
      setEditingGroup(null);
    } catch (err) {
      console.error("❌ Update failed:", err);
      window.alert("❌ Failed to update material.");
    }
  };

  const handleDelete = async (index, group) => {
    const materialToDelete = materials[group][index];
    if (!window.confirm(`Are you sure you want to delete "${materialToDelete.title}"?`)) return;

    try {
      await axios.post('http://localhost:5000/demo/deletematerial', { id: materialToDelete._id });
      window.alert("🗑️ Material deleted successfully!");
      fetchMaterials();
    } catch (error) {
      console.error("❌ Error deleting material:", error);
      window.alert("❌ Failed to delete material.");
    }
  };

  const renderCard = (material, index, group) => (
    <div
      key={material._id || index}
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
      <img src={`http://localhost:5000/${material.image}`} alt={material.title} style={styles.cardImg} />
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
        <button
          style={{ ...styles.actionBtn, ...styles.viewBtn }}
          onClick={() => handleViewDownload(material.pdf)}
        >
          📄 View
        </button>
        <button
          style={{ ...styles.actionBtn, ...styles.editBtn }}
          onClick={() => handleEdit(index, group)}
        >
          ✏️ Edit
        </button>
        <button
          style={{ ...styles.actionBtn, ...styles.deleteBtn }}
          onClick={() => handleDelete(index, group)}
        >
          🗑️ Del
        </button>
      </div>
    </div>
  );

  return (
    <div className="container-fluid position-relative d-flex p-0" style={styles.container}>
      <StaffSide />
      <div className="content" style={{ flex: 1, overflowY: "auto", marginLeft: "250px", width: "calc(100% - 250px)" }}>
        <StaffNav />

        {/* Header Section */}
        <div style={styles.header}>
          <div className="container">
            <h1 style={styles.title}>Knowledge Hub</h1>
            <p style={styles.subtitle}>Upload and manage study materials for your students.</p>
          </div>
        </div>

        <div className="container pb-5" style={{ maxWidth: "1400px", paddingLeft: "2rem", paddingRight: "2rem" }}>
          {/* Form Section */}
          <div style={styles.formCard}>
            <div className="d-flex align-items-center mb-4">
              <span style={{ fontSize: "1.5rem", marginRight: "1rem" }}>{editIndex !== null ? "✏️" : "✨"}</span>
              <h3 className="m-0 fw-bold text-dark">{editIndex !== null ? "Edit Material" : "Upload New Material"}</h3>
            </div>

            <div className="row g-4">
              <div className="col-md-6">
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Title</label>
                  <input
                    type="text"
                    value={newMaterial.title}
                    onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                    style={styles.input}
                    placeholder="e.g. Chapter 1: Basics"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Subject</label>
                  <input
                    type="text"
                    value={newMaterial.subject}
                    onChange={(e) => setNewMaterial({ ...newMaterial, subject: e.target.value })}
                    style={styles.input}
                    placeholder="e.g. Mathematics"
                  />
                </div>
              </div>

              <div className="col-md-12">
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Target Group</label>
                  <select
                    value={newMaterial.group}
                    onChange={(e) => setNewMaterial({ ...newMaterial, group: e.target.value })}
                    style={styles.input}
                  >
                    <option value="children">🧒 Children</option>
                    <option value="adult">👨‍🎓 Adult</option>
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <div style={styles.inputGroup}>
                  <label style={styles.label}>📄 Upload PDF</label>
                  <input
                    type="file"
                    accept=".pdf"
                    ref={pdfInputRef}
                    onChange={(e) => filepdfUpload(e, setPdf)}
                    style={styles.input}
                  />
                  {pdf && (
                    <div className="mt-2 p-2 border rounded bg-light">
                      <small className="text-success">✅ PDF Selected: ...{pdf.slice(-15)}</small>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div style={styles.inputGroup}>
                  <label style={styles.label}>🖼️ Cover Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={imageInputRef}
                    onChange={(e) => fileUpload(e, setImage)}
                    style={styles.input}
                  />
                  {image && (
                    <img src={`http://localhost:5000/${image}`} alt="Preview" style={{ height: "60px", marginTop: "10px", borderRadius: "8px" }} />
                  )}
                </div>
              </div>

              <div className="col-12 mt-4">
                <button
                  style={styles.button}
                  onClick={editIndex !== null ? handleUpdate : handleAdd}
                  onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  {editIndex !== null ? "Update Material" : "Upload Material"}
                </button>
              </div>
            </div>
          </div>

          <hr className="my-5" style={{ opacity: 0.1 }} />

          {/* Lists */}
          <div>
            <div style={styles.sectionTitle}>
              <span style={{ fontSize: "2rem" }}>🧒</span>
              <span>Children's Resources</span>
              <span className="badge bg-primary rounded-pill fs-6 ms-2">{materials.children.length}</span>
            </div>

            {materials.children.length > 0 ? (
              <div style={styles.grid}>
                {materials.children.map((mat, idx) => renderCard(mat, idx, "children"))}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <p className="m-0">No study materials used for children.</p>
              </div>
            )}
          </div>

          <div className="mt-5">
            <div style={styles.sectionTitle}>
              <span style={{ fontSize: "2rem" }}>👨‍🎓</span>
              <span>Adult Resources</span>
              <span className="badge bg-info text-dark rounded-pill fs-6 ms-2">{materials.adult.length}</span>
            </div>

            {materials.adult.length > 0 ? (
              <div style={styles.grid}>
                {materials.adult.map((mat, idx) => renderCard(mat, idx, "adult"))}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <p className="m-0">No study materials used for adults.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudyMaterialPage;