import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { FaUserTie, FaHandsHelping, FaUserNurse, FaBrain } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';


const roles = [
  {
    name: 'Administrator',
    icon: <FaUserTie />,
    childrenTasks: [
      'Oversee child care programs',
      'Ensure child safety compliance',
      'Supervise child care staff',
      'Communicate with parents',
    ],
    adultTasks: [
      'Manage adult care schedules',
      'Ensure therapy and nutrition plans',
      'Maintain adult records',
      'Supervise staff and services',
    ]
  },
  {
    name: 'Therapist',
    icon: <FaBrain />,
    childrenTasks: [
      'Speech and play therapy',
      'Developmental support',
      'Behavioral intervention',
      'Coordinate therapy plans',
    ],
    adultTasks: [
      'Rehabilitation and mental health',
      'Cognitive therapy for dementia',
      'Support recovery post-surgery',
      'Counseling for anxiety and depression',
    ]
  },
  {
    name: 'Nurse',
    icon: <FaUserNurse />,
    childrenTasks: [
      'Monitor infections and fever',
      'Administer medications and first aid',
      'Support chronic conditions like asthma',
      'Educate caregivers about health',
    ],
    adultTasks: [
      'Monitor vitals and chronic care',
      'Administer IV, wound care, and meds',
      'Support palliative care needs',
      'Manage hygiene and mobility care',
    ]
  },
  {
    name: 'Caregiver',
    icon: <FaHandsHelping />,
    childrenTasks: [
      'Assist with feeding and hygiene',
      'Support emotional development',
      'Help in learning and play',
      'Report behavior to staff/parents',
    ],
    adultTasks: [
      'Help with hygiene and feeding',
      'Support emotional and social needs',
      'Observe behavioral/health changes',
      'Assist in mobility and toileting',
    ]
  }
];

const StaffRole = () => {
  const [openRole, setOpenRole] = useState(null);
  const navigate = useNavigate();

  const toggleRole = (roleName) => {
    setOpenRole(openRole === roleName ? null : roleName);
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(to right, #e0f2fe, #f8fafc)',
      fontFamily: 'Segoe UI, sans-serif',
      padding: '1rem'
    }}>
      <div style={{
        width: '280px',
        background: '#1e3a8a',
        color: '#fff',
        borderRadius: '1rem',
        padding: '1.5rem',
        boxShadow: '5px 0 20px rgba(0,0,0,0.1)',
        height: 'fit-content'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.5rem' }}>👥 Staff Roles</h2>
        {roles.map((role) => (
          <motion.div
            key={role.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            style={{
              backgroundColor: openRole === role.name ? '#3b82f6' : '#1e40af',
              borderRadius: '10px',
              marginBottom: '1rem',
              cursor: 'pointer',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.3s'
            }}
            onClick={() => toggleRole(role.name)}
          >
            <span style={{ fontSize: '1.4rem' }}>{role.icon}</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{role.name}</span>
          </motion.div>
        ))}
      </div>

      <div style={{ flex: 1, padding: '2rem' }}>
        <AnimatePresence>
          {openRole && (
            <motion.div
              key={openRole}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -30 }}
              transition={{ duration: 0.5 }}
              style={{
                background: '#ffffff',
                padding: '2rem',
                borderRadius: '20px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                maxWidth: '900px',
                margin: 'auto'
              }}
            >
              <h2 style={{ color: '#0f172a', marginBottom: '1.5rem', fontSize: '1.8rem' }}>
                {openRole} Responsibilities
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/role/${openRole}/children`)}
                  style={{
                    background: '#dbeafe',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.2rem'
                  }}
                >
                  👶 View Children Responsibilities →
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/role/${openRole}/adults`)}
                  style={{
                    background: '#dcfce7',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.2rem'
                  }}
                >
                  🧓 View Adult Responsibilities →
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default StaffRole;
// const RoleDetail = () => {
//   const { roleName, type } = useParams();
//   const navigate = useNavigate();
//   const role = roles.find(r => r.name === roleName);
//   const tasks = type === 'children' ? role?.childrenTasks : role?.adultTasks;

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.6 }}
//       style={{
//         minHeight: '100vh',
//         background: 'radial-gradient(circle at top left, #a5f3fc, #fef9c3)',
//         padding: '2rem',
//         fontFamily: 'Segoe UI, sans-serif'
//       }}
//     >
//       <motion.div
//         initial={{ y: 50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         style={{
//           maxWidth: '800px',
//           margin: 'auto',
//           background: '#fff',
//           borderRadius: '20px',
//           boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
//           padding: '2rem'
//         }}
//       >
//         <h2 style={{ color: '#0f172a', fontSize: '1.8rem', marginBottom: '1rem' }}>
//           {roleName} – {type === 'children' ? 'Children' : 'Adult'} Tasks
//         </h2>

//         <ul style={{ paddingLeft: '1rem', lineHeight: '2rem' }}>
//           {tasks?.map((task, index) => (
//             <motion.li
//               key={index}
//               whileHover={{ scale: 1.02 }}
//               style={{
//                 marginBottom: '1rem',
//                 color: '#1e293b',
//                 background: '#f0f9ff',
//                 padding: '0.75rem',
//                 borderRadius: '12px',
//                 boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
//               }}
//             >
//               ✅ {task}
//             </motion.li>
//           ))}
//         </ul>

//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           onClick={() => navigate(-1)}
//           style={{
//             marginTop: '2rem',
//             padding: '0.75rem 1.5rem',
//             background: '#3b82f6',
//             color: '#fff',
//             border: 'none',
//             borderRadius: '10px',
//             cursor: 'pointer',
//             boxShadow: '0 10px 15px rgba(0,0,0,0.1)'
//           }}
//         >
//           🔙 Back
//         </motion.button>
//       </motion.div>
//     </motion.div>
//   );
// };

// // Unified App Component with a single return
// // export default function App() {
// //   return (
// //     <Router>
// //       <Routes>
// //         <Route path="/" element={<StaffRole />} />
// //         <Route path="/role/:roleName/:type" element={<RoleDetail />} />
// //       </Routes>
// //     </Router>
// //   );
// // }
