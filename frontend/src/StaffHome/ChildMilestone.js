// import React, { useState, useEffect, useCallback } from "react";
// import StaffSide from "./StaffSide";
// import StaffNav from "./StaffNav";
// import axios from "axios";
// import { MultiSelect } from "react-multi-select-component";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaBaby, FaUserAlt, FaCheck, FaTrash, FaEdit, FaPlus } from "react-icons/fa";

// export default function ChildMilestone() {
//   const auth = JSON.parse(localStorage.getItem("user"));
//   const staffId = auth?._id;
//   const [milestone, setMilestone] = useState([]);
//   const [assignments, setAssignments] = useState([]);
//   const [selectedWard, setSelectedWard] = useState("");
//   const [milestoneType, setMilestoneType] = useState("child");
//   const [milestoneRecords, setMilestoneRecords] = useState([]);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [editMilestoneId, setEditMilestoneId] = useState(null);
//   const [editMilestones, setEditMilestones] = useState([]);

//   console.log(assignments, "assignments");
//   const childMilestones = [
//     { label: "First Word 🗣️", value: "First Word 🗣️" },
//     { label: "Walking 🚶‍♂️", value: "Walking 🚶‍♂️" },
//     { label: "First Drawing 🎨", value: "First Drawing 🎨" },
//     { label: "Reading Letters 🔤", value: "Reading Letters 🔤" },
//     { label: "First Dance 💃", value: "First Dance 💃" },
//     { label: "School Enrollment 🏫", value: "School Enrollment 🏫" },
//     { label: "Potty Trained 🚽", value: "Potty Trained 🚽" },
//     { label: "Riding Bike 🚲", value: "Riding Bike 🚲" }
//   ];

//   const adultMilestones = [
//     { label: "Walked without support 🚶", value: "Walked without support 🚶" },
//     { label: "Completed Physiotherapy 🧘", value: "Completed Physiotherapy 🧘" },
//     { label: "Medication Adherence 💊", value: "Medication Adherence 💊" },
//     { label: "Improved Memory Score 🧠", value: "Improved Memory Score 🧠" },
//     { label: "Social Participation 🗣️", value: "Social Participation 🗣️" },
//     { label: "Self-Feeding Independence 🍽️", value: "Self-Feeding Independence 🍽️" },
//     { label: "Regular Sleep Pattern 😴", value: "Regular Sleep Pattern 😴" },
//     { label: "Stable Blood Pressure 💓", value: "Stable Blood Pressure 💓" }
//   ];

//   const fetchMilestones = useCallback(async () => {
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/demo/getmilestonesbystaff",
//         { staffId: auth?.regid }
//       );
//       setMilestoneRecords(response.data);
//     } catch (error) {
//       console.error("Error fetching milestones:", error);
//       alert("Failed to fetch milestones.");
//     }
//   }, [auth?.regid]);

//   useEffect(() => {
//     const fetchAssignedStudents = async () => {
//       try {
//         const response = await axios.post(
//           "http://localhost:5000/demo/getassignmentsbystaff",
//           { staffId }
//         );
//         setAssignments(response.data);
//       } catch (error) {
//         console.error("Error fetching assigned students:", error);
//         alert("Failed to fetch assigned students.");
//       }
//     };
//     fetchAssignedStudents();
//     fetchMilestones();
//   }, [staffId, fetchMilestones]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Find assignment based on selected ID (could be childId or adultId)
//     const selected = assignments.find(
//       (item) => {
//         const childIdVal = item.childId?._id || item.childId?.regid?._id;
//         const adultIdVal = item.adultId?._id || item.adultId?.regid?._id;
//         return childIdVal === selectedWard || adultIdVal === selectedWard;
//       }
//     );

//     const selectedMilestones = milestone.map((item) => item.value);
//     const param = {
//       staffId: auth?.regid,
//       childId: milestoneType === "child" ? selectedWard : null,
//       adultId: milestoneType === "adult" ? selectedWard : null,
//       parentId: selected?.parentId,
//       milestone: selectedMilestones,
//       milestoneType,
//       date: new Date().toISOString().split("T")[0],
//       status: 1
//     };

