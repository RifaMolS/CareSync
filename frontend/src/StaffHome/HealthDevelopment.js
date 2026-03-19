import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StaffSide from "./StaffSide";
import StaffNav from "./StaffNav";
import axios from "axios";

const styles = {
  card: {
    background: "#f9fafb",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  cardHover: {
    boxShadow: "0 8px 24px rgba(79, 70, 229, 0.3)",
    background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
  },
  button: {
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "12px 18px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: 16,
    boxShadow: "0 4px 12px rgba(79, 70, 229, 0.4)",
    transition: "background-color 0.3s ease",
    margin: 5,
  },
  buttonHover: {
    backgroundColor: "#4338ca",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 8,
    border: "1.5px solid #ddd",
    fontSize: 16,
    transition: "border-color 0.3s ease",
  },
};

const modalStyles = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(31, 41, 55, 0.75)", // dark semi-transparent background
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(6px)", // subtle blur behind modal
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    width: 600,
    maxWidth: "95%",
    maxHeight: "90vh",
    overflowY: "auto",
    padding: 30,
    boxShadow:
      "0 20px 50px rgba(0, 0, 0, 0.2)",
    position: "relative",
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 24,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#4f46e5",
    userSelect: "none",
  },
  closeIcon: {
    cursor: "pointer",
    fontSize: 28,
    fontWeight: "700",
    color: "#a5b4fc",
    transition: "color 0.3s ease",
  },
  closeIconHover: {
    color: "#4338ca",
  },
  body: {
    display: "flex",
    flexDirection: "column",
  },
  footer: {
    marginTop: 28,
    display: "flex",
    justifyContent: "flex-end",
    gap: 16,
  },
  cancelBtn: {
    backgroundColor: "#e0e0e0",
    border: "none",
    borderRadius: 12,
    padding: "12px 20px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: 16,
    color: "#333",
    boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
    transition: "background-color 0.3s ease",
  },
  cancelBtnHover: {
    backgroundColor: "#bcbcbc",
  },
  submitBtn: {
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "12px 20px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: 16,
    boxShadow: "0 6px 16px rgba(79, 70, 229, 0.6)",
    transition: "background-color 0.3s ease",
  },
  submitBtnHover: {
    backgroundColor: "#4338ca",
  },
};
const modalBase = {
  overlay: {
    position: "fixed",
    inset: 0,
    backdropFilter: "blur(10px)",
    background: "rgba(0,0,0,0.38)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 900,
  },
  card: {
    width: 520,
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(14px)",
    borderRadius: 24,
    overflow: "hidden",
    boxShadow: "0 24px 34px rgba(0,0,0,0.18), 0 10px 18px rgba(0,0,0,0.08)",
    border: "1px solid rgba(99,102,241,0.25)",
  },
  header: {
    padding: "22px 32px",
    background: "linear-gradient(90deg,#6366f1 0%,#8b5cf6 40%,#ec4899 100%)",
    color: "#fff",
    fontSize: 20,
    fontWeight: 700,
    display: "flex",
    justifyContent: "space-between",
  },
  body: {
    padding: 32,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    background: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(12px)",
  },
  footer: {
    padding: 24,
    display: "flex",
    justifyContent: "flex-end",
    gap: 14,
    background: "rgba(255,255,255,0.6)",
    backdropFilter: "blur(10px)",
  },
  cancelBtn: {
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: 600,
    color: "#4f46e5",
    background: "rgba(255,255,255,0.8)",
    border: "2px solid #4f46e5",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    backdropFilter: "blur(6px)",
  },

};
export default function HealthDevelopment() {
  const [assignments, setAssignments] = useState([]);
  const auth = JSON.parse(localStorage.getItem("user"));
  const staffId = auth?._id;
  useEffect(() => {
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
    fetchAssignedStudents();
  }, [staffId]);
  const records = assignments.map((a) => ({
    childName:
      a.childId?.regid?.childname ||
      a.childId?.regid?.name ||
      a.adultId?.regid?.adultname ||
      a.adultId?.regid?.name ||
      a.childId?.childname ||
      a.childId?.name ||
      a.adultId?.adultname ||
      a.adultId?.name ||
      a.parentId?.childname ||
      "Unnamed",
    parentName: a.parentId?.parentname || "Unknown",
  }));
  const [height, setHeight] = useState(""); // in cm or m
  const [weight, setWeight] = useState(""); // in kg
  const [bmi, setBmi] = useState("");
  useEffect(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const heightInMeters = h > 10 ? h / 100 : h; // assume cm if > 10
      const calculatedBmi = (w / (heightInMeters * heightInMeters)).toFixed(2);
      setBmi(calculatedBmi);
    } else {
      setBmi("");
    }
  }, [height, weight]);
  const [hoverChildName, setHoverChildName] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedChildName, setSelectedChildName] = useState("");
  const [parentName, setParentName] = useState("");
  const [selectedChildId, setSelectedChildId] = useState("");
  const [parentId, setParentId] = useState("");
  const [incident, setIncident] = useState("");
  const [image, setImage] = useState(null);
  // For button hover states inside cards and modal
  const [buttonHover, setButtonHover] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);
  const [submitHover, setSubmitHover] = useState(false);
  const [closeHover, setCloseHover] = useState(false);
  const [reports, setReports] = useState([]);
  const [viewRecord, setViewRecord] = useState(null);
  const [showView, setShowView] = useState(false);
  const fileUpload = (e, setFile) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);

    fetch("http://localhost:5000/util/fileUpload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((result) => {
        setFile(result);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };
  useEffect(() => {
    const selectedAssignment = assignments.find(
      (a) => (
        a.childId?.regid?.childname ||
        a.childId?.regid?.name ||
        a.adultId?.regid?.adultname ||
        a.adultId?.regid?.name ||
        a.childId?.childname ||
        a.childId?.name ||
        a.adultId?.adultname ||
        a.adultId?.name ||
        a.parentId?.childname ||
        "Unnamed"
      ) === selectedChildName
    );
    setParentName(selectedAssignment?.parentId?.parentname || "");
    setSelectedChildId(selectedAssignment?.childId?.regid?._id || selectedAssignment?.adultId?.regid?._id || "");
    setParentId(selectedAssignment?.parentId?._id || "");
  }, [selectedChildName, assignments]);
  const fetchHealthReports = useCallback(() => {
    const profileId = auth?.regid; // Health reports are stored with Staff Profile ID
    if (!profileId) return;

    axios
      .post("http://localhost:5000/demo/viewhealthreport", { staffId: profileId })
      .then((res) => {
        if (res.data.success) {
          setReports(res.data.data);
          console.log(res.data.data, "Fetched reports");
        }
      })
      .catch((err) => {
        console.error("Error fetching reports:", err);
      });
  }, [auth?.regid]);

  // useEffect to fetch on mount
  useEffect(() => {
    fetchHealthReports();
  }, [fetchHealthReports]);
  const closeModal = () => {
    setShowModal(false);
    setSelectedChildName("");
    setIncident("");
    setImage(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (
      !selectedChildName ||
      !parentName ||
      !height ||
      !weight ||
      !incident ||
      !image
    ) {
      alert("Please fill all required fields");
      return;
    }

    // Create data object
    const selectedAssignment = assignments.find(
      (a) => (
        a.childId?.regid?.childname ||
        a.childId?.regid?.name ||
        a.adultId?.regid?.adultname ||
        a.adultId?.regid?.name ||
        a.childId?.childname ||
        a.childId?.name ||
        a.adultId?.adultname ||
        a.adultId?.name ||
        a.parentId?.childname ||
        "Unnamed"
      ) === selectedChildName
    );

    const isChild = !!selectedAssignment?.childId;

    const healthData = {
      staffId: auth.regid,
      childId: isChild ? selectedChildId : null,
      adultId: !isChild ? selectedChildId : null,
      parentId: parentId,
      height: Number(height),
      weight: Number(weight),
      bmi: bmi,
      incidentDescription: incident,
      image: image,
    };

    axios
      .post("http://localhost:5000/demo/healthreport", healthData)
      .then((res) => {
        alert(
          `Health report submitted successfully for ${selectedChildName} ✅`
        );

        // Reset form values
        setSelectedChildName("");
        setSelectedChildId("");
        setParentName("");
        setParentId("");
        setHeight("");
        setWeight("");
        setIncident("");
        setImage("");
        setBmi("");
        fetchHealthReports();
        closeModal(); // close modal after reset
      })
      .catch((err) => {
        console.error("Submission failed", err);
        alert("Submission failed ❌");
      });
  };
  const reportsByRecordId = reports.reduce((acc, report) => {
    // Robustly get the ID whether it's populated or not
    const rId = (report.childId?._id || report.childId) || (report.adultId?._id || report.adultId);
    if (rId) {
      const stringId = rId.toString();
      if (!acc[stringId]) acc[stringId] = [];
      acc[stringId].push(report);
    }
    return acc;
  }, {});
  const closeView = () => {
    setShowView(false);
    setViewRecord(null);
  };
  return (
    <div
      className="container-xxl position-relative bg-white d-flex p-0"
      style={{ minHeight: "100vh" }}
    >
      <StaffSide />
      <div className="content" style={{ flexGrow: 1, overflowY: "auto" }}>
        <StaffNav />
        <div style={{ padding: "30px", maxWidth: 900, margin: "0 auto" }}>
          <h1
            style={{
              marginBottom: 32,
              fontSize: 32,
              fontWeight: 800,
              color: "#4f46e5",
            }}
          >
            Health & Development Records
          </h1>

          {records.map(({ childName, parentName }) => {
            const child = assignments.find(
              (a) => (
                a.childId?.regid?.childname ||
                a.childId?.regid?.name ||
                a.adultId?.regid?.adultname ||
                a.adultId?.regid?.name ||
                a.childId?.childname ||
                a.childId?.name ||
                a.adultId?.adultname ||
                a.adultId?.name ||
                a.parentId?.childname ||
                "Unnamed"
              ) === childName
            );
            // const childId = child?.childId?.regid?._id || child?.adultId?.regid?._id;
            const recordId =
              (child?.childId?.regid?._id || child?.childId?.regid) ??
              (child?.adultId?.regid?._id || child?.adultId?.regid);

            const stringRecordId = recordId?.toString();
            const hasReports = stringRecordId ? (reportsByRecordId[stringRecordId]?.length > 0) : false;


            // Determine type
            const regType = child?.childId?.regType || child?.adultId?.regType;
            let isChild = false;
            if (regType) isChild = regType === 'child';
            else isChild = !!child?.childId; // Fallback

            return (
              <motion.div
                key={childName}
                style={{
                  ...styles.card,
                  ...(hoverChildName === childName ? styles.cardHover : {}),
                }}
                onMouseEnter={() => setHoverChildName(childName)}
                onMouseLeave={() => setHoverChildName(null)}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div
                  style={{ fontSize: 22, fontWeight: 700, color: "#1e293b", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span>{childName}</span>
                  <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, background: isChild ? '#dbeafe' : '#dcfce7', color: isChild ? '#1e40af' : '#166534' }}>
                    {isChild ? 'Child' : 'Adult'}
                  </span>
                </div>
                <div
                  style={{
                    marginBottom: 14,
                    color: "#64748b",
                    fontWeight: 600,
                  }}
                >
                  Guardian: {parentName}
                </div>

                <button
                  style={{
                    ...styles.button,
                    ...(buttonHover ? styles.buttonHover : {}),
                    marginBottom: hasReports ? 10 : 0,
                  }}
                  onClick={() => {
                    setSelectedChildName(childName);
                    setShowModal(true);
                  }}
                  onMouseEnter={() => setButtonHover(true)}
                  onMouseLeave={() => setButtonHover(false)}
                >
                  Add Incident
                </button>

                {hasReports && (
                  <button
                    style={{
                      ...styles.button,
                      backgroundColor: "#0f766e",
                      ...(buttonHover ? styles.buttonHover : {}),
                    }}
                    onClick={() => {
                      const recordReports = reportsByRecordId[stringRecordId];
                      const firstReport = recordReports?.[0];
                      if (!firstReport) {
                        console.error("No reports found for recordId:", stringRecordId);
                        return;
                      }
                      console.log("First Health Report:", firstReport);

                      setViewRecord({
                        childName: firstReport.childId?.childname || firstReport.adultId?.adultname || "Unnamed",
                        parentName: firstReport.parentId?.parentname || "Unknown",
                        heightCm: firstReport.height,
                        weightKg: firstReport.weight,
                        bmi: firstReport.bmi,
                        lastIncident: firstReport.incidentDescription,
                        image: firstReport.image,
                      });

                      setShowView(true);
                    }}
                  >
                    View Details
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {showModal && (
            <motion.div
              style={modalStyles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <motion.div
                style={modalStyles.card}
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 60, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={modalStyles.header}>
                  Add Health Incident
                  <span
                    style={{
                      ...modalStyles.closeIcon,
                      ...(closeHover ? modalStyles.closeIconHover : {}),
                    }}
                    onClick={closeModal}
                    onMouseEnter={() => setCloseHover(true)}
                    onMouseLeave={() => setCloseHover(false)}
                    aria-label="Close modal"
                  >
                    ×
                  </span>
                </div>

                <form onSubmit={handleSubmit} style={modalStyles.body}>
                  <div style={{ display: "flex", gap: "16px" }}>
                    <label style={{ fontWeight: 700, color: "#374151" }}>
                      Child Name
                      <input
                        value={selectedChildName}
                        readOnly
                        style={styles.input}
                      />
                    </label>

                    <label style={{ fontWeight: 700, color: "#374151" }}>
                      Guardian Name
                      <input value={parentName} readOnly style={styles.input} />
                    </label>
                  </div>

                  <div style={{ display: "flex", gap: "16px" }}>
                    <label
                      style={{ flex: 1, fontWeight: 700, color: "#374151" }}
                    >
                      Height (cm)
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        style={styles.input}
                        placeholder="Enter height in cm"
                      />
                    </label>

                    <label
                      style={{ flex: 1, fontWeight: 700, color: "#374151" }}
                    >
                      Weight (kg)
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        style={styles.input}
                        placeholder="Enter weight in kg"
                      />
                    </label>
                  </div>

                  {/* Row 2: BMI - moved up since Age is gone, sharing row with Incident might be tight, keeping it clean */}
                  <div style={{ display: "flex", gap: "16px" }}>
                    <label
                      style={{ flex: 1, fontWeight: 700, color: "#374151" }}
                    >
                      BMI
                      <input
                        value={bmi}
                        readOnly
                        style={styles.input}
                        placeholder="Auto-calculated BMI"
                      />
                    </label>
                    <label style={{ flex: 1, fontWeight: 700, color: "#374151" }}>
                      {/* Spacer or we can make BMI take full width or move it */}
                    </label>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "20px" }}>
                    <label style={{ flex: "1 1 100%", fontWeight: 700, color: "#374151" }}>
                      Incident Description
                      <textarea
                        value={incident}
                        onChange={(e) => setIncident(e.target.value)}
                        style={{
                          ...styles.input,
                          minHeight: 100,
                          resize: "vertical",
                        }}
                        placeholder="Describe the incident in detail..."
                      />
                    </label>

                    <label style={{ flex: "1 1 100%", fontWeight: 700, color: "#374151" }}>
                      Upload Report (PDF)
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => fileUpload(e, setImage)}
                          style={{ ...styles.input, marginBottom: 0 }}
                        />
                        {image && (
                          <div style={{ position: 'relative' }}>
                            <iframe
                              src={`http://localhost:5000/${image}`}
                              title="PDF Preview"
                              style={{
                                width: "120px",
                                height: "150px",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                background: "#f8fafc"
                              }}
                            ></iframe>
                            <div style={{ fontSize: '10px', color: '#64748b', textAlign: 'center', marginTop: '4px' }}>PDF Preview</div>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>

                  <div style={modalStyles.footer}>
                    <button
                      type="button"
                      style={{
                        ...modalStyles.cancelBtn,
                        ...(cancelHover ? modalStyles.cancelBtnHover : {}),
                      }}
                      onClick={closeModal}
                      onMouseEnter={() => setCancelHover(true)}
                      onMouseLeave={() => setCancelHover(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        ...modalStyles.submitBtn,
                        ...(submitHover ? modalStyles.submitBtnHover : {}),
                      }}
                      onMouseEnter={() => setSubmitHover(true)}
                      onMouseLeave={() => setSubmitHover(false)}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* -------- View‑Details Modal -------- */}
        <AnimatePresence>
          {showView && viewRecord && (
            <motion.div
              style={modalBase.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeView}
            >
              <motion.div
                style={modalBase.card}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={modalBase.header}>
                  {viewRecord.childName} – Details
                  <span
                    style={{ cursor: "pointer", fontSize: 22 }}
                    onClick={closeView}
                  >
                    ×
                  </span>
                </div>

                <div
                  style={{
                    ...modalBase.body,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 20,
                  }}
                >
                  {/* Left side - Text info */}
                  <div style={{ flex: 1 }}>
                    <p>
                      <strong>Guardian:</strong> {viewRecord.parentName}
                    </p>
                    {/* Age Removed */}
                    <p>
                      <strong>Height:</strong> {viewRecord.heightCm} cm
                    </p>
                    <p>
                      <strong>Weight:</strong> {viewRecord.weightKg} kg
                    </p>
                    <p>
                      <strong>BMI:</strong> {viewRecord.bmi}
                    </p>
                    <p>
                      <strong>Last Incident:</strong> {viewRecord.lastIncident}
                    </p>
                  </div>

                  {/* Right side - PDF preview */}
                  <div>
                    <iframe
                      src={`http://localhost:5000/${viewRecord.image}`}
                      title="PDF Preview"
                      style={{
                        width: "200px",
                        height: "300px",
                        border: "1px solid #ccc",
                        borderRadius: 8,
                      }}
                    ></iframe>
                  </div>
                </div>

                <div style={modalBase.footer}>
                  <button style={modalBase.cancelBtn} onClick={closeView}>
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
