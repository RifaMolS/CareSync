import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Navbar, Badge, Modal, Form } from "react-bootstrap";
import {
  FaPills, FaEye, FaAdjust, FaSignOutAlt, FaSmile, FaMeh, FaFrown,
  FaTrophy, FaStar, FaGraduationCap, FaQuoteLeft, FaSun, FaCloudSun,
  FaMedkit, FaChevronRight, FaRunning, FaClock, FaHeartbeat
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAccessibility } from "./AccessibilityContext";
import AdultNavbar from "./AdultNavbar";
import {
  fetchMedications,
  submitMood,
  fetchGamifiedData,
  fetchSchedule,
  fetchMaterials,
  triggerEmergencyApi,
  awardReward
} from '../services/adultApi';

const AdultDashboard = () => {
  const {
    highContrast, fontSize, bgColor, textColor, cardBg, btnPrimary, btnText,
    subTextColor, mutedTextColor, cardBorder, accentColor,
    toggleContrast, increaseFont
  } = useAccessibility();

  const [medications, setMedications] = useState([]);
  const [gamifiedData, setGamifiedData] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [healthTip, setHealthTip] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || '{}');
  const navigate = useNavigate();
  const profileId = user?.regid;
  const loginId = user?._id;

  const healthTips = [
    "Stay hydrated! Aim for 8 glasses of water today.",
    "A 10-minute walk can boost your mood and energy.",
    "Remember to stretch your legs if you've been sitting for a while.",
    "Deep breathing for 2 minutes can reduce stress significantly.",
    "Eating colorful vegetables provides essential vitamins for your heart.",
    "Connect with a friend or loved one today for a quick chat."
  ];

  const fontStyle = {
    fontSize: fontSize === 'large' ? '1.25rem' : fontSize === 'extra-large' ? '1.5rem' : '1rem'
  };

  useEffect(() => {
    if (!profileId) return;
    loadData();
    setHealthTip(healthTips[Math.floor(Math.random() * healthTips.length)]);
  }, [profileId]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [meds, gamified, mats] = await Promise.all([
        fetchMedications({ adultId: loginId }),
        fetchGamifiedData(profileId),
        fetchMaterials()
      ]);

      setMedications(meds || []);
      setGamifiedData(gamified);
      setMaterials(mats || []);

      if (gamified && gamified.age) {
        const sched = await fetchSchedule(gamified.age);
        setSchedule(sched || []);
      } else {
        const sched = await fetchSchedule();
        setSchedule(sched || []);
      }

    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const celebrate = (message) => {
    setCelebrationMessage(message);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2500);
  };



  const handleMoodSubmit = async (mood) => {
    try {
      await submitMood({ adultId: profileId, mood, note: "Daily Check-in" });
      await awardReward({
        adultId: profileId,
        points: 2,
        badge: `Daily ${mood} Check-in`
      });
      setShowMoodModal(false);
      celebrate(`✨ Thanks for sharing! You earned 2 points!`);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to save mood");
    }
  };

  const handleEmergency = async () => {
    try {
      await triggerEmergencyApi(profileId);
      setShowHelpModal(false);
      alert("Emergency Alert Sent! Help is on the way.");
    } catch (err) {
      alert("Failed to send alert. Please call 911 or staff directly.");
    }
  };

  if (loading && !gamifiedData) return <div className="text-center mt-5"><h1>Loading...</h1></div>;

  return (
    <>
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .animated-card {
          animation: slideInUp 0.6s ease-out;
          transition: all 0.3s ease;
        }

        .animated-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2) !important;
        }

        .stat-card {
          animation: scaleIn 0.5s ease-out;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }

        .stat-card:hover::before {
          left: 100%;
        }

        .stat-card:hover {
          transform: scale(1.08) rotate(2deg);
        }

        .medication-card {
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          position: relative;
        }

        .medication-card:hover {
          transform: scale(1.03);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        .activity-schedule-card {
          transition: all 0.3s ease;
        }

        .activity-schedule-card:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .action-button {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .action-button::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .action-button:hover::after {
          width: 300px;
          height: 300px;
        }

        .action-button:hover {
          transform: scale(1.1);
        }

        .mood-button {
          transition: all 0.3s ease;
        }

        .mood-button:hover {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .celebration-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.3s;
        }

        .celebration-content {
          background: white;
          padding: 40px 60px;
          border-radius: 30px;
          text-align: center;
          animation: bounce 0.6s ease;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .celebration-emoji {
          font-size: 80px;
          animation: pulse 0.8s infinite;
        }

        .badge-item {
          transition: all 0.3s ease;
        }

        .badge-item:hover {
          transform: scale(1.15) rotate(-5deg);
        }

        .quick-action-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .quick-action-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }

        .material-link {
          transition: all 0.2s ease;
          display: inline-block;
        }

        .material-link:hover {
          transform: translateX(10px);
          font-weight: bold;
        }

        .taken-checkmark {
          animation: scaleIn 0.5s ease;
        }

        .floating {
          animation: floating 3s ease-in-out infinite;
        }

        @keyframes floating {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="celebration-overlay" style={{ background: highContrast ? 'rgba(0,0,0,0.95)' : 'rgba(0,0,0,0.8)' }}>
          <div className="celebration-content" style={{ background: highContrast ? '#000' : 'white', border: highContrast ? '4px solid #FFD700' : 'none' }}>
            <div className="celebration-emoji">🎉</div>
            <h2 style={{ color: highContrast ? '#FFD700' : '#6366f1', fontWeight: 'bold', fontSize: '2.5rem', marginTop: '20px' }}>
              {celebrationMessage}
            </h2>
          </div>
        </div>
      )}

      <div style={{ backgroundColor: bgColor, minHeight: "100vh", color: textColor, transition: "0.4s", paddingTop: '90px' }}>
        <AdultNavbar />

        <Container className="py-4" style={fontStyle}>
          {/* Welcome Section */}
          <Row className="mb-4">
            <Col lg={8}>
              <div className="animated-card h-100" style={{
                background: highContrast ? '#000' : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                padding: '50px',
                borderRadius: '40px',
                border: highContrast ? '4px solid #FFD700' : 'none',
                boxShadow: highContrast ? '0 0 30px #FFD700' : '0 25px 60px rgba(79, 70, 229, 0.4)',
                color: highContrast ? '#FFD700' : 'white',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <Badge bg="light" text="dark" className="px-3 py-2 fs-6" style={{ borderRadius: '12px' }}>
                    <FaSun className="me-2 text-warning" /> New Day, New Opportunities
                  </Badge>
                  <h1 className="floating" style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '20px', letterSpacing: '-1.5px' }}>
                    Hello, {user?.name || gamifiedData?.adultname || "Friend"}!
                  </h1>
                  <p style={{ fontSize: '1.6rem', marginBottom: '35px', opacity: 0.95, fontWeight: '500', lineHeight: '1.4' }}>
                    How are you feeling this morning? Your wellness is our priority.
                  </p>
                  <div className="d-flex flex-wrap gap-3">
                    <Button
                      className="mood-button shadow-lg"
                      size="lg"
                      style={{
                        background: highContrast ? '#FFD700' : '#ffffff',
                        border: 'none',
                        color: highContrast ? '#000' : '#4f46e5',
                        fontSize: '1.3rem',
                        padding: '20px 40px',
                        fontWeight: '900',
                        borderRadius: '25px',
                        transition: '0.3s'
                      }}
                      onClick={() => setShowMoodModal(true)}
                    >
                      🌈 Share My Mood
                    </Button>
                    <Button
                      className="action-button"
                      variant={highContrast ? "outline-warning" : "outline-light"}
                      size="lg"
                      style={{
                        border: highContrast ? '4px solid #FFD700' : '2px solid rgba(255,255,255,0.4)',
                        fontSize: '1.3rem',
                        padding: '20px 40px',
                        fontWeight: '800',
                        borderRadius: '25px',
                        backdropFilter: 'blur(8px)',
                        color: highContrast ? '#FFD700' : 'white'
                      }}
                      onClick={() => navigate("/adult/activities")}
                    >
                      🤸 Discovery Center
                    </Button>
                  </div>
                </div>
                {/* Visual accents */}
                <div style={{ position: 'absolute', top: '-120px', right: '-120px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(255,255,255,0.12)', zIndex: 1 }}></div>
                <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', zIndex: 1 }}></div>
              </div>
            </Col>

            <Col lg={4}>
              <Card className="animated-card h-100 border-0" style={{
                borderRadius: '40px',
                background: highContrast ? '#000' : '#ffffff',
                border: highContrast ? '4px solid #FFD700' : 'none',
                boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
                padding: '15px'
              }}>
                <Card.Body className="p-4">
                  <div className="text-center mb-4">
                    <div style={{ background: highContrast ? '#222' : '#f0f9ff', padding: '20px', borderRadius: '30px', display: 'inline-block' }}>
                      <FaTrophy size={50} color={highContrast ? '#FFD700' : '#6366f1'} />
                    </div>
                    <h2 className="mt-3 fw-900" style={{ fontSize: '2rem' }}>Wellness Goal</h2>
                    <p className="text-muted" style={{ fontWeight: '600' }}>Weekly Progress: 85%</p>
                  </div>

                  <div style={{ height: '30px', background: '#e2e8f0', borderRadius: '15px', overflow: 'hidden', marginBottom: '30px' }}>
                    <div style={{ width: '85%', height: '100%', background: highContrast ? '#FFD700' : 'linear-gradient(90deg, #6366f1, #a855f7)', borderRadius: '15px' }}></div>
                  </div>

                  <div className="d-grid">
                    <Button
                      variant={highContrast ? "warning" : "primary"}
                      className="py-3 fw-bold"
                      style={{ borderRadius: '20px', background: highContrast ? '#FFD700' : '#6366f1', color: highContrast ? '#000' : '#fff', border: 'none' }}
                      onClick={() => navigate('/adult/milestones')}
                    >
                      View Full Progress
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Key Metrics Section */}
          <Row className="mb-5 g-4 text-center">
            {[
              { label: "My Star Points", value: gamifiedData?.rewards || 0, icon: <FaStar />, color: "#f59e0b", badge: "Super Learner" },
              { label: "Achievements", value: gamifiedData?.badges?.length || 0, icon: <FaTrophy />, color: "#8b5cf6", badge: "Gold Member" },
              { label: "Daily Activities", value: schedule?.length || 0, icon: <FaRunning />, color: "#3b82f6", badge: "Active Now" }
            ].map((metric, idx) => (
              <Col md={4} key={idx}>
                <Card className="stat-card border-0 h-100" style={{
                  background: highContrast ? '#000' : '#fff',
                  border: highContrast ? '4px solid #FFD700' : 'none',
                  borderRadius: '40px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
                  padding: '30px'
                }}>
                  <div style={{ background: highContrast ? '#222' : `${metric.color}15`, width: '80px', height: '80px', borderRadius: '25px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: metric.color }}>
                    {React.cloneElement(metric.icon, { size: 40 })}
                  </div>
                  <h4 className="text-muted fw-bold mb-1">{metric.label}</h4>
                  <h1 className="fw-900 mb-0" style={{ fontSize: '3.5rem', color: highContrast ? '#FFD700' : metric.color }}>{metric.value}</h1>
                  <Badge bg="light" text="dark" className="mt-3 px-3 py-2" style={{ borderRadius: '10px' }}>{metric.badge}</Badge>
                </Card>
              </Col>
            ))}
          </Row>

          <Row className="g-5">
            {/* Left Column (Activities & Meds) */}
            <Col lg={8}>
              {/* Daily Schedule - Enhanced */}
              <Card className="animated-card shadow-lg border-0 mb-5" style={{
                backgroundColor: cardBg,
                color: textColor,
                borderRadius: '40px',
                overflow: 'hidden'
              }}>
                <Card.Header className="d-flex justify-content-between align-items-center" style={{
                  background: highContrast ? '#111' : 'rgba(99, 102, 241, 0.05)',
                  padding: '35px 45px',
                  borderBottom: 'none'
                }}>
                  <div className="d-flex align-items-center gap-3">
                    <FaClock size={28} className="text-primary" />
                    <h2 style={{ fontWeight: '900', marginBottom: 0, fontSize: '2rem' }}>Today's Journey</h2>
                  </div>
                </Card.Header>
                <Card.Body style={{ padding: '45px' }}>
                  {schedule.length > 0 ? (
                    <div className="d-flex gap-4 pb-3" style={{ overflowX: 'auto' }}>
                      {schedule.map((item, idx) => (
                        <div key={idx} className="activity-schedule-card text-center shadow-sm" style={{
                          minWidth: 260,
                          background: highContrast ? '#222' : '#f8fafc',
                          padding: '35px 25px',
                          borderRadius: '35px',
                          border: highContrast ? '3px solid #FFD700' : '1px solid #eef2ff'
                        }}>
                          <Badge bg="primary" className="mb-3 px-4 py-2 rounded-pill fs-5">{item.time}</Badge>
                          <h4 style={{ fontWeight: '900', marginBottom: '15px' }}>{item.activityName}</h4>
                          <h6 className="text-primary text-uppercase" style={{ letterSpacing: '2px', fontWeight: '800' }}>{item.category}</h6>
                        </div>
                      ))}
                    </div>
                  ) : <h4 className="text-center py-5 text-muted">A quiet day to relax. No scheduled activities yet.</h4>}
                </Card.Body>
              </Card>

              {/* Medication Tracker - Premium Accessibility */}
              <Card className="animated-card shadow-lg border-0" style={{
                backgroundColor: cardBg,
                color: textColor,
                borderRadius: '40px',
                overflow: 'hidden'
              }}>
                <Card.Header className="d-flex justify-content-between align-items-center" style={{
                  background: highContrast ? '#111' : 'rgba(239, 68, 68, 0.05)',
                  padding: '35px 45px',
                  borderBottom: 'none'
                }}>
                  <div className="d-flex align-items-center gap-3">
                    <FaMedkit size={28} className="text-danger" />
                    <h2 style={{ fontWeight: '900', marginBottom: 0, fontSize: '2rem' }}>Health Reminders</h2>
                  </div>
                </Card.Header>
                <Card.Body style={{ padding: '45px' }}>
                  {medications.length > 0 ? (
                    medications.map((med) => {
                      const lastTaken = med.takenHistory?.length ? med.takenHistory[med.takenHistory.length - 1] : null;
                      const takenToday = lastTaken && new Date(lastTaken.date).toDateString() === new Date().toDateString();

                      return (
                        <div key={med._id} className="medication-card d-flex flex-wrap justify-content-between align-items-center mb-4 p-5" style={{
                          background: takenToday ? (highContrast ? '#064e3b' : '#f0fdf4') : (highContrast ? '#000' : '#ffffff'),
                          borderRadius: '35px',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                          border: highContrast ? (takenToday ? '6px solid #10b981' : '4px solid #FFD700') : (takenToday ? '3px solid #10b981' : '2px solid #f1f5f9')
                        }}>
                          <div className="d-flex align-items-center gap-5">
                            <div style={{
                              background: takenToday ? '#10b981' : (highContrast ? '#FFD700' : '#ef4444'),
                              width: '80px',
                              height: '80px',
                              borderRadius: '25px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: highContrast ? '#000' : 'white',
                              fontSize: '2rem'
                            }}>
                              <FaPills />
                            </div>
                            <div>
                              <h3 style={{ fontWeight: "900", fontSize: '1.8rem', color: takenToday ? '#065f46' : textColor }}>{med.name}</h3>
                              <div className="d-flex gap-3 mt-2">
                                <Badge bg="dark" className="px-3 py-2 fs-6">{med.time}</Badge>
                                <Badge bg="secondary" className="px-3 py-2 fs-6">{med.dosage}</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 mt-md-0">
                            {takenToday ? (
                              <div className="d-flex align-items-center gap-3" style={{ color: '#059669', fontWeight: '900', fontSize: '1.5rem' }}>
                                <span>Complete! ✅</span>
                              </div>
                            ) : (
                              <div className="d-flex align-items-center gap-3" style={{ color: '#6366f1', fontWeight: '900', fontSize: '1.5rem' }}>
                                <span>Scheduled ⏳</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })
                  ) : <h4 className="text-opacity-50 text-center py-4">All clear! No medications due right now.</h4>}
                </Card.Body>
              </Card>
            </Col>

            {/* Right Column (Care Team & Actions) */}
            <Col lg={4}>
              {/* Care Team Section - NEW */}
              <Card className="animated-card shadow-lg border-0 mb-5" style={{
                borderRadius: '40px',
                background: highContrast ? '#000' : 'white',
                border: highContrast ? '4px solid #FFD700' : 'none',
                overflow: 'hidden'
              }}>
                <Card.Header className="p-4 bg-transparent border-0 d-flex align-items-center gap-2">
                  <FaEye size={24} className="text-success" />
                  <h3 style={{ fontWeight: '900', marginBottom: 0 }}>My Care Team</h3>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-light rounded-4">
                    <img src="https://ui-avatars.com/api/?name=Care+Giver&background=6366f1&color=fff" alt="Staff" style={{ width: 60, height: 60, borderRadius: '50%' }} />
                    <div>
                      <h5 className="fw-900 mb-0">Senior Care Specialist</h5>
                      <p className="small text-muted mb-0">Ready to assist you 24/7</p>
                    </div>
                  </div>
                  <div className="d-grid gap-2">
                    <Button variant="success" className="py-3 fw-bold" style={{ borderRadius: '18px' }} onClick={() => navigate("/adult/communication")}>
                      Call Support
                    </Button>
                    <Button variant="outline-success" className="py-3 fw-bold" style={{ borderRadius: '18px' }} onClick={() => navigate("/adult/communication")}>
                      Send Message
                    </Button>
                  </div>
                </Card.Body>
              </Card>

              {/* Daily Wellness Challenge - NEW */}
              <Card className="animated-card shadow-lg border-0 mb-5" style={{
                borderRadius: '40px',
                background: highContrast ? '#000' : 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
                color: 'white',
                border: highContrast ? '4px solid #FFD700' : 'none',
                overflow: 'hidden'
              }}>
                <Card.Body className="text-center p-5">
                  <div style={{ background: 'rgba(255,255,255,0.2)', width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaHeartbeat size={40} />
                  </div>
                  <h3 style={{ fontWeight: '900', fontSize: '2rem' }}>Daily Wellness Challenge</h3>
                  <p style={{ opacity: 0.9, fontSize: '1.1rem', marginBottom: '30px' }}>
                    "Take 10 deep breaths and focus on the present moment."
                  </p>
                  <Button
                    onClick={() => navigate("/adult/activities")}
                    className="w-100 py-3"
                    style={{ background: highContrast ? '#FFD700' : 'white', color: highContrast ? '#000' : '#f97316', border: 'none', borderRadius: '20px', fontWeight: '900', fontSize: '1.2rem' }}
                  >
                    Complete Challenge
                  </Button>
                </Card.Body>
              </Card>

              {/* Quick Actions - Premium */}
              <Card className="animated-card shadow-lg border-0 mb-5" style={{
                background: highContrast ? '#000' : '#1e293b',
                color: 'white',
                borderRadius: '40px',
                padding: '20px',
                border: highContrast ? '4px solid #FFD700' : 'none'
              }}>
                <Card.Body>
                  <h3 className="fw-900 mb-4" style={{ color: highContrast ? '#FFD700' : 'white' }}>Quick Support</h3>
                  <div className="d-grid gap-3">
                    <Button
                      onClick={() => setShowHelpModal(true)}
                      variant="danger"
                      className="py-4 d-flex align-items-center justify-content-between px-4 border-0 shadow-lg"
                      style={{ borderRadius: '25px', fontWeight: '900', fontSize: '1.4rem' }}
                    >
                      <span>🚨 GET HELP</span>
                      <FaChevronRight />
                    </Button>
                    <Button
                      onClick={() => navigate("/adult/quiz")}
                      variant="warning"
                      className="py-3 d-flex align-items-center justify-content-between px-4 border-0"
                      style={{ borderRadius: '20px', fontWeight: '800', fontSize: '1.2rem', color: '#000' }}
                    >
                      <span>🧠 Mental Exercise</span>
                      <FaChevronRight />
                    </Button>
                  </div>
                </Card.Body>
              </Card>

              {/* Reading Card */}
              <Card className="animated-card shadow-lg border-0" style={{
                borderRadius: '40px',
                background: highContrast ? '#000' : '#fef3c7',
                border: highContrast ? '4px solid #FFD700' : 'none'
              }}>
                <Card.Header className="p-4 bg-transparent border-0">
                  <h3 className="fw-900 mb-0">📚 Reading Corner</h3>
                </Card.Header>
                <Card.Body className="p-4 pt-0">
                  <div className="d-grid gap-2">
                    {materials.slice(0, 3).map((m, i) => (
                      <a
                        key={i}
                        href={`http://localhost:5000/${m.pdf}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-white text-dark text-decoration-none d-flex align-items-center gap-3"
                        style={{ borderRadius: '15px', fontWeight: '700', border: '1px solid #fde68a' }}
                      >
                        📖 {m.title}
                      </a>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>

        {/* Improved Mood Modal */}
        <Modal show={showMoodModal} onHide={() => setShowMoodModal(false)} centered size="lg">
          <Modal.Header closeButton style={{ background: highContrast ? '#000' : '#4f46e5', color: 'white', border: 'none' }}>
            <Modal.Title className="fw-900 fs-2">Daily Check-in ☀️</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-5" style={{ background: highContrast ? '#111' : '#f8fafc' }}>
            <h2 className="text-center mb-5 fw-800">Choose how you're feeling right now:</h2>
            <div className="d-flex flex-wrap justify-content-center gap-4">
              {[
                { mood: "Happy", icon: "😄", color: "#059669", bg: "#d1fae5" },
                { mood: "Okay", icon: "😐", color: "#d97706", bg: "#fef3c7" },
                { mood: "Sad", icon: "😔", color: "#dc2626", bg: "#fee2e2" }
              ].map((item) => (
                <div
                  key={item.mood}
                  className="mood-button text-center p-5 shadow-sm"
                  onClick={() => handleMoodSubmit(item.mood)}
                  style={{
                    cursor: 'pointer',
                    background: highContrast ? '#000' : item.bg,
                    borderRadius: '40px',
                    width: '200px',
                    border: highContrast ? '4px solid #FFD700' : `3px solid transparent`,
                    transition: '0.3s'
                  }}
                >
                  <div style={{ fontSize: '5rem', marginBottom: '15px' }}>{item.icon}</div>
                  <h3 style={{ fontWeight: '900', color: highContrast ? '#FFD700' : item.color }}>{item.mood}</h3>
                </div>
              ))}
            </div>
          </Modal.Body>
        </Modal>

        {/* Emergency Modal */}
        <Modal show={showHelpModal} onHide={() => setShowHelpModal(false)} centered>
          <Modal.Header closeButton className="bg-danger text-white">
            <Modal.Title className="fw-900">Immediate Help</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-5 text-center">
            <FaMedkit size={80} className="text-danger mb-4" />
            <h3 className="fw-900">Would you like us to call for assistance?</h3>
            <p className="fs-5 text-muted">A senior staff member will be alerted immediately.</p>
            <div className="d-grid gap-3 mt-5">
              <Button variant="danger" size="lg" className="py-3 fw-900" onClick={handleEmergency}>YES, NOTIFY STAFF NOW</Button>
              <Button variant="outline-secondary" size="lg" className="py-2" onClick={() => setShowHelpModal(false)}>No, I'm okay</Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default AdultDashboard;