//     try {
//       await axios.post("http://localhost:5000/demo/addmilestone", param);
//       alert("Milestone recorded successfully!");
//       setMilestone([]);
//       setSelectedWard("");
//       fetchMilestones();
//     } catch (error) {
//       console.error("Error recording milestone:", error);
//       alert("Failed to record milestone.");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this record?")) {
//       try {
//         await axios.post("http://localhost:5000/demo/deletemilestone", { id });
//         fetchMilestones();
//       } catch (error) {
//         console.error("Error deleting record:", error);
//       }
//     }
//   };

//   const handleEditClick = (record) => {
//     setEditMilestoneId(record._id);
//     const ms = record.milestone.map(m => ({ label: m, value: m }));
//     setEditMilestones(ms);
//     setEditModalOpen(true);
//   };

//   const handleUpdate = async () => {
//     try {
//       const selectedMs = editMilestones.map(m => m.value);
//       await axios.post("http://localhost:5000/demo/updatemilestone", {
//         id: editMilestoneId,
//         milestone: selectedMs
//       });
//       setEditModalOpen(false);
//       fetchMilestones();
//     } catch (error) {
//       console.error("Error updating record:", error);
//     }
//   };

//   // Group records into chunks of 3 for display
//   const groupedRecords = [];
//   for (let i = 0; i < milestoneRecords.length; i += 3) {
//     groupedRecords.push(milestoneRecords.slice(i, i + 3));
//   }

//   const MilestoneCard = ({ record }) => {
//     const isChild = record.milestoneType === 'child';
//     const wardName = record.childId?.childname || record.adultId?.adultname || "Unknown";

//     return (
//       <motion.div
//         whileHover={{ y: -5 }}
//         className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden bg-white"
//       >
//         <div className={`p-1 ${isChild ? 'bg-success' : 'bg-info'}`}></div>
//         <div className="card-body p-4">
//           <div className="d-flex justify-content-between align-items-start mb-3">
//             <div className="d-flex align-items-center">
//               <div className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-2 ${isChild ? 'bg-success' : 'bg-info'}`} style={{ width: '35px', height: '35px' }}>
//                 {wardName[0]}
//               </div>
//               <div>
//                 <h6 className="mb-0 fw-bold">{wardName}</h6>
//                 <small className="text-muted small">{new Date(record.date).toLocaleDateString()}</small>
//               </div>
//             </div>
//             <div className="dropdown">
//               <button className="btn btn-link text-muted p-0 shadow-none" type="button" data-bs-toggle="dropdown">
//                 <FaEdit />
//               </button>
//               <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3">
//                 <li><button className="dropdown-item py-2" onClick={() => handleEditClick(record)}><FaEdit className="me-2 text-primary" /> Edit</button></li>
//                 <li><button className="dropdown-item py-2 text-danger" onClick={() => handleDelete(record._id)}><FaTrash className="me-2 text-danger" /> Delete</button></li>
//               </ul>
//             </div>
//           </div>
//           <div className="mb-3">
//             <span className={`badge ${isChild ? 'bg-success-subtle text-success' : 'bg-info-subtle text-info'} rounded-pill px-2 py-1 small`}>
//               {isChild ? 'Child Care' : 'Adult Care'}
//             </span>
//           </div>
//           <div className="mt-3">
//             {record.milestone.map((m, idx) => (
//               <div key={idx} className="bg-light p-2 mb-2 rounded-3 d-flex align-items-center border-start border-3 border-primary" style={{ fontSize: '14px' }}>
//                 <FaCheck className="text-success me-2" size={12} />
//                 <span className="fw-medium">{m}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </motion.div>
//     );
//   };

//   return (
//     <div className="d-flex min-vh-100 bg-light">
//       <StaffSide />
//       <div className="content w-100">
//         <StaffNav />
//         <div className="container-fluid p-4">
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="d-flex flex-wrap justify-content-between align-items-center mb-5 p-4 rounded-4"
//             style={{
//               background: 'white',
//               boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
//               border: '1px solid rgba(0,0,0,0.05)'
//             }}
//           >
//             <div>
//               <h3 className="fw-bold text-primary mb-1">🎯 Milestone Tracker</h3>
//               <p className="text-muted mb-0">Celebrate and monitor developmental progress.</p>
//             </div>
//             <div className="d-flex gap-3">
//               <div className="bg-primary-subtle p-3 rounded-4 text-primary text-center">
//                 <h4 className="fw-bold mb-0">{milestoneRecords.length}</h4>
//                 <small className="small fw-bold text-uppercase">Total Records</small>
//               </div>
//             </div>
//           </motion.div>

