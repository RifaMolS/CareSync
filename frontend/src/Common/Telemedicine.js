import React, { useEffect, useRef, useState } from "react";
import { Button, Container, Row, Col, Card, Form } from "react-bootstrap";
import Peer from "simple-peer";
import io from "socket.io-client";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaPhone, FaPhoneSlash, FaCopy, FaVideo } from 'react-icons/fa';

// Connect to the backend socket server
const socket = io.connect("http://localhost:5000");

// Polyfill for simple-peer in CRA5 if needed (generally explicit import helps)
// Note: If you see "process is not defined" errors, we need a webpack update. 
// For now, let's assume standard React environment or compatible browser APIs.

const Telemedicine = () => {
    const [me, setMe] = useState("");
    const [stream, setStream] = useState();
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const [idToCall, setIdToCall] = useState("");
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState("");

    // Video Refs
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {
        // Get user media (Video/Audio)
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream);
            if (myVideo.current) {
                myVideo.current.srcObject = stream;
            }
        }).catch(err => console.error("Failed to get local stream", err));

        socket.on("connect", () => {
            setMe(socket.id);
        });

        socket.on("callUser", (data) => {
            setReceivingCall(true);
            setCaller(data.from);
            setName(data.name);
            setCallerSignal(data.signal);
        });
    }, []);

    const callUser = (id) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        });

        peer.on("signal", (data) => {
            socket.emit("callUser", {
                userToCall: id,
                signalData: data,
                from: me,
                name: name
            });
        });

        peer.on("stream", (stream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = stream;
            }
        });

        socket.on("callAccepted", (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
        });

        connectionRef.current = peer;
    };

    const answerCall = () => {
        setCallAccepted(true);
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        });

        peer.on("signal", (data) => {
            socket.emit("answerCall", { signal: data, to: caller });
        });

        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream;
        });

        peer.signal(callerSignal);
        connectionRef.current = peer;
    };

    const leaveCall = () => {
        setCallEnded(true);
        if (connectionRef.current) connectionRef.current.destroy();
        window.location.reload();
    };

    return (
        <Container className="py-5" style={{ backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
            <h1 className="text-center text-primary mb-4"><FaVideo /> Telemedicine Consultation</h1>

            <Row className="justify-content-center">
                {/* My Video */}
                <Col md={6} className="d-flex justify-content-center mb-3">
                    <Card className="p-2 shadow border-0">
                        <Card.Header className="bg-white border-0 text-center"><h5>My Camera</h5></Card.Header>
                        <div className="video-container" style={{ width: "300px", height: "225px", background: "black" }}>
                            {stream && (
                                <video playsInline muted ref={myVideo} autoPlay style={{ width: "100%", height: "100%" }} />
                            )}
                        </div>
                    </Card>
                </Col>

                {/* Patient/Doctor Video */}
                <Col md={6} className="d-flex justify-content-center mb-3">
                    <Card className="p-2 shadow border-0">
                        <Card.Header className="bg-white border-0 text-center"><h5>Remote Video</h5></Card.Header>
                        <div className="video-container" style={{ width: "300px", height: "225px", background: "black" }}>
                            {callAccepted && !callEnded ? (
                                <video playsInline ref={userVideo} autoPlay style={{ width: "100%", height: "100%" }} />
                            ) : (
                                <div className="d-flex align-items-center justify-content-center h-100 text-white">
                                    Waiting for connection...
                                </div>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-4 justify-content-center">
                <Col md={6}>
                    <Card className="text-center p-4 shadow-sm border-0">
                        <h4>Connection Info</h4>
                        <Form.Group className="mb-3">
                            <Form.Label>My Name</Form.Label>
                            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
                        </Form.Group>

                        <div className="mb-3">
                            <Form.Label>My ID: <span className="fw-bold text-success">{me}</span></Form.Label>
                            <CopyToClipboard text={me}>
                                <Button variant="outline-secondary" size="sm" className="ms-2"><FaCopy /> Copy ID</Button>
                            </CopyToClipboard>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label>ID to Call</Form.Label>
                            <Form.Control type="text" value={idToCall} onChange={(e) => setIdToCall(e.target.value)} placeholder="Paste ID here" />
                        </Form.Group>

                        <div className="d-flex justify-content-center gap-3">
                            {callAccepted && !callEnded ? (
                                <Button variant="danger" onClick={leaveCall} size="lg"><FaPhoneSlash /> End Call</Button>
                            ) : (
                                <Button variant="success" onClick={() => callUser(idToCall)} size="lg"><FaPhone /> Call</Button>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Incoming Call Notification */}
            {receivingCall && !callAccepted && (
                <div className="fixed-bottom p-4 bg-white shadow-lg text-center border-top">
                    <h3>{name || "Someone"} is calling...</h3>
                    <Button variant="success" onClick={answerCall} size="lg" className="me-3">Answer</Button>
                    <Button variant="danger" size="lg" onClick={() => setReceivingCall(false)}>Decline</Button>
                </div>
            )}
        </Container>
    );
};

export default Telemedicine;
