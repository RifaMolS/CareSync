import React, { useEffect, useState } from "react";
import ParentSide from "./ParentSide";
import ParentNav from "./ParentNav";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { FaUtensils, FaPlus, FaCheckCircle, FaClock, FaUser } from "react-icons/fa";

export default function NutritionFeed() {
  const [auth, setAuth] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  const [staffnutrition, setStaffnutrition] = useState([]);
  const [wards, setWards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    mealTime: "Breakfast",
    wardId: ""
  });

  const parentId = auth?.regid;

  const fetchNutrition = () => {
    if (!parentId) return;
    axios.post("http://localhost:5000/demo/getfoodbyparentid", { parentId })
      .then((res) => {
        setStaffnutrition(res.data.nutrition || []);
      })
      .catch((err) => console.error("Error:", err));
  };

  const fetchWards = async () => {
    try {
      const childRes = await axios.post("http://localhost:5000/demo/getChildrenByParentId", { parentId });
      const children = childRes.data;

      const adultRes = await axios.post("http://localhost:5000/demo/getAdultsByParentId", { parentId });
      const adults = adultRes.data;

      const combined = [
        ...children.map(c => ({ id: c._id, name: c.childname, type: 'child' })),
        ...adults.map(a => ({ id: a._id, name: a.adultname, type: 'adult' }))
      ];
      setWards(combined);
    } catch (err) {
      console.error("Error fetching wards:", err);
    }
  };

  useEffect(() => {
    fetchNutrition();
    fetchWards();
  }, [parentId]);

  const handleAddFood = async (e) => {
    e.preventDefault();
    const selectedWard = wards.find(w => w.id === formData.wardId);
    if (!selectedWard) return alert("Please select a family member.");

    const payload = {
      name: formData.name,
      category: formData.category,
      mealTime: formData.mealTime,
      type: selectedWard.type === 'child' ? 'Child' : 'Adult',
      childId: selectedWard.type === 'child' ? selectedWard.id : undefined,
      adultId: selectedWard.type === 'adult' ? selectedWard.id : undefined
    };

    try {
      const res = await axios.post("http://localhost:5000/demo/food", payload);
      if (res.status === 201) {
        alert("Nutrition record added! Staff will review it shortly. 🥗");
        setShowModal(false);
        setFormData({ name: "", category: "", mealTime: "Breakfast", wardId: "" });
        fetchNutrition();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add nutrition record.");
    }
  };

  const groupNutrition = (data) => {
    const grouped = {};
    data.forEach((item) => {
      const wardName = item.childId?.regid?.childname || item.adultId?.regid?.adultname || "Unknown";
      if (!grouped[wardName]) grouped[wardName] = [];
      grouped[wardName].push(item);
    });
    return grouped;
  };

  const groupedData = groupNutrition(staffnutrition);

  const styles = {
    container: {
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      fontFamily: "'Inter', system-ui, sans-serif"
    },
    header: {
      background: "linear-gradient(135deg, #f97316 0%, #fbbf24 100%)",
      color: "white",
      padding: '3rem 2rem',
      borderRadius: '24px',
      boxShadow: '0 10px 25px -5px rgba(249, 115, 22, 0.2)',
      textAlign: 'left',
      position: 'relative',
      overflow: 'hidden'
    },
    card: {
      background: "#fff",
      padding: "1.5rem",
      borderRadius: "20px",
      border: "1px solid #f1f5f9",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
      transition: "all 0.3s ease",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%"
    }
  };

  return (
    <div className="container-fluid p-0" style={styles.container}>
      <ParentSide />
      <div className="content" style={{ marginLeft: "260px", flex: 1, overflowY: "auto" }}>
        <ParentNav />

        <div className="container-fluid px-4 py-4" style={{ maxWidth: '1400px' }}>
          <div style={styles.header} className="d-flex justify-content-between align-items-center flex-wrap gap-4">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h1 style={{ fontSize: '2.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>Nutrition Diary 🥗</h1>
              <p style={{ opacity: 0.9, fontSize: '1.2rem' }}>Log meals and monitor dietary updates from staff.</p>
            </div>
            <button
              className="btn btn-light btn-lg d-flex align-items-center gap-2"
              style={{ borderRadius: '15px', fontWeight: '700', padding: '1rem 2rem', border: 'none', color: '#f97316', zIndex: 1 }}
              onClick={() => setShowModal(true)}
            >
              <FaPlus /> Add New Entry
            </button>
          </div>

          <div className="mt-5">
            {Object.entries(groupedData).map(([wardName, items]) => (
              <div key={wardName} className="mb-5">
                <h2 className="mb-4 d-flex align-items-center gap-2" style={{ color: '#1e293b', fontWeight: 800 }}>
                  <FaUser size={24} color="#f97316" /> {wardName}'s Meals
                </h2>
                <div className="row g-4">
                  {items.map((item, index) => (
                    <div className="col-md-6 col-lg-4" key={index}>
                      <div style={styles.card} className="hover-card">
                        <div>
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <span className="badge" style={{ backgroundColor: '#fff7ed', color: '#c2410c', border: '1px solid #ffedd5', padding: '0.5rem 1rem', borderRadius: '10px' }}>
                              <FaClock className="me-2" /> {item.mealTime}
                            </span>
                            {item.isViewed ? (
                              <span className="text-success small fw-bold d-flex align-items-center gap-1">
                                <FaCheckCircle /> Staff Reviewed
                              </span>
                            ) : (
                              <span className="text-warning small fw-bold d-flex align-items-center gap-1">
                                <FaClock /> Pending Review
                              </span>
                            )}
                          </div>
                          <h4 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>{item.name}</h4>
                          <p className="text-muted small mb-0">{item.category}</p>
                        </div>
                        <div className="mt-3 pt-3 border-top d-flex align-items-center justify-content-between">
                          <span className="text-muted small">Date: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                          <span style={{ fontSize: '1.2rem' }}>{item.mealTime?.toLowerCase() === 'breakfast' ? '🍳' : item.mealTime?.toLowerCase() === 'lunch' ? '🍽️' : item.mealTime?.toLowerCase() === 'dinner' ? '🍲' : '🍟'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {Object.keys(groupedData).length === 0 && (
              <div className="text-center py-5" style={{ background: '#fff', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                <FaUtensils size={60} color="#cbd5e1" className="mb-3" />
                <h3 className="fw-bold text-secondary">Your nutrition diary is empty</h3>
                <p className="text-muted">Start by adding your first meal entry above!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Food Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="md">
        <Modal.Header closeButton style={{ borderBottom: 'none', padding: '2rem 2rem 1rem' }}>
          <Modal.Title className="fw-bold" style={{ fontSize: '1.8rem' }}>Add Nutrition Record 🥗</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '1rem 2rem 2rem' }}>
          <Form onSubmit={handleAddFood}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-secondary">Family Member</Form.Label>
              <Form.Select
                value={formData.wardId}
                onChange={(e) => setFormData({ ...formData, wardId: e.target.value })}
                required
                style={{ borderRadius: '12px', padding: '0.75rem', backgroundColor: '#f8fafc' }}
              >
                <option value="">Select Ward...</option>
                {wards.map(w => (
                  <option key={w.id} value={w.id}>{w.name} ({w.type})</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-secondary">Meal Time</Form.Label>
              <Form.Select
                value={formData.mealTime}
                onChange={(e) => setFormData({ ...formData, mealTime: e.target.value })}
                required
                style={{ borderRadius: '12px', padding: '0.75rem', backgroundColor: '#f8fafc' }}
              >
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Snacks</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-secondary">Food Item Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Grilled Chicken Salad"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={{ borderRadius: '12px', padding: '0.75rem', backgroundColor: '#f8fafc' }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-secondary">Nutrition Category / Notes</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. High Protein, Low Carb"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{ borderRadius: '12px', padding: '0.75rem', backgroundColor: '#f8fafc' }}
              />
            </Form.Group>

            <Button
              className="w-100 py-3 fw-bold"
              type="submit"
              style={{ backgroundColor: '#f97316', border: 'none', borderRadius: '12px', fontSize: '1.1rem' }}
            >
              Log Nutrition Entry
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <style>{`
                .hover-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1) !important;
                }
            `}</style>
    </div>
  );
}