//           <div className="row g-4 mb-5">
//             <div className="col-lg-4 col-xl-3">
//               <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
//                 <div className="card-body p-4">
//                   <h5 className="fw-bold mb-4 d-flex align-items-center">
//                     <span className="bg-primary-subtle p-2 rounded-3 me-2 text-primary"><FaPlus size={16} /></span>
//                     New Milestone
//                   </h5>
//                   <form onSubmit={handleSubmit}>
//                     {/* Type Selection */}
//                     <div className="mb-4">
//                       <label className="form-label text-muted small fw-bold text-uppercase">Target Ward Type</label>
//                       <div className="d-flex gap-2 bg-light p-1 rounded-3">
//                         <button type="button"
//                           className={`btn btn-sm flex-grow-1 border-0 rounded-2 shadow-none py-2 ${milestoneType === 'child' ? 'bg-white text-primary fw-bold shadow-sm' : 'text-muted'}`}
//                           onClick={() => setMilestoneType('child')}
//                         >
//                           <FaBaby className="me-2" /> Child
//                         </button>
//                         <button type="button"
//                           className={`btn btn-sm flex-grow-1 border-0 rounded-2 shadow-none py-2 ${milestoneType === 'adult' ? 'bg-white text-info fw-bold shadow-sm' : 'text-muted'}`}
//                           onClick={() => setMilestoneType('adult')}
//                         >
//                           <FaUserAlt className="me-2" /> Adult
//                         </button>
//                       </div>
//                     </div>

//                     {/* Child/Adult Selection */}
//                     <div className="mb-4">
//                       <label className="form-label text-muted small fw-bold text-uppercase">Person Name</label>
//                       <select
//                         className="form-select bg-light border-0 py-2 rounded-3 font-medium"
//                         value={selectedWard}
//                         onChange={(e) => setSelectedWard(e.target.value)}
//                         required
//                         style={{ fontSize: '15px' }}
//                       >
//                         <option value="">-- Select Person --</option>
//                         {assignments
//                           .filter((item) => {
//                             const entity = item.childId || item.adultId;
//                             if (!entity) return false;
//                             if (entity.regType) return entity.regType === milestoneType;
//                             const details = entity.regid || {};
//                             if (milestoneType === 'child') return !!details.childname;
//                             if (milestoneType === 'adult') return !!details.adultname;
//                             return milestoneType === 'child' ? !!item.childId : !!item.adultId;
//                           })
//                           .map((item) => {
//                             const person = item.childId || item.adultId;
//                             const name = person?.regid?.childname || person?.regid?.adultname || person?.regid?.name || person?.name || "Unknown";
//                             return (
//                               <option key={person?._id} value={person?._id}>
//                                 {name}
//                               </option>
//                             );
//                           })}
//                       </select>
//                     </div>

//                     {/* Milestone Selection */}
//                     <div className="mb-5">
//                       <label className="form-label text-muted small fw-bold text-uppercase">Achievements</label>
//                       <MultiSelect
//                         options={milestoneType === "child" ? childMilestones : adultMilestones}
//                         value={milestone}
//                         onChange={setMilestone}
//                         labelledBy="Select"
//                         overrideStrings={{ selectSomeItems: "Select Items..." }}
//                         className="border-0 bg-light rounded-3 shadow-none custom-multiselect"
//                       />
//                     </div>
//                     <button type="submit" className="btn btn-primary w-100 rounded-pill py-3 fw-bold shadow-sm border-0 mt-2" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
//                       Log Achievements
//                     </button>
//                   </form>
//                 </div>
//               </div>
//             </div>

