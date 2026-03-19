import React, { useState, useEffect } from 'react';
import Footerpage from './Footerpage';
import Navbar from './Navbar';
import axios from 'axios';
import { FaTrophy, FaCheckCircle, FaStar } from 'react-icons/fa';

const MilestonePage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeAgeGroup, setActiveAgeGroup] = useState('middle-childhood');
  const [myMilestones, setMyMilestones] = useState([]);
  const [childInfo, setChildInfo] = useState(null);

  const ageGroups = [
    { id: 'middle-childhood', label: 'Ages 8-10', min: 8, max: 10 },
    { id: 'pre-teen', label: 'Ages 11-12', min: 11, max: 12 },
    { id: 'early-teen', label: 'Ages 13-14', min: 13, max: 14 },
    { id: 'mid-teen', label: 'Ages 15-16', min: 15, max: 16 },
    { id: 'late-teen', label: 'Ages 17-18', min: 17, max: 18 },
    { id: 'young-adult', label: 'Ages 19-20', min: 19, max: 20 },
  ];

  const milestonesStatic = {
    'middle-childhood': [
      {
        title: 'Cognitive Development',
        details: [
          'Developing concrete logical thinking and causality',
          'Reading fluently and understanding complex stories',
          'Applying mathematical concepts to real-life situations',
        ],
        icon: '🧠',
        category: 'Cognitive',
      },
      {
        title: 'Physical Development',
        details: [
          'Improved sports skills and physical coordination',
          'Fine motor precision in writing and drawing',
          'Consistent steady growth in height and weight',
        ],
        icon: '🏃‍♂️',
        category: 'Physical',
      },
      {
        title: 'Social Development',
        details: [
          'Forming stable peer groups and close friendships',
          'Increased understanding of teamwork and fairness',
          'Showing more independence from family',
        ],
        icon: '👥',
        category: 'Social',
      },
      {
        title: 'Emotional Development',
        details: [
          'Developing self-awareness and self-criticism',
          'Learning to manage basic stress and anxiety',
          'Forming a sense of competence and pride',
        ],
        icon: '❤️',
        category: 'Emotional',
      },
    ],
    'pre-teen': [
      {
        title: 'Cognitive Development',
        details: [
          'Beginning abstract thinking and hypotheticals',
          'Establishing better long-term planning skills',
          'Critical thinking about information and sources',
        ],
        icon: '🧠',
        category: 'Cognitive',
      },
      {
        title: 'Physical Development',
        details: [
          'Onset of early puberty changes for many',
          'Rapid growth spurts and appetite changes',
          'Increased need for sleep and physical activity',
        ],
        icon: '🏃‍♂️',
        category: 'Physical',
      },
      {
        title: 'Social Development',
        details: [
          'Peer influence starting to outweigh parental influence',
          'Exploration of digital social spaces and media',
          'Developing a stronger sense of social justice',
        ],
        icon: '👥',
        category: 'Social',
      },
      {
        title: 'Emotional Development',
        details: [
          'Increased mood swings due to hormonal changes',
          'Focus on body image and self-perception',
          'Seeking more privacy and individual identity',
        ],
        icon: '❤️',
        category: 'Emotional',
      },
    ],
    'early-teen': [
      {
        title: 'Cognitive Development',
        details: [
          'Mastering complex logic and moral reasoning',
          'Increased capacity for introspection and analysis',
          'Advanced problem-solving across subjects',
        ],
        icon: '🧠',
        category: 'Cognitive',
      },
      {
        title: 'Physical Development',
        details: [
          'Major puberty changes (voice, skin, hair)',
          'Significant changes in body composition',
          'Developing more refined athletic abilities',
        ],
        icon: '🏃‍♂️',
        category: 'Physical',
      },
      {
        title: 'Social Development',
        details: [
          'Deepening friendships through shared values',
          'Interest in romantic relationships may emerge',
          'Actively seeking autonomy and independence',
        ],
        icon: '👥',
        category: 'Social',
      },
      {
        title: 'Emotional Development',
        details: [
          'Intense emotional experiences and sensitivity',
          'Strong desire to fit in while being unique',
          'Testing boundaries and establishing self-identity',
        ],
        icon: '❤️',
        category: 'Emotional',
      },
    ],
    'mid-teen': [
      {
        title: 'Cognitive Development',
        details: [
          'Strategic thinking and long-term goal setting',
          'Developing specific academic and career interests',
          'Understanding complex socioeconomic concepts',
        ],
        icon: '🧠',
        category: 'Cognitive',
      },
      {
        title: 'Physical Development',
        details: [
          'Nearing adult height and physical structure',
          'Developing endurance and specific physical skills',
          'Reproductive maturity is largely complete',
        ],
        icon: '🏃‍♂️',
        category: 'Physical',
      },
      {
        title: 'Social Development',
        details: [
          'Increased responsibility and social independence',
          'Focus on future transitions like work or college',
          'Developing more mature, empathetic friendships',
        ],
        icon: '👥',
        category: 'Social',
      },
      {
        title: 'Emotional Development',
        details: [
          'Establishing a firm personal value system',
          'Learning to manage romantic relationship stress',
          'Developing resilience and coping mechanisms',
        ],
        icon: '❤️',
        category: 'Emotional',
      },
    ],
    'late-teen': [
      {
        title: 'Cognitive Development',
        details: [
          'Executing complex career and educational plans',
          'Understanding financial and legal responsibilities',
          'High-level synthesis of information and ideas',
        ],
        icon: '🧠',
        category: 'Cognitive',
      },
      {
        title: 'Physical Development',
        details: [
          'Physical maturity mostly complete for all',
          'Peak potential for athletic and physical growth',
          'Brain development focuses on executive function',
        ],
        icon: '🏃‍♂️',
        category: 'Physical',
      },
      {
        title: 'Social Development',
        details: [
          'Preparing for full independent living/adulthood',
          'Broader involvement in community or civic life',
          'Managing complex social and professional networks',
        ],
        icon: '👥',
        category: 'Social',
      },
      {
        title: 'Emotional Development',
        details: [
          'Increasing emotional stability and self-reliance',
          'Navigating anxieties about future and identity',
          'Forming stable, long-term personal commitments',
        ],
        icon: '❤️',
        category: 'Emotional',
      },
    ],
    'young-adult': [
      {
        title: 'Cognitive Development',
        details: [
          'Specialization in professional or academic fields',
          'Advanced self-guided learning and knowledge',
          'Refined decision-making and risk assessment',
        ],
        icon: '🧠',
        category: 'Cognitive',
      },
      {
        title: 'Physical Development',
        details: [
          'Reaching peak physical condition and strength',
          'Brain maturation (prefrontal cortex) finishing',
          'Establishing long-term health and fitness habits',
        ],
        icon: '🏃‍♂️',
        category: 'Physical',
      },
      {
        title: 'Social Development',
        details: [
          'Navigating professional workplace social dynamics',
          'Building long-term partnerships or family ideas',
          'Achieving full social and financial independence',
        ],
        icon: '👥',
        category: 'Social',
      },
      {
        title: 'Emotional Development',
        details: [
          'A stable and consolidated adult identity',
          'Balancing personal life with professional goals',
          'High levels of emotional intelligence and empathy',
        ],
        icon: '❤️',
        category: 'Emotional',
      },
    ],
  };

  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        if (user && user.regid) {
          const childRes = await axios.post("http://localhost:5000/demo/child/gamified-data", { id: user.regid });
          setChildInfo(childRes.data);
          const age = childRes.data.age;

          const group = ageGroups.find(g => age >= g.min && age <= g.max);
          if (group) setActiveAgeGroup(group.id);
        }

        if (user && user._id) {
          const milRes = await axios.post("http://localhost:5000/demo/child/milestones/self", { childId: user._id });
          setMyMilestones(milRes.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDynamicData();
  }, []);

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Navbar />
      <header
        style={{
          background: 'linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
          color: 'white',
          padding: '6rem 0',
          textAlign: 'center',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700' }}>
            {childInfo ? `${childInfo.childname}'s Journey` : "My Growth Journey"} 🚀
          </h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
            Tracking your amazing achievements and what's coming next!
          </p>
        </div>
      </header>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
        {/* Achievements Section */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ textAlign: 'center', color: '#4a6fa5', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <FaTrophy color="#FFD700" size={30} /> My Achievements
          </h2>

          {myMilestones.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {myMilestones.map((m, idx) => (
                <div key={idx} style={{ background: '#f0f4ff', padding: '20px', borderRadius: '15px', borderLeft: '5px solid #4158D0' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>
                    <FaCheckCircle color="#2e7d32" style={{ marginRight: '8px' }} />
                    Milestone Reached!
                  </h4>
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    {m.milestones.map((item, i) => (
                      <li key={i} style={{ color: '#555', marginBottom: '5px' }}>{item}</li>
                    ))}
                  </ul>
                  <small style={{ color: '#888', marginTop: '10px', display: 'block' }}>
                    {new Date(m.createdAt).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', background: '#f9f9f9', borderRadius: '20px' }}>
              <FaStar size={40} color="#ccc" />
              <p style={{ color: '#777', marginTop: '10px' }}>No specific milestones recorded yet. Keep growing! 🌱</p>
            </div>
          )}
        </div>

        {/* Dynamic Static Guide Section */}
        <h3 style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
          What to Expect: <strong>{ageGroups.find(g => g.id === activeAgeGroup)?.label}</strong> Guide
        </h3>

        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '50px',
            padding: '0.5rem',
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '2rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}
        >
          {ageGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => setActiveAgeGroup(group.id)}
              style={{
                padding: '0.7rem 1.2rem',
                border: 'none',
                borderRadius: '50px',
                background: activeAgeGroup === group.id ? 'linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)' : 'transparent',
                color: activeAgeGroup === group.id ? 'white' : '#343a40',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.3s ease',
              }}
            >
              {group.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {milestonesStatic[activeAgeGroup].map((milestone, index) => (
            <div
              key={index}
              style={{
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                padding: '1.5rem',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ fontSize: '5rem', opacity: '0.1', position: 'absolute', top: '-20px', right: '-20px' }}>
                {milestone.icon}
              </div>
              <span
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
                  color: 'white',
                  padding: '0.3rem 1rem',
                  borderRadius: '30px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                }}
              >
                {milestone.category}
              </span>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: '#343a40' }}>
                {milestone.title}
              </h3>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {milestone.details.map((detail, i) => (
                  <li key={i} style={{ marginBottom: '0.7rem', position: 'relative', paddingLeft: '1.5rem' }}>
                    <span style={{ position: 'absolute', left: 0, top: '8px', width: '8px', height: '8px', background: '#C850C0', borderRadius: '50%' }}></span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <Footerpage />
    </div>
  );
};

export default MilestonePage;