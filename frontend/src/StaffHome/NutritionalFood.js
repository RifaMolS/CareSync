import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StaffSide from "./StaffSide";
import StaffNav from "./StaffNav";
import axios from "axios";

export default function NutritionalFood() {
  const [foods, setFoods] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [auth, setAuth] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });
  const staffId = auth?._id;

  useEffect(() => {
    if (!staffId) return;

    axios.post("http://localhost:5000/demo/foodview", { staffId })
      .then((res) => {
        setFoods(res.data);
      })
      .catch((err) => {
        console.error("Error fetching foods:", err);
      });
  }, [refresh, staffId]);

  const handleMarkViewed = async (foodId) => {
    try {
      const res = await axios.post("http://localhost:5000/demo/adult/mark-food-viewed", { foodId });
      if (res.status === 200) {
        setRefresh(prev => prev + 1);
      }
    } catch (err) {
      console.error("Error marking food as viewed:", err);
      alert("Failed to acknowledge nutrition record.");
    }
  };

  const getMealIcon = (mealTime) => {
    switch (mealTime?.toLowerCase()) {
      case "breakfast": return "🍳";
      case "lunch": return "🍽️";
      case "snacks": return "🍟";
      case "dinner": return "🍲";
      default: return "🍴";
    }
  };

  const groupedFoods = foods.reduce((acc, food) => {
    // Determine ward name
    const wardName = food.childId?.regid?.childname || food.adultId?.regid?.adultname || "Unknown Ward";
    const key = wardName;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(food);
    return acc;
  }, {});

  const styles = {
    container: {
      backgroundColor: "#f3f4f6",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
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
    subtitle: {
      opacity: 0.9,
      fontSize: "1.1rem",
    },
    sectionCard: {
      backgroundColor: "#ffffff",
      borderRadius: "1rem",
      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
      overflow: "hidden",
      marginBottom: "2rem",
      border: "1px solid #e5e7eb"
    },
    sectionHeader: {
      backgroundColor: "#f0fdf4",
      color: "#15803d",
      padding: "1rem 1.5rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "1.25rem",
      fontWeight: "700",
      borderBottom: "1px solid #dcfce7"
    },
    foodGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "1.5rem",
      padding: "1.5rem",
    },
    foodItem: {
      backgroundColor: "white",
      borderRadius: "1rem",
      border: "1px solid #f3f4f6",
      padding: "1.25rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
      transition: "all 0.2s",
      position: "relative"
    },
    actionBtn: {
      border: "none",
      borderRadius: "0.5rem",
      padding: "0.6rem 1rem",
      cursor: "pointer",
      fontSize: "0.9rem",
      fontWeight: "700",
      width: "100%",
      transition: "all 0.2s"
    },
    viewedBadge: {
      position: "absolute",
      top: "10px",
      right: "10px",
      fontSize: "0.75rem",
      padding: "0.2rem 0.5rem",
      borderRadius: "1rem",
      fontWeight: "bold"
    }
  };

  return (
    <div className="container-fluid position-relative d-flex p-0" style={styles.container}>
      <StaffSide />
      <div className="content" style={{ flex: 1, overflowY: "auto" }}>
        <StaffNav />

        <div style={styles.header}>
          <div className="container">
            <h1 style={styles.title}>Nutritional Monitoring</h1>
            <p style={styles.subtitle}>Review and acknowledge nutrition updates from guardians.</p>
          </div>
        </div>

        <div className="container pb-5">
          {Object.entries(groupedFoods).map(([wardName, items]) => (
            <div key={wardName} style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <span>👤 {wardName}</span>
              </div>

              <div style={styles.foodGrid}>
                {items.map((food) => (
                  <motion.div
                    key={food._id}
                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    style={styles.foodItem}
                  >
                    {food.isViewed && (
                      <div style={{ ...styles.viewedBadge, backgroundColor: "#dcfce7", color: "#166534" }}>
                        Viewed ✅
                      </div>
                    )}

                    <div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span style={{ fontSize: "1.2rem" }}>{getMealIcon(food.mealTime)}</span>
                        <span className="fw-bold text-muted small text-uppercase">{food.mealTime}</span>
                      </div>
                      <h5 style={{ fontWeight: "800", color: "#1f2937", marginBottom: "0.5rem" }}>{food.name}</h5>
                      <p className="text-secondary small mb-3">
                        <span className="badge bg-light text-dark border me-2">{food.category}</span>
                        {food.type && <span className="badge bg-info text-white">{food.type}</span>}
                      </p>
                    </div>

                    <div className="mt-2 text-center">
                      {!food.isViewed ? (
                        <button
                          onClick={() => handleMarkViewed(food._id)}
                          style={{ ...styles.actionBtn, background: "#10b981", color: "white" }}
                        >
                          Mark as Viewed
                        </button>
                      ) : (
                        <div className="text-success fw-bold py-2">
                          Acknowledged
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

          {Object.keys(groupedFoods).length === 0 && (
            <div className="text-center py-5">
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🍽️</div>
              <h3 className="text-dark fw-bold">No Nutrition Records</h3>
              <p className="text-muted" style={{ fontSize: "1.1rem" }}>Ward guardians haven't added any food updates for you to review yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