//             <div className="col-lg-8 col-xl-9">
//               {groupedRecords.length > 0 ? groupedRecords.map((group, groupIdx) => (
//                 <div className="row g-4 mb-4" key={groupIdx}>
//                   {group.map((record, i) => (
//                     <div className="col-md-6 col-xl-4" key={i}>
//                       <MilestoneCard record={record} />
//                     </div>
//                   ))}
//                 </div>
//               )) : (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="text-center py-5 bg-white rounded-4 shadow-sm border-dashed border-2 d-flex flex-column align-items-center justify-content-center h-100"
//                 >
//                   <div className="display-1 opacity-25 mb-3 text-muted">📊</div>
//                   <h4 className="fw-bold text-dark">No milestones recorded yet.</h4>
//                   <p className="text-muted small">Start logging achievements to see them here.</p>
//                 </motion.div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Edit Modal */}
//       <AnimatePresence>
//         {editModalOpen && (
//           <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               className="modal-dialog modal-dialog-centered"
//             >
//               <div className="modal-content border-0 rounded-4 shadow-lg">
//                 <div className="modal-header border-0 p-4">
//                   <h5 className="modal-title fw-bold">Edit Achievements</h5>
//                   <button type="button" className="btn-close shadow-none" onClick={() => setEditModalOpen(false)}></button>
//                 </div>
//                 <div className="modal-body p-4 pt-0">
//                   <MultiSelect
//                     options={milestoneType === "child" ? childMilestones : adultMilestones}
//                     value={editMilestones}
//                     onChange={setEditMilestones}
//                     labelledBy="Select"
//                     className="border-0 bg-light rounded-3 custom-multiselect"
//                   />
//                 </div>
//                 <div className="modal-footer border-0 p-4 pt-0">
//                   <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setEditModalOpen(false)}>Cancel</button>
//                   <button type="button" className="btn btn-primary rounded-pill px-4 fw-bold" style={{ background: '#4f46e5' }} onClick={handleUpdate}>Update Record</button>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }


import React, { useState, useEffect, useCallback } from "react";
import StaffSide from "./StaffSide";
import StaffNav from "./StaffNav";
import axios from "axios";
import { MultiSelect } from "react-multi-select-component";
import { motion, AnimatePresence } from "framer-motion";
import { FaBaby, FaUserAlt, FaCheck, FaTrash, FaEdit, FaPlus } from "react-icons/fa";

