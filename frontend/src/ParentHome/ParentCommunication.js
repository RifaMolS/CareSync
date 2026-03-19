import React, { useState, useEffect, useRef } from "react";
import ParentSide from "./ParentSide";
import ParentNav from "./ParentNav";


export default function ParentChat() {
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef(null);

  const auth = JSON.parse(localStorage.getItem("user"));
  const parentId = auth?._id; // Use Validation ID for communication consistency

  // Fetch assigned staff
  useEffect(() => {
    if (auth?.regid) {
      fetch("http://localhost:5000/demo/parentstaff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentId: auth.regid }),
      })
        .then((res) => res.json())
        .then((data) => {
          setStaffList(data);
          // Only set the first staff as selected if no staff is currently selected
          if (data.length > 0 && !selectedStaff) {
            setSelectedStaff(data[0]);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [auth?.regid]); // Using regid as stable dependency instead of the auth object reference

  // Fetch chat history
  useEffect(() => {
    if (!selectedStaff) return;

    fetch(`http://localhost:5000/demo/messages?userId1=${parentId}&userId2=${selectedStaff._valId}`)
      .then((res) => res.json())
      .then((data) => {
        setChatHistory(data);
      })
      .catch((err) => console.error(err));
  }, [selectedStaff, parentId]);

  // Scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const handleSend = () => {
    if (!draft.trim() || !selectedStaff) return;

    const newMessage = {
      from: parentId,
      to: selectedStaff._valId,
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

  return (
    <div className="container-fluid p-0" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <ParentSide />
      <div className="content" style={{
        marginLeft: "260px",
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8fafc'
      }}>
        <ParentNav />

        {/* Header Section */}
        <div style={{ padding: '1rem 2rem' }}>
          <div style={{
            background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
            color: "white",
            margin: 0,
            padding: '1.5rem 2rem',
            borderRadius: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            textAlign: 'left'
          }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.2rem' }}>Guardian Communication 💬</h1>
            <p style={{ opacity: 0.9, marginBottom: 0 }}>Stay connected with the staff dedicated to your family's care.</p>
          </div>
        </div>

        <div className="container-fluid px-4 flex-grow-1" style={{ display: 'flex', paddingBottom: '1.5rem', minHeight: 0 }}>
          <div className="chat-container" style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
            border: '1px solid #f1f5f9',
            display: 'flex',
            width: '100%',
            height: '100%',
            maxHeight: 'calc(100vh - 250px)'
          }}>
            <div className="chat-main" style={{ display: 'flex', width: '100%', minHeight: 0 }}>
              <div className="chat-wrapper" style={{ display: 'flex', width: '100%', height: '100%', minHeight: 0 }}>
                {/* Sidebar */}
                <div className="chat-sidebar" style={{
                  width: '280px',
                  backgroundColor: '#f8fafc',
                  borderRight: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div className="p-3 border-bottom bg-white">
                    <h6 className="mb-0 fw-bold">Care Providers</h6>
                  </div>
                  <div className="flex-grow-1 overflow-auto" style={{ scrollbarWidth: 'thin' }}>
                    {staffList.length > 0 ? (
                      staffList.map((s) => (
                        <div
                          key={s._id}
                          className={`p-3 d-flex align-items-center cursor-pointer ${selectedStaff?._id === s._id ? 'bg-primary text-white' : 'hover-bg-light text-dark'}`}
                          style={{
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            zIndex: 10
                          }}
                          onClick={() => setSelectedStaff(s)}
                        >
                          <img
                            src={`http://localhost:5000/${s.image}`}
                            alt="Staff"
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              marginRight: "12px",
                              objectFit: 'cover'
                            }}
                          />
                          <div className="overflow-hidden">
                            <div className="fw-bold text-truncate" style={{ fontSize: '0.9rem' }}>{s.name}</div>
                            <small className={`text-truncate d-block ${selectedStaff?._id === s._id ? 'text-white-50' : 'text-muted'}`}>
                              {s.role}
                            </small>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-muted">
                        <div className="mb-2 fs-2">⏳</div>
                        <p className="small">Loading care team...</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Chat Window */}
                <div className="chat-window" style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fff', position: 'relative', height: '100%' }}>
                  {selectedStaff ? (
                    <>
                      <div className="chat-header p-3 border-bottom d-flex align-items-center bg-white shadow-sm">
                        <img src={`http://localhost:5000/${selectedStaff.image}`} alt="" className="rounded-circle me-3" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                        <div>
                          <h6 className="mb-0 fw-bold">{selectedStaff.name}</h6>
                          <div className="d-flex align-items-center">
                            <span className="bg-success rounded-circle me-1" style={{ width: '8px', height: '8px' }}></span>
                            <small className="text-muted">Connected</small>
                          </div>
                        </div>
                      </div>

                      <div className="messages p-4 overflow-auto bg-light" style={{ flex: 1 }}>
                        {chatHistory.length > 0 ? (
                          chatHistory.map((m, i) => (
                            <div
                              key={i}
                              className={`d-flex mb-3 ${m.from === parentId ? "justify-content-end" : "justify-content-start"}`}
                            >
                              <div style={{ maxWidth: '75%' }}>
                                <div className={`p-3 rounded-4 shadow-sm ${m.from === parentId ? "bg-primary text-white" : "bg-white text-dark"}`}
                                  style={{ borderRadius: m.from === parentId ? '20px 20px 2px 20px' : '20px 20px 20px 2px' }}>
                                  {m.text}
                                </div>
                                <div className={`small mt-1 text-muted ${m.from === parentId ? "text-end" : "text-start"}`}>
                                  {new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
                            <i className="fa fa-comments fs-2 mb-2 opacity-25"></i>
                            <p>Send a message to start the conversation.</p>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      <div className="input-bar d-flex p-3 border-top bg-white align-items-center">
                        <input
                          type="text"
                          className="form-control border-0 bg-light p-3"
                          style={{ borderRadius: '15px', boxShadow: 'none' }}
                          placeholder={`Message ${selectedStaff.name}...`}
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />
                        <button
                          className="btn btn-primary ms-3 d-flex align-items-center justify-content-center"
                          onClick={handleSend}
                          style={{ width: '50px', height: '50px', borderRadius: '15px' }}
                        >
                          <i className="fa fa-paper-plane"></i>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted bg-light">
                      <i className="fa fa-user-friends fs-1 mb-3 opacity-10"></i>
                      <h5>Select a staff member to chat</h5>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Styles */}
      <style>{`
        .hover-bg-light:hover {
          background-color: #f1f5f9 !important;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .transition-all {
          transition: all 0.2s ease;
        }
        .max-width-75 {
          max-width: 75%;
        }
      `}</style>
    </div>
  );
}



// import React, { useState } from 'react';
// import ParentSide from './ParentSide';
// import ParentNav from './ParentNav';

// export default function StaffCommunication() {
//   const defaultInteractions = {
//     staffToParents: [
//       { date: '2025-04-01', message: '📢 Meeting Reminder sent' },
//       { date: '2025-04-02', message: '💬 Feedback received' },
//     ],
//     videoCalls: [
//       { date: '2025-04-01', status: '📹 Video Call Done' },
//       { date: '2025-04-02', status: '⏳ Awaiting Response' },
//     ],
//   };

//   const [data, setData] = useState({ ...defaultInteractions });
//   const [newInteraction, setNewInteraction] = useState({ date: '', message: '', group: 'staffToParents' });
//   const [newCall, setNewCall] = useState({ date: '', status: '', group: 'videoCalls' });
//   const [editIndex, setEditIndex] = useState(null);
//   const [editGroup, setEditGroup] = useState(null);

//   const handleAddMessage = () => {
//     const { date, message, group } = newInteraction;
//     if (!date || !message) return;
//     setData(prev => ({
//       ...prev,
//       [group]: [...prev[group], { date, message }],
//     }));
//     setNewInteraction({ date: '', message: '', group: 'staffToParents' });
//   };

//   const handleAddCall = () => {
//     const { date, status, group } = newCall;
//     if (!date || !status) return;
//     setData(prev => ({
//       ...prev,
//       [group]: [...prev[group], { date, status }],
//     }));
//     setNewCall({ date: '', status: '', group: 'videoCalls' });
//   };

//   const handleEdit = (index, group) => {
//     setEditIndex(index);
//     setEditGroup(group);
//     const item = data[group][index];
//     if (group === 'staffToParents') {
//       setNewInteraction({ ...item, group });
//     } else {
//       setNewCall({ ...item, group });
//     }
//   };

//   const handleUpdate = () => {
//     const updated = [...data[editGroup]];
//     if (editGroup === 'staffToParents') {
//       updated[editIndex] = { date: newInteraction.date, message: newInteraction.message };
//     } else {
//       updated[editIndex] = { date: newCall.date, status: newCall.status };
//     }
//     setData(prev => ({
//       ...prev,
//       [editGroup]: updated,
//     }));
//     setEditIndex(null);
//     setEditGroup(null);
//     setNewInteraction({ date: '', message: '', group: 'staffToParents' });
//     setNewCall({ date: '', status: '', group: 'videoCalls' });
//   };

//   const handleDelete = (index, group) => {
//     setData(prev => ({
//       ...prev,
//       [group]: prev[group].filter((_, i) => i !== index),
//     }));
//   };

//   const renderCard = (record, index, group) => (
//     <div className="card" key={index}>
//       <h3>{record.date}</h3>
//       <p>{record.message || record.status}</p>
//       <div className="btn-group">
//         <button onClick={() => handleEdit(index, group)}>✏️ Edit</button>
//         <button onClick={() => handleDelete(index, group)}>🗑️ Delete</button>
//       </div>
//     </div>
//   );

//   return (
// <div className="container-xxl position-relative bg-white d-flex p-0">
//   <ParentSide/>
//   <div className="content">
//     <ParentNav />
//         <div className="container">
//           <h1>👩‍🏫 Parent Communication Dashboard</h1>

//           <div className="form">
//             <h3>{editIndex !== null ? '✏️ Edit Message/Call' : '➕ Add Parent Message'}</h3>
//             <input
//               type="date"
//               value={newInteraction.date}
//               onChange={(e) => setNewInteraction({ ...newInteraction, date: e.target.value })}
//             />
//             <textarea
//               placeholder="Type message like 📣 Meeting at 3PM"
//               value={newInteraction.message}
//               onChange={(e) => setNewInteraction({ ...newInteraction, message: e.target.value })}
//             />
//             {editIndex !== null ? (
//               <button onClick={handleUpdate}>✅ Update</button>
//             ) : (
//               <button onClick={handleAddMessage}>➕ Add Message</button>
//             )}
//           </div>

//           <div className="form">
//             <h3>📹 Add Video Call Status</h3>
//             <input
//               type="date"
//               value={newCall.date}
//               onChange={(e) => setNewCall({ ...newCall, date: e.target.value })}
//             />
//             <select
//               value={newCall.status}
//               onChange={(e) => setNewCall({ ...newCall, status: e.target.value })}
//             >
//               <option value="">Select status</option>
//               <option value="📹 Video Call Done">📹 Video Call Done</option>
//               <option value="❌ Call Missed">❌ Call Missed</option>
//               <option value="⏳ Awaiting Response">⏳ Awaiting Response</option>
//             </select>
//             <button onClick={handleAddCall}>➕ Add Call</button>
//           </div>

//           <h2>📣 Parent to Staff Messages</h2>
//           <div className="cards">{data.staffToParents.map((record, i) => renderCard(record, i, 'staffToParents'))}</div>

//           <h2>📹 Parent Video Call Log</h2>
//           <div className="cards">{data.videoCalls.map((record, i) => renderCard(record, i, 'videoCalls'))}</div>

//           <div className="call-buttons">
//             <button onClick={() => alert('📞 Initiating Staff Video Call')}>📞 Start Call</button>
//             <button onClick={() => alert('🎥 Connecting to Parent...')}>🎥 Connect to Staff</button>
//           </div>

//           <style>{`
//             .container {
//               padding: 40px 20px;
//               background: #fff3e0;
//               font-family: 'Segoe UI', sans-serif;
//             }
//             h1 {
//               text-align: center;
//               font-size: 36px;
//               color: #ef6c00;
//               animation: slideIn 0.8s ease;
//             }
//             h2 {
//               margin-top: 30px;
//               color: #fb8c00;
//             }
//             .form {
//               background: #ffe0b2;
//               max-width: 600px;
//               margin: 20px auto;
//               padding: 20px;
//               border-radius: 16px;
//               box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
//               display: flex;
//               flex-direction: column;
//               gap: 10px;
//             }
//             .form input, .form select, .form textarea {
//               padding: 10px;
//               border-radius: 8px;
//               border: 1px solid #ccc;
//             }
//             .form button {
//               background-color: #ffa726;
//               color: white;
//               padding: 10px;
//               border: none;
//               border-radius: 8px;
//               cursor: pointer;
//             }
//             .form button:hover {
//               background-color: #f57c00;
//             }
//             .cards {
//               display: flex;
//               flex-wrap: wrap;
//               gap: 20px;
//               justify-content: center;
//             }
//             .card {
//               background: white;
//               padding: 20px;
//               border-radius: 12px;
//               box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
//               width: 260px;
//               animation: floatUp 0.5s ease;
//             }
//             .btn-group {
//               display: flex;
//               justify-content: center;
//               gap: 10px;
//               margin-top: 10px;
//             }
//             .btn-group button {
//               background-color: #ffa726;
//               color: white;
//               border: none;
//               padding: 8px 12px;
//               border-radius: 6px;
//               cursor: pointer;
//             }
//             .btn-group button:hover {
//               background-color: #ef6c00;
//             }
//             .call-buttons {
//               display: flex;
//               flex-wrap: wrap;
//               justify-content: center;
//               gap: 20px;
//               margin-top: 20px;
//             }
//             .call-buttons button {
//               background-color: #fb8c00;
//               color: white;
//               padding: 10px;
//               border: none;
//               border-radius: 8px;
//               cursor: pointer;
//             }
//             .call-buttons button:hover {
//               background-color: #e65100;
//             }

//             @keyframes slideIn {
//               from { opacity: 0; transform: translateX(-50px); }
//               to { opacity: 1; transform: translateX(0); }
//             }

//             @keyframes floatUp {
//               from { opacity: 0; transform: translateY(30px); }
//               to { opacity: 1; transform: translateY(0); }
//             }
//           `}</style>
//         </div>
//       </div>
//     </div>
//   );
// }
