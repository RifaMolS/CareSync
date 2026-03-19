import React, { useState, useEffect, useRef } from "react";
import StaffSide from './StaffSide';
import StaffNav from './StaffNav';

export default function StaffChat() {
  const [parentContacts, setParentContacts] = useState([]);
  const [adultContacts, setAdultContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef(null);

  const auth = JSON.parse(localStorage.getItem("user"));
  const myEmailId = auth?._id;
  const myProfileId = auth?.regid;

  // Fetch assigned parents
  useEffect(() => {
    if (!myEmailId) return;
    fetch("http://localhost:5000/demo/staffparent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ staffId: myEmailId }),
    })
      .then((res) => res.json())
      .then((data) => {
        const withType = data.map(p => ({ ...p, type: 'guardian', name: p.parentname }));
        setParentContacts(withType);
      })
      .catch((err) => console.error(err));
  }, [myEmailId]);

  // Fetch assigned adults
  useEffect(() => {
    if (!myEmailId) return;
    fetch("http://localhost:5000/demo/staffadult", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ staffId: myEmailId }),
    })
      .then((res) => res.json())
      .then((data) => {
        const withType = data.map(a => ({ ...a, type: 'adult' }));
        setAdultContacts(withType);
      })
      .catch((err) => console.error(err));
  }, [myEmailId]);

  // Set first contact as active if none selected
  useEffect(() => {
    if (!activeContact) {
      if (parentContacts.length > 0) setActiveContact(parentContacts[0]);
      else if (adultContacts.length > 0) setActiveContact(adultContacts[0]);
    }
  }, [parentContacts, adultContacts, activeContact]);

  // Fetch chat history
  useEffect(() => {
    if (!activeContact) return;

    let userId1, userId2;
    if (activeContact.type === 'parent') {
      userId1 = myProfileId;
      userId2 = activeContact._id;
    } else {
      userId1 = myEmailId;
      userId2 = activeContact._id;
    }

    fetch(`http://localhost:5000/demo/messages?userId1=${userId1}&userId2=${userId2}`)
      .then((res) => res.json())
      .then((data) => {
        setChatHistory(data);
      })
      .catch((err) => console.error(err));
  }, [activeContact, myEmailId, myProfileId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const handleSend = () => {
    if (!draft.trim() || !activeContact) return;

    let from, to;
    if (activeContact.type === 'parent') {
      from = myProfileId;
      to = activeContact._id;
    } else {
      from = myEmailId;
      to = activeContact._id;
    }

    const newMessage = {
      from,
      to,
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

  const isMe = (fromId) => {
    return fromId === myProfileId || fromId === myEmailId;
  };

  return (
    <div className="container-xxl position-relative bg-white d-flex p-0">
      <StaffSide />
      <div className="content">
        <StaffNav />
        <div className="container">
          <div className="chat-container d-flex">
            {/* Sidebar */}
            <div className="chat-sidebar">
              <div className="contact-section">
                <h3>Guardians</h3>
                <ul>
                  {parentContacts.length > 0 ? parentContacts.map((c) => (
                    <li
                      key={c._id}
                      className={activeContact?._id === c._id ? "active" : ""}
                      onClick={() => setActiveContact(c)}
                    >
                      {c.name}
                    </li>
                  )) : <li className="empty-msg">No guardians assigned</li>}
                </ul>
              </div>

              <div className="contact-section mt-4">
                <h3>Adult Members</h3>
                <ul>
                  {adultContacts.length > 0 ? adultContacts.map((c) => (
                    <li
                      key={c._id}
                      className={activeContact?._id === c._id ? "active" : ""}
                      onClick={() => setActiveContact(c)}
                    >
                      {c.name}
                    </li>
                  )) : <li className="empty-msg">No adults assigned</li>}
                </ul>
              </div>
            </div>

            {/* Chat window */}
            <div className="chat-window flex-grow-1 d-flex flex-column">
              <div className="chat-header p-3 border-bottom bg-light">
                <h4 className="mb-0">
                  {activeContact ? `Chat with ${activeContact.name} (${activeContact.type})` : "Select a contact"}
                </h4>
              </div>
              <div className="messages flex-grow-1 p-3 overflow-auto">
                {chatHistory.map((m, i) => (
                  <div
                    key={i}
                    className={`d-flex mb-2 ${isMe(m.from) ? "justify-content-end" : "justify-content-start"}`}
                  >
                    <div className={`p-2 rounded ${isMe(m.from) ? "bg-primary text-white" : "bg-light text-dark"}`}>
                      {m.text}
                      <div className={`${isMe(m.from) ? "text-white-50" : "text-muted"} small text-end`}>
                        {new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="input-bar d-flex p-2 border-top">
                <input
                  className="form-control me-2"
                  type="text"
                  placeholder="Type a message..."
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={!activeContact}
                />
                <button
                  className="btn btn-primary rounded-circle"
                  onClick={handleSend}
                  disabled={!activeContact || !draft.trim()}
                >
                  📩
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .chat-container {
          display: flex;
          height: calc(100vh - 70px);          
          overflow: hidden;     
        }
        .chat-sidebar {
          width: 260px;
          background: #fff;
          border-right: 1px solid #e5e7eb;
          padding: 1rem;
          box-shadow: 2px 0 6px rgba(0,0,0,0.05);
          overflow-y: auto;
        }
        .chat-sidebar h3 {
          font-size: 1.1rem;
          font-weight: bold;
          margin-bottom: 0.75rem;
          color: #374151;
          border-bottom: 2px solid #6366f1;
          padding-bottom: 5px;
        }
        .chat-sidebar ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .chat-sidebar li {
          padding: 0.75rem 1rem;
          margin-bottom: 0.25rem;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
          font-size: 0.95rem;
        }
        .chat-sidebar li:hover {
          background: #f3f4f6;
        }
        .chat-sidebar li.active {
          background: #6366f1;
          color: #fff;
        }
        .empty-msg {
          color: #9ca3af;
          font-style: italic;
          font-size: 0.85rem;
          cursor: default !important;
        }
        .empty-msg:hover {
          background: transparent !important;
        }
        .chat-window {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #fff;
        }
        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          background: #f9fafb;
        }
        .input-bar {
          background: #fff;
          padding: 1rem !important;
        }
        .input-bar input {
          border-radius: 20px;
          padding: 0.6rem 1.2rem;
        }
        .input-bar button {
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}