export default function ChildMilestone() {
  const auth = JSON.parse(localStorage.getItem("user"));
  const staffId = auth?._id;
  const [milestone, setMilestone] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedWard, setSelectedWard] = useState("");
  const [milestoneType, setMilestoneType] = useState("child");
  const [milestoneRecords, setMilestoneRecords] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editMilestoneId, setEditMilestoneId] = useState(null);
  const [editMilestones, setEditMilestones] = useState([]);

  console.log(assignments, "assignments");
  const childMilestones = [
    { label: "First Word 🗣️", value: "First Word 🗣️" },
    { label: "Walking 🚶‍♂️", value: "Walking 🚶‍♂️" },
    { label: "First Drawing 🎨", value: "First Drawing 🎨" },
    { label: "Reading Letters 🔤", value: "Reading Letters 🔤" },
    { label: "First Dance 💃", value: "First Dance 💃" },
    { label: "School Enrollment 🏫", value: "School Enrollment 🏫" },
    { label: "Potty Trained 🚽", value: "Potty Trained 🚽" },
    { label: "Riding Bike 🚲", value: "Riding Bike 🚲" }
  ];

  const adultMilestones = [
    { label: "Walked without support 🚶", value: "Walked without support 🚶" },
    { label: "Completed Physiotherapy 🧘", value: "Completed Physiotherapy 🧘" },
    { label: "Medication Adherence 💊", value: "Medication Adherence 💊" },
    { label: "Improved Memory Score 🧠", value: "Improved Memory Score 🧠" },
    { label: "Social Participation 🗣️", value: "Social Participation 🗣️" },
    { label: "Self-Feeding Independence 🍽️", value: "Self-Feeding Independence 🍽️" },
    { label: "Regular Sleep Pattern 😴", value: "Regular Sleep Pattern 😴" },
    { label: "Stable Blood Pressure 💓", value: "Stable Blood Pressure 💓" }
  ];

  const fetchMilestones = useCallback(async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/demo/getmilestonesbystaff",
        { staffId: auth?.regid }
      );
      console.log("Fetched milestones:", response.data);
      // Validate data before setting state - check both 'milestone' and 'milestones'
      const validRecords = (response.data || []).filter(record => {
        const milestoneArray = record.milestones || record.milestone;
        return record && milestoneArray && Array.isArray(milestoneArray);
      }).map(record => ({
        ...record,
        milestone: record.milestones || record.milestone // Normalize to 'milestone'
      }));
      setMilestoneRecords(validRecords);
    } catch (error) {
      console.error("Error fetching milestones:", error);
      alert("Failed to fetch milestones.");
      setMilestoneRecords([]); // Set empty array on error
    }
  }, [auth?.regid]);

  useEffect(() => {
    const fetchAssignedStudents = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/demo/getassignmentsbystaff",
          { staffId }
        );
        setAssignments(response.data || []);
      } catch (error) {
        console.error("Error fetching assigned students:", error);
        alert("Failed to fetch assigned students.");
        setAssignments([]);
      }
    };
    fetchAssignedStudents();
    fetchMilestones();
  }, [staffId, fetchMilestones]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedWard) {
      alert("Please select a person");
      return;
    }

    if (milestone.length === 0) {
      alert("Please select at least one milestone");
      return;
    }

    // Find assignment based on selected ID (could be childId or adultId)
    const selected = assignments.find(
      (item) => {
        const childIdVal = item.childId?._id || item.childId?.regid?._id;
        const adultIdVal = item.adultId?._id || item.adultId?.regid?._id;
        return childIdVal === selectedWard || adultIdVal === selectedWard;
      }
    );

    const selectedMilestones = milestone.map((item) => item.value);

    // Backend expects 'milestones' (plural)
    const param = {
      staffId: auth?.regid,
      childId: milestoneType === "child" ? selectedWard : null,
      adultId: milestoneType === "adult" ? selectedWard : null,
      parentId: selected?.parentId,
      milestones: selectedMilestones, // Changed from 'milestone' to 'milestones'
      milestoneType,
      date: new Date().toISOString().split("T")[0],
      status: 1
    };

    console.log("Submitting milestone data:", param);

    try {
      const response = await axios.post("http://localhost:5000/demo/addmilestone", param);
      console.log("Server response:", response.data);
      alert("Milestone recorded successfully!");
      setMilestone([]);
      setSelectedWard("");
      fetchMilestones();
    } catch (error) {
      console.error("Error recording milestone:", error);
      alert("Failed to record milestone.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.post("http://localhost:5000/demo/deletemilestone", { id });
        fetchMilestones();
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }
  };

  const handleEditClick = (record) => {
    if (!record) {
      alert("Invalid milestone record");
      return;
    }
    const milestoneArray = record.milestones || record.milestone;
    if (!milestoneArray || !Array.isArray(milestoneArray)) {
      alert("Invalid milestone record");
      return;
    }
    setEditMilestoneId(record._id);
    const ms = milestoneArray.map(m => ({ label: m, value: m }));
    setEditMilestones(ms);
    setEditModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const selectedMs = editMilestones.map(m => m.value);
      await axios.post("http://localhost:5000/demo/updatemilestone", {
        id: editMilestoneId,
        milestones: selectedMs // Changed from 'milestone' to 'milestones'
      });
      setEditModalOpen(false);
      fetchMilestones();
      alert("Milestone updated successfully!");
    } catch (error) {
      console.error("Error updating record:", error);
      alert("Failed to update milestone.");
    }
  };

  // Group records into chunks of 3 for display
  const groupedRecords = [];
  for (let i = 0; i < milestoneRecords.length; i += 3) {
    groupedRecords.push(milestoneRecords.slice(i, i + 3));
  }

  const MilestoneCard = ({ record }) => {
    // Safety checks
    if (!record) return null;

    const isChild = record.milestoneType === 'child';
    const wardName = record.childId?.childname || record.childId?.regid?.childname ||
      record.adultId?.adultname || record.adultId?.regid?.adultname || "Unknown";

    // Ensure milestone is an array - check both 'milestones' and 'milestone'
    const milestoneArray = record.milestones || record.milestone;
    const milestones = Array.isArray(milestoneArray) ? milestoneArray : [];

    // Format date properly
    let formattedDate = 'N/A';
    if (record.date) {
      formattedDate = new Date(record.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } else if (record.createdAt) {
      formattedDate = new Date(record.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }

    console.log("Rendering card for:", wardName, "Milestones:", milestones);

    return (
      <motion.div
        whileHover={{ y: -5 }}
        className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden bg-white"
      >
        <div className={`p-1 ${isChild ? 'bg-success' : 'bg-info'}`}></div>
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="d-flex align-items-center">
              <div className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-2 ${isChild ? 'bg-success' : 'bg-info'}`} style={{ width: '35px', height: '35px' }}>
                {wardName[0].toUpperCase()}
              </div>
              <div>
                <h6 className="mb-0 fw-bold">{wardName}</h6>
                <small className="text-muted small">{formattedDate}</small>
              </div>
            </div>
            <div className="dropdown">
              <button className="btn btn-link text-muted p-0 shadow-none" type="button" data-bs-toggle="dropdown">
                <FaEdit />
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3">
                <li><button className="dropdown-item py-2" onClick={() => handleEditClick(record)}><FaEdit className="me-2 text-primary" /> Edit</button></li>
                <li><button className="dropdown-item py-2 text-danger" onClick={() => handleDelete(record._id)}><FaTrash className="me-2 text-danger" /> Delete</button></li>
              </ul>
            </div>
          </div>
          <div className="mb-3">
            <span className={`badge ${isChild ? 'bg-success-subtle text-success' : 'bg-info-subtle text-info'} rounded-pill px-2 py-1 small`}>
              {isChild ? 'Child Care' : 'Adult Care'}
            </span>
          </div>
          <div className="mt-3">
            {milestones.length > 0 ? (
              milestones.map((m, idx) => (
                <div key={idx} className="bg-light p-2 mb-2 rounded-3 d-flex align-items-center border-start border-3 border-primary" style={{ fontSize: '14px' }}>
                  <FaCheck className="text-success me-2" size={12} />
                  <span className="fw-medium">{m}</span>
                </div>
              ))
            ) : (
              <div className="text-muted small">No milestones recorded</div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <StaffSide />
      <div className="content w-100" style={{ marginLeft: "250px" }}>
        <StaffNav />
        <div className="container-fluid p-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="d-flex flex-wrap justify-content-between align-items-center mb-5 p-4 rounded-4"
            style={{
              background: 'white',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            <div>
              <h3 className="fw-bold text-primary mb-1">🎯 Milestone Tracker</h3>
              <p className="text-muted mb-0">Celebrate and monitor developmental progress.</p>
            </div>
            <div className="d-flex gap-3">
              <div className="bg-primary-subtle p-3 rounded-4 text-primary text-center">
                <h4 className="fw-bold mb-0">{milestoneRecords.length}</h4>
                <small className="small fw-bold text-uppercase">Total Records</small>
              </div>
              <div className="bg-success-subtle p-3 rounded-4 text-success text-center">
                <h4 className="fw-bold mb-0">{milestoneRecords.filter(r => r.milestoneType === 'child').length}</h4>
                <small className="small fw-bold text-uppercase">Children</small>
              </div>
              <div className="bg-info-subtle p-3 rounded-4 text-info text-center">
                <h4 className="fw-bold mb-0">{milestoneRecords.filter(r => r.milestoneType === 'adult').length}</h4>
                <small className="small fw-bold text-uppercase">Adults</small>
              </div>
            </div>
          </motion.div>

          <div className="row g-4 mb-5">
            <div className="col-lg-4 col-xl-3">
              <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4 d-flex align-items-center">
                    <span className="bg-primary-subtle p-2 rounded-3 me-2 text-primary"><FaPlus size={16} /></span>
                    New Milestone
                  </h5>
                  <form onSubmit={handleSubmit}>
                    {/* Type Selection */}
                    <div className="mb-4">
                      <label className="form-label text-muted small fw-bold text-uppercase">Target Ward Type</label>
                      <div className="d-flex gap-2 bg-light p-1 rounded-3">
                        <button type="button"
                          className={`btn btn-sm flex-grow-1 border-0 rounded-2 shadow-none py-2 ${milestoneType === 'child' ? 'bg-white text-primary fw-bold shadow-sm' : 'text-muted'}`}
                          onClick={() => {
                            setMilestoneType('child');
                            setSelectedWard("");
                            setMilestone([]);
                          }}
                        >
                          <FaBaby className="me-2" /> Child
                        </button>
                        <button type="button"
                          className={`btn btn-sm flex-grow-1 border-0 rounded-2 shadow-none py-2 ${milestoneType === 'adult' ? 'bg-white text-info fw-bold shadow-sm' : 'text-muted'}`}
                          onClick={() => {
                            setMilestoneType('adult');
                            setSelectedWard("");
                            setMilestone([]);
                          }}
                        >
                          <FaUserAlt className="me-2" /> Adult
                        </button>
                      </div>
                    </div>

                    {/* Child/Adult Selection */}
                    <div className="mb-4">
                      <label className="form-label text-muted small fw-bold text-uppercase">Person Name</label>
                      <select
                        className="form-select bg-light border-0 py-2 rounded-3 font-medium"
                        value={selectedWard}
                        onChange={(e) => setSelectedWard(e.target.value)}
                        required
                        style={{ fontSize: '15px' }}
                      >
                        <option value="">-- Select Person --</option>
                        {assignments
                          .filter((item) => {
                            const entity = item.childId || item.adultId;
                            if (!entity) return false;
                            if (entity.regType) return entity.regType === milestoneType;
                            const details = entity.regid || {};
                            if (milestoneType === 'child') return !!details.childname;
                            if (milestoneType === 'adult') return !!details.adultname;
                            return milestoneType === 'child' ? !!item.childId : !!item.adultId;
                          })
                          .map((item) => {
                            const person = item.childId || item.adultId;
                            const name = person?.regid?.childname || person?.regid?.adultname || person?.regid?.name || person?.name || "Unknown";
                            return (
                              <option key={person?._id} value={person?._id}>
                                {name}
                              </option>
                            );
                          })}
                      </select>
                    </div>

                    {/* Milestone Selection */}
                    <div className="mb-5">
                      <label className="form-label text-muted small fw-bold text-uppercase">Achievements</label>
                      <MultiSelect
                        options={milestoneType === "child" ? childMilestones : adultMilestones}
                        value={milestone}
                        onChange={setMilestone}
                        labelledBy="Select"
                        overrideStrings={{ selectSomeItems: "Select Items..." }}
                        className="border-0 bg-light rounded-3 shadow-none custom-multiselect"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 rounded-pill py-3 fw-bold shadow-sm border-0 mt-2" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
                      Log Achievements
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-8 col-xl-9">
              {groupedRecords.length > 0 ? groupedRecords.map((group, groupIdx) => (
                <div className="row g-4 mb-4" key={groupIdx}>
                  {group.map((record, i) => (
                    <div className="col-md-6 col-xl-4" key={record._id || i}>
                      <MilestoneCard record={record} />
                    </div>
                  ))}
                </div>
              )) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-5 bg-white rounded-4 shadow-sm border-dashed border-2 d-flex flex-column align-items-center justify-content-center h-100"
                  style={{ minHeight: '400px' }}
                >
                  <div className="display-1 opacity-25 mb-3 text-muted">📊</div>
                  <h4 className="fw-bold text-dark">No milestones recorded yet.</h4>
                  <p className="text-muted small">Start logging achievements to see them here.</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editModalOpen && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-dialog modal-dialog-centered"
            >
              <div className="modal-content border-0 rounded-4 shadow-lg">
                <div className="modal-header border-0 p-4">
                  <h5 className="modal-title fw-bold">Edit Achievements</h5>
                  <button type="button" className="btn-close shadow-none" onClick={() => setEditModalOpen(false)}></button>
                </div>
                <div className="modal-body p-4 pt-0">
                  <MultiSelect
                    options={milestoneType === "child" ? childMilestones : adultMilestones}
                    value={editMilestones}
                    onChange={setEditMilestones}
                    labelledBy="Select"
                    className="border-0 bg-light rounded-3 custom-multiselect"
                  />
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setEditModalOpen(false)}>Cancel</button>
                  <button type="button" className="btn btn-primary rounded-pill px-4 fw-bold" style={{ background: '#4f46e5' }} onClick={handleUpdate}>Update Record</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}