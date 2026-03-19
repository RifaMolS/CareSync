import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge } from "react-bootstrap";
import { FaPaperPlane, FaUserMd, FaArrowLeft, FaCircle, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAccessibility } from "./AccessibilityContext";
import AdultNavbar from "./AdultNavbar";

export default function AdultCommunication() {
  const {
    highContrast, fontSize, bgColor, textColor, cardBg, btnPrimary,
    subTextColor, mutedTextColor, accentColor
  } = useAccessibility();

  const [staff, setStaff] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || '{}');
  const adultId = user?._id;

  // Fetch assigned staff
  useEffect(() => {
    if (!adultId) return;
    fetch("http://localhost:5000/demo/adult/get-staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adultId }),
    })
      .then((res) => res.json())
      .then((data) => {
        const assignedStaff = data[0];
        setStaff(assignedStaff);
      })
      .catch((err) => console.error(err));
  }, [adultId]);

  // Fetch chat history
  useEffect(() => {
    if (!staff || !adultId) return;

    const fetchMessages = () => {
      fetch(`http://localhost:5000/demo/messages?userId1=${adultId}&userId2=${staff._id}`)
        .then((res) => res.json())
        .then((data) => {
          setChatHistory(data);
        })
        .catch((err) => console.error(err));
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll for new messages
    return () => clearInterval(interval);
  }, [staff, adultId]);

  // Scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const handleSend = () => {
    if (!draft.trim() || !staff) return;

    const newMessage = {
      from: adultId,
      to: staff._id,
      text: draft,
    };

    fetch("http://localhost:5000/demo/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMessage),
    })
      .then((res) => res.json())
      .then((data) => {
        setChatHistory((prev) => [...prev, data]);
        setDraft("");
      })
      .catch((err) => console.error(err));
  };

  const fontStyle = {
    fontSize: fontSize === 'large' ? '1.25rem' : fontSize === 'extra-large' ? '1.5rem' : '1rem'
  };

  return (
    <>
      <style>{`
        .chat-container {
            border-radius: 30px;
            overflow: hidden;
            box-shadow: 0 20px 50px rgba(0,0,0,0.1);
            background: ${highContrast ? '#000' : 'white'};
            border: ${highContrast ? '2px solid #FFD700' : 'none'};
        }

        .message-bubble {
            padding: 15px 20px;
            border-radius: 20px;
            max-width: 80%;
            position: relative;
            animation: fadeIn 0.3s ease-out;
            margin-bottom: 20px;
            line-height: 1.5;
            font-weight: 500;
        }

        .message-sent {
            background: ${highContrast ? '#FFD700' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'};
            color: ${highContrast ? '#000' : 'white'};
            align-self: flex-end;
            border-bottom-right-radius: 5px;
            box-shadow: 0 5px 15px rgba(99, 102, 241, 0.2);
        }

        .message-received {
            background: ${highContrast ? '#333' : '#f1f5f9'};
            color: ${highContrast ? 'white' : '#1e293b'};
            align-self: flex-start;
            border-bottom-left-radius: 5px;
        }

        .staff-sidebar-card {
            border-radius: 30px;
            background: ${highContrast ? '#000' : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'};
            border: ${highContrast ? '2px solid #FFD700' : 'none'};
            text-align: center;
        }

        .page-header-mini {
            background: ${highContrast ? '#000' : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'};
            padding: 40px 0;
            margin-bottom: 30px;
            border-radius: 0 0 40px 40px;
            color: ${highContrast ? '#FFD700' : 'white'};
            border-bottom: ${highContrast ? '4px solid #FFD700' : 'none'};
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .chat-body::-webkit-scrollbar {
            width: 6px;
        }
        .chat-body::-webkit-scrollbar-thumb {
            background-color: rgba(0,0,0,0.1);
            border-radius: 10px;
        }
      `}</style>

      <div style={{ backgroundColor: bgColor, minHeight: "100vh", color: textColor, transition: "0.3s", paddingTop: '70px' }}>
        <AdultNavbar />

        <div className="page-header-mini shadow-sm">
          <Container>
            <div className="d-flex align-items-center gap-4">
              <Button
                variant={highContrast ? "warning" : "outline-light"}
                onClick={() => navigate(-1)}
                style={{ borderRadius: '15px', color: highContrast ? '#000' : 'white' }}
              >
                <FaArrowLeft className="me-2" /> Back
              </Button>
              <div>
                <h1 style={{ fontWeight: 900, marginBottom: 0 }}>Care Connect</h1>
                <p className="mb-0" style={{ opacity: highContrast ? 1 : 0.75 }}>Instant messaging with your care team</p>
              </div>
            </div>
          </Container>
        </div>

        <Container className="pb-5" style={fontStyle}>
          <Row>
            <Col lg={4} className="mb-4">
              <Card className="staff-sidebar-card shadow-sm h-100 border-0">
                <Card.Body className="p-5">
                  <h4 style={{ fontWeight: 800, marginBottom: '30px' }}>Your Care Provider</h4>
                  {staff ? (
                    <div className="text-center">
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        {staff.image ? (
                          <img
                            src={`http://localhost:5000/${staff.image}`}
                            alt="Staff"
                            style={{
                              width: "150px",
                              height: "150px",
                              borderRadius: "40px",
                              objectFit: "cover",
                              marginBottom: "20px",
                              border: `5px solid ${highContrast ? '#FFD700' : 'white'}`,
                              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '150px',
                            height: '150px',
                            background: '#e2e8f0',
                            borderRadius: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px'
                          }}>
                            <FaUserMd size={80} color="#94a3b8" />
                          </div>
                        )}
                        <div style={{
                          position: 'absolute',
                          bottom: '25px',
                          right: '5px',
                          background: '#22c55e',
                          width: '25px',
                          height: '25px',
                          borderRadius: '50%',
                          border: '4px solid white',
                          boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
                        }}></div>
                      </div>
                      <h2 style={{ fontWeight: 900, marginBottom: '5px' }}>{staff.name}</h2>
                      <Badge pill bg={highContrast ? "warning" : "primary"} text={highContrast ? "dark" : "white"} style={{ padding: '8px 20px', fontSize: '1rem', background: highContrast ? '#FFD700' : '#4f46e5' }}>
                        {staff.role}
                      </Badge>

                      <div className="mt-5 text-start p-4" style={{ background: highContrast ? '#111' : 'white', borderRadius: '20px', border: highContrast ? '2px solid #FFD700' : '1px solid #e2e8f0' }}>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <FaInfoCircle color={highContrast ? "#FFD700" : "#6366f1"} />
                          <span className="fw-bold">Current Status:</span>
                        </div>
                        <p style={{ color: subTextColor, marginBottom: 0 }}>On {staff.shift} Shift. Usually responds within 15 minutes.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary mb-3"></div>
                      <p>Looking up your care team...</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col lg={8}>
              <Card className="chat-container h-100 border-0">
                <Card.Header className="bg-transparent p-4 border-bottom d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <FaCircle color="#22c55e" size={12} />
                    <h4 style={{ fontWeight: 800, marginBottom: 0 }}>Secure Message Line</h4>
                  </div>
                  <small className="fw-bold" style={{ color: mutedTextColor }}>ENCRYPTED</small>
                </Card.Header>

                <Card.Body className="chat-body p-4 d-flex flex-column" style={{ height: '550px', overflowY: 'auto', background: highContrast ? '#111' : '#f8fafc' }}>
                  {chatHistory.length > 0 ? (
                    chatHistory.map((m, i) => (
                      <div
                        key={i}
                        className={`message-bubble ${m.from === adultId ? "message-sent" : "message-received"}`}
                      >
                        <div style={{ wordBreak: 'break-word', fontSize: '1.2rem' }}>{m.text}</div>
                        <div style={{
                          fontSize: "0.75rem",
                          opacity: 0.7,
                          textAlign: m.from === adultId ? 'right' : 'left',
                          marginTop: '5px',
                          fontWeight: '800'
                        }}>
                          {new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-100 d-flex flex-column align-items-center justify-content-center" style={{ color: mutedTextColor }}>
                      <FaPaperPlane size={60} className="mb-4" style={{ opacity: 0.2 }} />
                      <p style={{ fontSize: '1.4rem', fontWeight: 600 }}>No messages yet</p>
                      <p>Say hello to {staff?.name || 'your care team member'}!</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </Card.Body>

                <Card.Footer className="p-4 border-top" style={{ background: highContrast ? '#000' : 'white' }}>
                  <InputGroup>
                    <Form.Control
                      placeholder="Share how you're feeling or ask a question..."
                      style={{
                        borderRadius: '20px 0 0 20px',
                        border: '2px solid #e2e8f0',
                        borderRight: 'none',
                        padding: '20px 30px',
                        fontSize: '1.2rem',
                        background: highContrast ? '#000' : '#fff',
                        color: textColor
                      }}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      disabled={!staff}
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!staff || !draft.trim()}
                      style={{
                        borderRadius: '0 20px 20px 0',
                        padding: '0 40px',
                        background: highContrast ? '#FFD700' : '#4f46e5',
                        border: `2px solid ${highContrast ? '#FFD700' : '#4f46e5'}`,
                        color: highContrast ? '#000' : 'white',
                        fontWeight: 900,
                        fontSize: '1.2rem'
                      }}
                    >
                      SEND <FaPaperPlane className="ms-2" />
                    </Button>
                  </InputGroup>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
