import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Card, Button, Modal, Badge } from "react-bootstrap";
import { FaStar, FaSmile, FaMeh, FaShieldAlt, FaFrown, FaTrophy, FaGamepad, FaRocket, FaPaintBrush, FaAppleAlt, FaCalendarAlt, FaBookOpen, FaExclamationCircle, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Navbar from "../UserHome/Navbar";

const ChildDashboard = () => {
    const [childData, setChildData] = useState(null);
    const [showMoodModal, setShowMoodModal] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const childId = user?.regid;

    const [schedule, setSchedule] = useState([]);
    const [learningMaterials, setLearningMaterials] = useState([]);
    const [medications, setMedications] = useState([]);
    const [showHelpModal, setShowHelpModal] = useState(false);

    // Mini-game states
    const [balloons, setBalloons] = useState([]);
    const [score, setScore] = useState(0);
    const [gameActive, setGameActive] = useState(false);

    useEffect(() => {
        fetchChildData();
    }, []);

    const fetchChildData = async () => {
        if (!childId) return;
        try {
            const res = await axios.post("http://localhost:5000/demo/child/gamified-data", { id: childId });
            setChildData(res.data);

            const schedRes = await axios.post("http://localhost:5000/demo/child/schedule", { age: res.data.age });
            setSchedule(schedRes.data);

            const learnRes = await axios.post("http://localhost:5000/demo/child/learning-materials", {});
            setLearningMaterials(learnRes.data);

            const medsRes = await axios.post("http://localhost:5000/demo/child/medications", { id: childId });
            setMedications(medsRes.data);

        } catch (err) {
            console.error(err);
            setChildData({});
        }
    };

    const markMedicationTaken = async (medId) => {
        try {
            await axios.post("http://localhost:5000/demo/adult/log-medication", { medicationId: medId });
            // Refresh medications
            const medsRes = await axios.post("http://localhost:5000/demo/child/medications", { id: childId });
            setMedications(medsRes.data);

            // Refresh points (backend assigned +50)
            fetchChildData();

            alert("Good job! +50 Points! 🌟");
        } catch (err) {
            console.error(err);
            alert("Could not log medication.");
        }
    };

    const saveGamePoints = async (points, badgeName) => {
        try {
            await axios.post("http://localhost:5000/demo/child/reward", {
                childId,
                points,
                badge: badgeName
            });
            fetchChildData(); // Update total points display
        } catch (err) {
            console.error("Failed to save game points", err);
        }
    };

    const submitMood = async (mood) => {
        try {
            await axios.post("http://localhost:5000/demo/child/mood", {
                childId,
                mood,
                note: "Daily check-in"
            });
            setShowMoodModal(false);
            fetchChildData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEmergencyHelper = async () => {
        try {
            await axios.post("http://localhost:5000/demo/child/emergency-alert", {
                senderId: childId,
                message: "Child requested immediate help from Dashboard!",
                location: "Child Dashboard"
            });
            setShowHelpModal(false);
            alert("Help is on the way! A staff member has been alerted. 🚨");
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please find an adult nearby!");
        }
    };

    // Game Logic
    const startLevel = () => {
        setGameActive(true);
        const colors = ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'];
        const newBalloons = Array.from({ length: 8 }, (_, i) => ({
            id: i,
            color: colors[Math.floor(Math.random() * colors.length)],
            x: Math.random() * 80 + 10,
            y: Math.random() * 60 + 20,
            size: Math.random() * 40 + 60,
            popped: false
        }));
        setBalloons(newBalloons);
    };

    const popBalloon = (id) => {
        setBalloons(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b));
        setScore(s => s + 10);

        // Check if all popped
        setTimeout(() => {
            setBalloons(prev => {
                const remaining = prev.filter(b => !b.popped);
                if (remaining.length === 0 && gameActive) {
                    const levelPoints = 50 + (8 * 10); // Bonus + (8 balloons * 10)
                    setScore(s => s + 50); // Level bonus visualization

                    // Save to Backend
                    saveGamePoints(levelPoints, "Balloon Master 🎈");

                    startLevel(); // Start next level
                }
                return prev;
            });
        }, 300);
    };

    if (!childData) return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '100vh', background: '#E0F7FA' }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{ fontSize: '5rem' }}
            >
                🚀
            </motion.div>
            <h1 className="mt-3 text-secondary">Loading your super dashboard...</h1>
        </div>
    );

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <>
            <Navbar />
            <div style={{
                backgroundColor: "#F0FDFF",
                minHeight: "100vh",
                fontFamily: "'Fredoka', 'Comic Sans MS', cursive",
                paddingBottom: '100px',
                paddingTop: '100px',
                backgroundImage: 'radial-gradient(#B2EBF2 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }}>
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap');
                    
                    .floating {
                        animation: float 3s ease-in-out infinite;
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-15px); }
                    }
                    .game-balloon:hover {
                        transform: scale(1.1);
                        cursor: pointer;
                    }
                    .card-hover:hover {
                        transform: scale(1.03);
                        box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
                    }
                    .custom-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                <Container className="py-5">
                    {/* Header Section */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center mb-5"
                    >
                        <motion.h1
                            className="floating"
                            style={{ fontSize: "4rem", color: "#00ACC1", fontWeight: "700", textShadow: '2px 2px #fff' }}
                        >
                            Yay! Hi {childData.childname}! 🎈
                        </motion.h1>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Button
                                variant="warning"
                                size="lg"
                                className="mt-3 rounded-pill shadow-lg border-4 border-white px-5 py-3"
                                style={{ fontSize: "1.5rem", fontWeight: '600' }}
                                onClick={() => setShowMoodModal(true)}
                            >
                                How are you feeling today? 🤔
                            </Button>
                        </motion.div>
                    </motion.div>
                    <Row>
                        {/* Stats Row */}
                        <Col md={6} className="mb-4">
                            <motion.div
                                variants={sectionVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                            >
                                <Card className="shadow-lg border-0 card-hover" style={{ borderRadius: "25px", backgroundColor: "#FFF9C4" }}>
                                    <Card.Body className="text-center p-5">
                                        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                                            <FaStar size={80} color="#FFD700" className="mb-3" />
                                        </motion.div>
                                        <h2 style={{ fontSize: "2.5rem", color: "#F57F17", fontWeight: '700' }}>My Super Points</h2>
                                        <h1 style={{ fontSize: "5rem", color: "#F9A825", fontWeight: "900" }}>{childData.rewards}</h1>
                                        <p className="lead fw-bold text-muted">You are a rockstar! 🌟</p>
                                    </Card.Body>
                                </Card>
                            </motion.div>
                        </Col>

                        <Col md={6} className="mb-4">
                            <motion.div
                                variants={sectionVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                            >
                                <Card className="shadow-lg border-0 card-hover" style={{ borderRadius: "25px", backgroundColor: "#E1BEE7" }}>
                                    <Card.Body className="text-center p-5">
                                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                                            <FaTrophy size={80} color="#8E24AA" className="mb-3" />
                                        </motion.div>
                                        <h2 style={{ fontSize: "2.5rem", color: "#6A1B9A", fontWeight: '700' }}>Hero Badges</h2>
                                        <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
                                            {childData.badges && childData.badges.length > 0 ? (
                                                childData.badges.map((badge, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        whileHover={{ rotate: 15 }}
                                                        className="bg-white p-3 rounded-circle shadow-sm d-flex flex-column align-items-center justify-content-center"
                                                        style={{ width: "100px", height: "100px", border: "4px solid #AB47BC" }}
                                                    >
                                                        <span style={{ fontSize: "0.9rem", fontWeight: "bold", color: "#8E24AA", lineHeight: '1.2' }}>{typeof badge === 'object' ? badge.name : badge}</span>
                                                        {typeof badge === 'object' && badge.points && <small style={{ fontSize: '0.7rem', color: '#BA68C8' }}>+{badge.points}</small>}
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <p className="h4 text-muted">Complete tasks to earn your first medal! 🏅</p>
                                            )}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </motion.div>
                        </Col>
                    </Row>
                    <motion.div
                        variants={sectionVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="mb-5"
                    >
                        <Card className="shadow-lg border-0 bg-white" style={{ borderRadius: "30px", overflow: 'hidden' }}>
                            <Card.Header className="bg-info text-white border-0 py-3 d-flex align-items-center justify-content-between">
                                <h2 className="mb-0 fw-bold"><FaGamepad className="me-2" /> Fun Zone: Pop the Balloons! 🎈</h2>
                                <Badge bg="light" text="dark" className="fs-5 pill">{score} Points</Badge>
                            </Card.Header>
                            <Card.Body className="p-0 position-relative" style={{ height: '350px', background: 'linear-gradient(to bottom, #E1F5FE, #B3E5FC)' }}>
                                {!gameActive ? (
                                    <div className="d-flex flex-column align-items-center justify-content-center h-100">
                                        <motion.div
                                            animate={{ y: [0, -10, 0] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="mb-4"
                                            style={{ fontSize: '4rem' }}
                                        >
                                            🎮
                                        </motion.div>
                                        <Button
                                            variant="success"
                                            size="lg"
                                            className="rounded-pill shadow px-5"
                                            onClick={startLevel}
                                        >
                                            Start Playing!
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="h-100 w-100 position-relative">
                                        <AnimatePresence>
                                            {balloons.map((b) => !b.popped && (
                                                <motion.div
                                                    key={b.id}
                                                    initial={{ y: 400, opacity: 0, scale: 0.5 }}
                                                    animate={{ y: b.y + '%', x: b.x + '%', opacity: 1, scale: 1 }}
                                                    exit={{ scale: 2, opacity: 0 }}
                                                    className="position-absolute"
                                                    style={{
                                                        width: b.size,
                                                        height: b.size * 1.2,
                                                        background: b.color,
                                                        borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
                                                        boxShadow: 'inset -5px -5px 15px rgba(0,0,0,0.1), inset 5px 5px 10px rgba(255,255,255,0.4)',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        zIndex: 10
                                                    }}
                                                    onClick={() => popBalloon(b.id)}
                                                    whileHover={{ scale: 1.2 }}
                                                >
                                                    <div style={{ width: 2, height: 40, background: 'rgba(0,0,0,0.2)', position: 'absolute', bottom: -35 }}></div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        <div className="position-absolute bottom-0 end-0 p-3">
                                            <Button variant="outline-primary" size="sm" onClick={() => setGameActive(false)}>Stop</Button>
                                        </div>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </motion.div>
                    {/* Medications Section */}
                    {/* {medications.length > 0 && (
                        <motion.div
                            variants={sectionVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="mb-5"
                        >
                            <Card className="shadow-lg border-0 bg-white" style={{ borderRadius: "30px", overflow: 'hidden' }}>
                                <Card.Header className="bg-danger text-white border-0 py-3 d-flex align-items-center justify-content-between">
                                    <h2 className="mb-0 fw-bold">💊 My Medicine</h2>
                                </Card.Header>
                                <Card.Body className="p-4" style={{ backgroundColor: '#FFEBEE' }}>
                                    <Row>
                                        {medications.map((med, idx) => {
                                            const isTakenToday = med.takenHistory && med.takenHistory.some(h => new Date(h.date).toDateString() === new Date().toDateString());
                                            return (
                                                <Col md={6} key={idx} className="mb-3">
                                                    <Card className="border-0 shadow-sm p-3 h-100" style={{ borderRadius: '20px' }}>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <h3 className="fw-bold text-danger">{med.name}</h3>
                                                                <p className="mb-1 text-muted fw-bold">Amount: {med.dosage}</p>
                                                                <p className="mb-0 text-muted"><FaClock className="me-1" /> Time: {med.time}</p>
                                                            </div>
                                                            <Button
                                                                variant={isTakenToday ? "secondary" : "success"}
                                                                size="lg"
                                                                className="rounded-pill fw-bold shadow"
                                                                disabled={isTakenToday}
                                                                onClick={() => markMedicationTaken(med._id)}
                                                            >
                                                                {isTakenToday ? "Taken! 👍" : "I took it! ✅"}
                                                            </Button>
                                                        </div>
                                                    </Card>
                                                </Col>
                                            )
                                        })}
                                    </Row>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    )} */}

                    {/* Fun Zone Section */}




                    {/* Quick Access Grid */}
                    <Row className="mb-5 justify-content-center">
                        {[
                            { label: "My Progress", icon: <FaRocket />, color: "#2196F3", route: "/childmilestones" },
                            { label: "Fun Club", icon: <FaPaintBrush />, color: "#FF9800", route: "/childactivities" },
                        ].map((item, idx) => (
                            <Col md={3} key={idx} className="mb-4">
                                <motion.div
                                    whileHover={{ y: -10 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate(item.route)}
                                >
                                    <Card className="shadow-lg border-0 text-white text-center p-4" style={{
                                        backgroundColor: item.color,
                                        borderRadius: "25px",
                                        cursor: "pointer",
                                        height: '220px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center'
                                    }}>
                                        <Card.Body className="d-flex flex-column align-items-center justify-content-center p-0">
                                            <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>{item.icon}</div>
                                            <h2 className="fw-bold m-0" style={{ fontSize: '2rem' }}>{item.label}</h2>
                                        </Card.Body>
                                    </Card>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>

                    {/* Daily Schedule */}
                    <motion.div
                        variants={sectionVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="mb-5"
                    >
                        <h2 className="fw-bold mb-4" style={{ color: "#00838F" }}><FaCalendarAlt className="me-2" /> What's Happening Today?</h2>
                        <div className="d-flex overflow-auto custom-scrollbar pb-3" style={{ gap: '20px' }}>
                            {schedule.length > 0 ? schedule.map((item, idx) => (
                                <motion.div key={idx} whileHover={{ scale: 1.05 }}>
                                    <Card className="shadow-sm border-0" style={{ minWidth: '260px', backgroundColor: idx % 2 === 0 ? '#E1F5FE' : '#F1F8E9', borderRadius: '25px', height: '100%' }}>
                                        <Card.Body className="text-center p-4">
                                            <Badge bg="info" className="mb-3 px-3 py-2 rounded-pill fs-6">{item.time}</Badge>
                                            <h3 className="fw-bold mb-2" style={{ color: '#006064' }}>{item.activityName}</h3>
                                            <div className="text-muted fw-bold">{item.category}</div>
                                        </Card.Body>
                                    </Card>
                                </motion.div>
                            )) : (
                                <Card className="w-100 p-5 text-center border-0 shadow-sm" style={{ borderRadius: '25px', background: '#f8f9fa' }}>
                                    <h3 className="text-muted">No activities right now. Time for a secret mission! 🕵️‍♂️</h3>
                                </Card>
                            )}
                        </div>
                    </motion.div>

                    {/* Learning Corner */}
                    <motion.div
                        variants={sectionVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <h2 className="fw-bold mb-4" style={{ color: "#5E35B1" }}><FaBookOpen className="me-2" /> My Story Bookshelf</h2>
                        <Row>
                            {learningMaterials.length > 0 ? learningMaterials.map((mat, idx) => (
                                <Col md={3} sm={6} key={idx} className="mb-4">
                                    <motion.div whileHover={{ y: -10 }}>
                                        <Card className="h-100 shadow-lg border-0 overflow-hidden" style={{ borderRadius: '25px' }}>
                                            <div style={{ height: '180px', background: 'linear-gradient(45deg, #ede7f6, #d1c4e9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {mat.image ? (
                                                    <img src={`http://localhost:5000/${mat.image}`} alt={mat.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <span style={{ fontSize: '4rem' }}>📖</span>
                                                )}
                                            </div>
                                            <Card.Body className="text-center">
                                                <h4 className="fw-bold" style={{ color: '#4527A0' }}>{mat.title}</h4>
                                                <Badge bg="light" text="dark" className="mb-3">{mat.subject}</Badge>
                                                <Button
                                                    variant="primary"
                                                    className="w-100 rounded-pill fw-bold"
                                                    href={`http://localhost:5000/${mat.pdf}`}
                                                    target="_blank"
                                                >
                                                    Read Story 📖
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </motion.div>
                                </Col>
                            )) : (
                                <Col className="text-center p-5">
                                    <h3 className="text-muted opacity-50">Checking for new stories... 📚</h3>
                                </Col>
                            )}
                        </Row>
                    </motion.div>

                </Container>

                {/* Emergency Helper Button */}
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}
                >
                    <Button
                        variant="danger"
                        className="shadow-lg border-4 border-white d-flex align-items-center justify-content-center"
                        style={{
                            borderRadius: '50%',
                            width: '90px',
                            height: '90px',
                            fontSize: '2.5rem',
                        }}
                        onClick={() => setShowHelpModal(true)}
                    >
                        🆘
                    </Button>
                </motion.div>

                {/* Mood Modal */}
                <Modal show={showMoodModal} onHide={() => setShowMoodModal(false)} centered size="lg" className="child-modal">
                    <Modal.Header closeButton style={{ backgroundColor: "#B2EBF2", border: 'none' }}>
                        <Modal.Title className="fw-bold fs-2">Hey {childData.childname}, how are you? 🌈</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center p-5" style={{ backgroundColor: "#E0F7FA" }}>
                        <div className="d-flex flex-wrap justify-content-center gap-4">
                            {[
                                { mood: "Happy", icon: <FaSmile />, color: "success", label: "Happy!" },
                                { mood: "Okay", icon: <FaMeh />, color: "warning", label: "Okay" },
                                { mood: "Sad", icon: <FaFrown />, color: "danger", label: "Sad" }
                            ].map((item) => (
                                <motion.div key={item.mood} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Button
                                        variant={`outline-${item.color}`}
                                        className="bg-white rounded-4 p-4 border-2 shadow-sm d-flex flex-column align-items-center"
                                        style={{ width: '160px' }}
                                        onClick={() => submitMood(item.mood)}
                                    >
                                        <div style={{ fontSize: '4rem' }}>{item.icon}</div>
                                        <div className="mt-2 fw-bold fs-4">{item.label}</div>
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </Modal.Body>
                </Modal>

                {/* Help Modal */}
                <Modal show={showHelpModal} onHide={() => setShowHelpModal(false)} centered>
                    <Modal.Header closeButton className="bg-danger text-white border-0">
                        <Modal.Title className="fw-bold">Need Help? 📢</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center p-5">
                        <div style={{ fontSize: '4rem' }} className="mb-3">🆘</div>
                        <h3 className="fw-bold">Should we call a teacher to help you?</h3>
                        <p className="text-muted">A friendly staff member will come right away!</p>
                    </Modal.Body>
                    <Modal.Footer className="justify-content-center border-0 pb-4">
                        <Button variant="outline-secondary" size="lg" className="rounded-pill px-4" onClick={() => setShowHelpModal(false)}>No, I'm okay</Button>
                        <Button variant="danger" size="lg" className="rounded-pill px-5 fw-bold shadow-sm" onClick={handleEmergencyHelper}>YES, HELP ME!</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default ChildDashboard;
