import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, ProgressBar, Alert, Badge as BootstrapBadge } from "react-bootstrap";
import { FaGraduationCap, FaArrowLeft, FaCheckCircle, FaTimesCircle, FaTrophy, FaLightbulb, FaBrain, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAccessibility } from "./AccessibilityContext";
import AdultNavbar from "./AdultNavbar";

const AdultQuiz = () => {
    const {
        highContrast, fontSize, bgColor, textColor, cardBg, btnPrimary, btnText,
        subTextColor, mutedTextColor, accentColor
    } = useAccessibility();

    const [quizzes, setQuizzes] = useState([]);
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [loading, setLoading] = useState(true);
    const [resultMsg, setResultMsg] = useState("");
    const [gamifiedData, setGamifiedData] = useState(null);

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const profileId = user?.regid;

    useEffect(() => {
        fetchQuizzes();
        fetchUserData();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const res = await fetch('http://localhost:5000/demo/adult/get-quizzes');
            const data = await res.json();
            setQuizzes(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserData = async () => {
        try {
            const res = await fetch('http://localhost:5000/demo/adult/gamified-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: profileId })
            });
            const data = await res.json();
            setGamifiedData(data);
        } catch (err) {
            console.error(err);
        }
    };

    const isQuizCompleted = (quizTitle) => {
        if (!gamifiedData || !gamifiedData.badges) return false;
        return gamifiedData.badges.some(b =>
            (typeof b === 'string' && b.includes(quizTitle)) ||
            (typeof b === 'object' && b.name.includes(quizTitle))
        );
    };

    const handleStartQuiz = (quiz) => {
        setActiveQuiz(quiz);
        setCurrentQuestionIndex(0);
        setScore(0);
        setQuizFinished(false);
        setSelectedOption(null);
        setIsCorrect(null);
    };

    const handleOptionClick = (option) => {
        if (selectedOption !== null) return;

        const correct = option === activeQuiz.questions[currentQuestionIndex].correctAnswer;
        setSelectedOption(option);
        setIsCorrect(correct);
        if (correct) setScore(score + 1);

        setTimeout(() => {
            if (currentQuestionIndex + 1 < activeQuiz.questions.length) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedOption(null);
                setIsCorrect(null);
            } else {
                finishQuiz(score + (correct ? 1 : 0));
            }
        }, 1500);
    };

    const finishQuiz = async (finalScore) => {
        setQuizFinished(true);
        try {
            const res = await fetch('http://localhost:5000/demo/adult/submit-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adultId: profileId,
                    quizId: activeQuiz._id,
                    score: finalScore,
                    totalQuestions: activeQuiz.questions.length
                })
            });
            const data = await res.json();
            setResultMsg(data.message);
        } catch (err) {
            console.error(err);
            setResultMsg("Incredible effort! You've sharpened your mind today.");
        }
    };

    const fontStyle = {
        fontSize: fontSize === 'large' ? '1.25rem' : fontSize === 'extra-large' ? '1.5rem' : '1rem'
    };

    return (
        <>
            <style>{`
                @keyframes bounceIn {
                    0% { transform: scale(0.3); opacity: 0; }
                    50% { transform: scale(1.05); opacity: 1; }
                    70% { transform: scale(0.9); }
                    100% { transform: scale(1); }
                }

                @keyframes slideRight {
                    from { transform: translateX(-30px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                .quiz-card {
                    animation: slideRight 0.5s ease-out;
                    transition: all 0.3s ease;
                    border: none;
                    border-radius: 30px;
                    overflow: hidden;
                }

                .quiz-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
                }

                .option-btn {
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    border-radius: 20px !important;
                    margin-bottom: 15px;
                    padding: 20px 25px !important;
                    font-weight: 600 !important;
                    border-width: 2px !important;
                }

                .option-btn:hover:not(:disabled) {
                    transform: translateX(10px) scale(1.02);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }

                .option-btn.correct {
                    background-color: #dcfce7 !important;
                    border-color: #22c55e !important;
                    color: #166534 !important;
                    animation: bounceIn 0.5s;
                }

                .option-btn.incorrect {
                    background-color: #fee2e2 !important;
                    border-color: #ef4444 !important;
                    color: #991b1b !important;
                }

                .quiz-header {
                    background: ${highContrast ? '#000' : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'};
                    padding: 60px 0;
                    margin-bottom: 40px;
                    border-radius: 0 0 50px 50px;
                    color: ${highContrast ? '#FFD700' : 'white'};
                    text-align: center;
                    border-bottom: ${highContrast ? '4px solid #FFD700' : 'none'};
                }

                .trophy-glow {
                    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.6));
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
            `}</style>

            <div style={{ backgroundColor: bgColor, minHeight: "100vh", color: textColor, transition: "0.3s", paddingTop: '70px' }}>
                <AdultNavbar />

                {!activeQuiz ? (
                    <>
                        <div className="quiz-header shadow-lg">
                            <Container>
                                <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
                                    <FaBrain size={50} />
                                    <h1 style={{ fontWeight: 900, marginBottom: 0, fontSize: '3.5rem' }}>Brain Power</h1>
                                </div>
                                <p style={{ fontSize: '1.3rem', opacity: highContrast ? 1 : 0.9 }}>Keep your memory sharp and earn star points with fun daily challenges!</p>
                                <Button
                                    variant={highContrast ? "warning" : "outline-light"}
                                    onClick={() => navigate(-1)}
                                    className="mt-4 px-4 py-2"
                                    style={{ borderRadius: '15px', color: highContrast ? '#000' : 'white' }}
                                >
                                    <FaArrowLeft className="me-2" /> Back to Dashboard
                                </Button>
                            </Container>
                        </div>

                        <Container className="pb-5" style={fontStyle}>
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                <Row className="g-4">
                                    {quizzes.length > 0 ? quizzes.map((quiz) => (
                                        <Col md={6} lg={4} key={quiz._id}>
                                            <Card className="quiz-card h-100 shadow-sm" style={{
                                                backgroundColor: cardBg,
                                                color: textColor,
                                                background: highContrast ? '#000' : 'white',
                                                border: highContrast ? '2px solid #FFD700' : 'none'
                                            }}>
                                                <Card.Body className="p-4 d-flex flex-column text-center">
                                                    <div style={{
                                                        background: highContrast ? '#333' : '#f5f3ff',
                                                        width: '70px',
                                                        height: '70px',
                                                        borderRadius: '20px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        margin: '0 auto 20px',
                                                        color: highContrast ? '#FFD700' : '#6366f1'
                                                    }}>
                                                        <FaLightbulb size={30} />
                                                    </div>
                                                    <h3 style={{ fontWeight: 800 }}>{quiz.title}</h3>
                                                    <div className="d-flex justify-content-center gap-2 mb-3">
                                                        <BootstrapBadge pill bg="secondary">{quiz.category}</BootstrapBadge>
                                                        <BootstrapBadge pill bg="info">{quiz.questions.length} Qs</BootstrapBadge>
                                                    </div>

                                                    <div className="mt-auto pt-4">
                                                        <div className="mb-3 d-flex align-items-center justify-content-center gap-2">
                                                            <FaStar color="#f59e0b" />
                                                            <span style={{ fontWeight: 700 }}>Worth {quiz.pointsAwarded} Points</span>
                                                        </div>
                                                        {isQuizCompleted(quiz.title) ? (
                                                            <BootstrapBadge bg="success" pill style={{ padding: '10px 20px' }}>Completed ✅</BootstrapBadge>
                                                        ) : (
                                                            <Button
                                                                className="w-100 py-3"
                                                                variant={highContrast ? "warning" : "primary"}
                                                                style={{
                                                                    borderRadius: '18px',
                                                                    fontWeight: 800,
                                                                    background: highContrast ? '#FFD700' : '#4f46e5',
                                                                    color: highContrast ? '#000' : '#fff',
                                                                    border: 'none'
                                                                }}
                                                                onClick={() => handleStartQuiz(quiz)}
                                                            >
                                                                Start Challenge
                                                            </Button>
                                                        )}
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    )) : (
                                        <Col className="text-center py-5">
                                            <h3>No fresh challenges yet. Check back soon!</h3>
                                        </Col>
                                    )}
                                </Row>
                            )}
                        </Container>
                    </>
                ) : quizFinished ? (
                    <Container className="py-5 text-center">
                        <div className="trophy-glow mb-5">
                            <FaTrophy size={120} color="#FFD700" />
                        </div>
                        <h1 style={{ fontWeight: 900, fontSize: '3.5rem' }}>Splendid Work!</h1>
                        <h2 className="mb-4">You scored {score} out of {activeQuiz.questions.length}</h2>

                        <div style={{
                            maxWidth: '600px',
                            margin: '0 auto',
                            background: highContrast ? '#111' : '#f8fafc',
                            padding: '30px',
                            borderRadius: '30px',
                            border: highContrast ? '2px solid #FFD700' : '1px solid #e2e8f0'
                        }}>
                            <h4 style={{ color: highContrast ? '#FFD700' : '#4f46e5', marginBottom: '15px' }}>"{resultMsg || "Mental exercise complete!"}"</h4>
                            <p style={{ color: subTextColor }}>Consistent brain training is key to maintaining cognitive health and memory.</p>
                        </div>

                        <div className="mt-5 d-flex justify-content-center gap-3">
                            <Button
                                variant={highContrast ? "warning" : "primary"}
                                size="lg"
                                style={{ borderRadius: '20px', padding: '15px 40px', fontWeight: 800, color: highContrast ? '#000' : '#fff', background: highContrast ? '#FFD700' : '' }}
                                onClick={() => setActiveQuiz(null)}
                            >
                                More Challenges
                            </Button>
                            <Button
                                variant="outline-dark"
                                size="lg"
                                style={{ borderRadius: '20px', padding: '15px 40px', fontWeight: 800 }}
                                onClick={() => navigate('/adult/dashboard')}
                            >
                                Dashboard
                            </Button>
                        </div>
                    </Container>
                ) : (
                    <Container className="py-5">
                        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <Button variant="link" onClick={() => setActiveQuiz(null)} style={{ color: textColor, textDecoration: 'none' }}>
                                    <FaArrowLeft className="me-2" /> Quit Quiz
                                </Button>
                                <BootstrapBadge pill bg="primary" style={{ padding: '10px 20px', fontSize: '1rem' }}>
                                    Progress: {currentQuestionIndex + 1} / {activeQuiz.questions.length}
                                </BootstrapBadge>
                            </div>

                            <ProgressBar
                                now={((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}
                                className="mb-5 shadow-sm"
                                style={{ height: '15px', borderRadius: '10px' }}
                                variant="success"
                            />

                            <Card className="quiz-card shadow-lg p-5" style={{
                                backgroundColor: cardBg,
                                color: textColor,
                                background: highContrast ? '#000' : 'white',
                            }}>
                                <Card.Body className="p-0">
                                    <h2 className="text-center mb-5" style={{ fontWeight: 800 }}>
                                        {activeQuiz.questions[currentQuestionIndex].questionText}
                                    </h2>

                                    <div className="d-grid gap-3">
                                        {activeQuiz.questions[currentQuestionIndex].options.map((option, idx) => {
                                            let className = "option-btn ";
                                            let icon = null;

                                            if (selectedOption !== null) {
                                                if (option === activeQuiz.questions[currentQuestionIndex].correctAnswer) {
                                                    className += "correct";
                                                    icon = <FaCheckCircle />;
                                                } else if (selectedOption === option) {
                                                    className += "incorrect";
                                                    icon = <FaTimesCircle />;
                                                }
                                            }

                                            return (
                                                <Button
                                                    key={idx}
                                                    variant={highContrast ? "warning" : (selectedOption !== null ? "outline-primary" : "outline-primary")}
                                                    className={className}
                                                    onClick={() => handleOptionClick(option)}
                                                    disabled={selectedOption !== null}
                                                    style={highContrast && selectedOption === null ? { borderColor: '#FFD700', color: '#FFD700', background: 'transparent' } : {}}
                                                >
                                                    <div className="d-flex justify-content-between align-items-center w-100">
                                                        <span>{option}</span>
                                                        {icon}
                                                    </div>
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </Container>
                )}
            </div>
        </>
    );
};

export default AdultQuiz;
