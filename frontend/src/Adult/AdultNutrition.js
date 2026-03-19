import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { FaUtensils, FaArrowLeft, FaAppleAlt, FaClock, FaCheckCircle, FaLeaf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAccessibility } from "./AccessibilityContext";
import AdultNavbar from "./AdultNavbar";

const AdultNutrition = () => {
    const {
        highContrast, fontSize, bgColor, textColor, cardBg, btnPrimary,
        subTextColor, mutedTextColor, accentColor
    } = useAccessibility();

    const [nutrition, setNutrition] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const profileId = user?.regid;

    useEffect(() => {
        fetchNutrition();
    }, [profileId]);

    const fetchNutrition = async () => {
        try {
            if (!profileId) return;
            const res = await fetch('http://localhost:5000/demo/adult/get-nutrition', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adultId: profileId })
            });
            const data = await res.json();
            setNutrition(data.nutrition || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const groupMeals = (data) => {
        const grouped = {};
        data.forEach(item => {
            if (!grouped[item.mealTime]) grouped[item.mealTime] = [];
            grouped[item.mealTime].push(item);
        });
        return grouped;
    };

    const groupedNutrition = groupMeals(nutrition);

    const fontStyle = {
        fontSize: fontSize === 'large' ? '1.25rem' : fontSize === 'extra-large' ? '1.5rem' : '1rem'
    };

    const getMealGradient = (mealTime) => {
        const time = mealTime.toLowerCase();
        if (time.includes('breakfast')) return 'linear-gradient(135deg, #fceabb 0%, #f8b500 100%)';
        if (time.includes('lunch')) return 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
        if (time.includes('dinner')) return 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)';
        return 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)';
    };

    return (
        <>
            <style>{`
                .meal-card {
                    border-radius: 35px;
                    border: none;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    background: ${highContrast ? '#000' : 'white'};
                    overflow: hidden;
                }

                .meal-card:hover {
                    transform: translateY(-12px);
                    box-shadow: 0 25px 45px rgba(0,0,0,0.12) !important;
                }

                .meal-header {
                    padding: 30px;
                    color: white;
                    text-align: center;
                    position: relative;
                }

                .food-item {
                    border-radius: 20px;
                    padding: 20px;
                    background: ${highContrast ? '#222' : '#f8fafc'};
                    margin-bottom: 15px;
                    border: ${highContrast ? '1px solid #FFD700' : '1px solid #e2e8f0'};
                    transition: all 0.2s ease;
                }

                .food-item:hover {
                    background: ${highContrast ? '#333' : '#f1f5f9'};
                    transform: scale(1.02);
                }

                .page-header-nutrition {
                    background: ${highContrast ? '#000' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'};
                    padding: 60px 0;
                    margin-bottom: 40px;
                    border-radius: 0 0 50px 50px;
                    color: ${highContrast ? '#FFD700' : 'white'};
                    text-align: center;
                    border-bottom: ${highContrast ? '4px solid #FFD700' : 'none'};
                }
            `}</style>

            <div style={{ backgroundColor: bgColor, minHeight: "100vh", color: textColor, transition: "0.3s", paddingTop: '70px' }}>
                <AdultNavbar />

                <div className="page-header-nutrition shadow-lg">
                    <Container>
                        <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
                            <FaUtensils size={50} />
                            <h1 style={{ fontWeight: 900, fontSize: '3.5rem', marginBottom: 0 }}>Smart Dining</h1>
                        </div>
                        <p style={{ fontSize: '1.3rem', opacity: highContrast ? 1 : 0.9 }}>Fuel your body with wholesome nutrients. Discover your personalized meal plan below.</p>
                        <Button
                            variant={highContrast ? "warning" : "outline-light"}
                            className="mt-4 px-4 py-2"
                            style={{ borderRadius: '15px', color: highContrast ? '#000' : 'white' }}
                            onClick={() => navigate(-1)}
                        >
                            <FaArrowLeft className="me-2" /> Back
                        </Button>
                    </Container>
                </div>

                <Container className="pb-5" style={fontStyle}>
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-success" style={{ width: '3rem', height: '3rem' }}></div>
                            <h3 className="mt-3">Preparing your menu...</h3>
                        </div>
                    ) : nutrition.length > 0 ? (
                        <Row className="g-4">
                            {Object.entries(groupedNutrition).map(([mealTime, items], idx) => (
                                <Col md={6} lg={4} key={idx}>
                                    <Card className="meal-card h-100 shadow-sm" style={{
                                        border: highContrast ? '2px solid #FFD700' : 'none'
                                    }}>
                                        <div className="meal-header" style={{
                                            background: highContrast ? '#111' : getMealGradient(mealTime),
                                            borderBottom: highContrast ? '2px solid #FFD700' : 'none',
                                            color: highContrast ? '#FFD700' : 'white'
                                        }}>
                                            <div style={{
                                                background: 'rgba(255,255,255,0.2)',
                                                width: '60px',
                                                height: '60px',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: '0 auto 15px',
                                                backdropFilter: 'blur(5px)'
                                            }}>
                                                <FaClock size={25} />
                                            </div>
                                            <h3 style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 0 }}>
                                                {mealTime}
                                            </h3>
                                        </div>
                                        <Card.Body className="p-4">
                                            {items.map((item, i) => (
                                                <div key={i} className="food-item d-flex align-items-center gap-3">
                                                    <div style={{ color: highContrast ? '#FFD700' : '#10b981' }}>
                                                        <FaCheckCircle size={20} />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{item.name}</div>
                                                        <Badge bg="light" text="dark" style={{ border: '1px solid #ddd' }}>{item.category}</Badge>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="mt-4 pt-4 border-top text-center fw-bold small text-uppercase" style={{ color: mutedTextColor, opacity: highContrast ? 1 : 0.75 }}>
                                                <FaLeaf className="me-1" color={highContrast ? "#FFD700" : "#22c55e"} /> Nutrient Dense Choice
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Col className="text-center py-5">
                            <div style={{
                                background: highContrast ? '#000' : '#f8fafc',
                                borderRadius: '30px',
                                padding: '80px',
                                border: highContrast ? '4px dashed #FFD700' : '2px dashed #e2e8f0'
                            }}>
                                <FaAppleAlt size={80} style={{ color: mutedTextColor }} className="mb-4" />
                                <h2 style={{ fontWeight: 800 }}>Harvesting New Ideas</h2>
                                <p style={{ color: subTextColor }}>Your nutritionist is crafting a balanced meal plan for you. Check back soon!</p>
                            </div>
                        </Col>
                    )}
                </Container>
            </div>
        </>
    );
};

export default AdultNutrition;
