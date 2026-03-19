import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Table, Modal } from "react-bootstrap";
import { FaGraduationCap, FaPlus, FaTrash, FaCheckCircle } from "react-icons/fa";
import StaffSide from "./StaffSide";
import StaffNav from "./StaffNav";

const StaffQuiz = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newQuiz, setNewQuiz] = useState({
        title: "",
        category: "Adult Wellness",
        pointsAwarded: 20,
        questions: [{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }]
    });

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const res = await fetch('http://localhost:5000/demo/adult/get-quizzes');
            const data = await res.json();
            setQuizzes(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddQuestion = () => {
        setNewQuiz({
            ...newQuiz,
            questions: [...newQuiz.questions, { questionText: "", options: ["", "", "", ""], correctAnswer: "" }]
        });
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...newQuiz.questions];
        updatedQuestions[index][field] = value;
        setNewQuiz({ ...newQuiz, questions: updatedQuestions });
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const updatedQuestions = [...newQuiz.questions];
        updatedQuestions[qIndex].options[oIndex] = value;
        setNewQuiz({ ...newQuiz, questions: updatedQuestions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/demo/adult/create-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newQuiz)
            });
            if (res.ok) {
                alert("Quiz created successfully!");
                setShowModal(false);
                fetchQuizzes();
                setNewQuiz({
                    title: "",
                    category: "Adult Wellness",
                    pointsAwarded: 20,
                    questions: [{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }]
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this quiz?")) return;
        try {
            await fetch(`http://localhost:5000/demo/adult/quiz/${id}`, { method: 'DELETE' });
            fetchQuizzes();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="d-flex bg-light" style={{ minHeight: "100vh" }}>
            <StaffSide />
            <div className="content w-100 px-0">
                <StaffNav />
                <Container className="py-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold"><FaGraduationCap className="text-primary me-2" /> Quiz Management</h2>
                        <Button variant="primary" onClick={() => setShowModal(true)}>
                            <FaPlus /> Create New Pattern
                        </Button>
                    </div>

                    <Card className="shadow-sm border-0">
                        <Card.Body>
                            <Table responsive hover>
                                <thead className="bg-light">
                                    <tr>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Questions</th>
                                        <th>Points</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {quizzes.map(quiz => (
                                        <tr key={quiz._id}>
                                            <td className="fw-bold">{quiz.title}</td>
                                            <td>{quiz.category}</td>
                                            <td>{quiz.questions.length}</td>
                                            <td>{quiz.pointsAwarded}</td>
                                            <td>
                                                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(quiz._id)}>
                                                    <FaTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Container>

                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Create New Quiz Pattern</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={8}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Quiz Title</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="e.g. Afternoon Trivia"
                                            value={newQuiz.title}
                                            onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Points</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={newQuiz.pointsAwarded}
                                            onChange={(e) => setNewQuiz({ ...newQuiz, pointsAwarded: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <hr />
                            <h5>Questions</h5>
                            {newQuiz.questions.map((q, qIdx) => (
                                <Card key={qIdx} className="mb-3 bg-light border-0 shadow-sm">
                                    <Card.Body>
                                        <Form.Group className="mb-2">
                                            <Form.Label>Question {qIdx + 1}</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={q.questionText}
                                                onChange={(e) => handleQuestionChange(qIdx, 'questionText', e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                        <Row>
                                            {q.options.map((opt, oIdx) => (
                                                <Col md={6} key={oIdx}>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label className="small">Option {oIdx + 1}</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={opt}
                                                            onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            ))}
                                        </Row>
                                        <Form.Group className="mt-2 text-success fw-bold">
                                            <Form.Label>Correct Answer</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Must match one of the options above"
                                                value={q.correctAnswer}
                                                onChange={(e) => handleQuestionChange(qIdx, 'correctAnswer', e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Card.Body>
                                </Card>
                            ))}
                            <Button variant="outline-primary" size="sm" onClick={handleAddQuestion} className="mb-3">
                                + Add Another Question
                            </Button>
                            <div className="d-grid">
                                <Button variant="primary" type="submit" size="lg">Save Patterns & Go Live</Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
};

export default StaffQuiz;
