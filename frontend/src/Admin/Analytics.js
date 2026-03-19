import React, { useEffect, useState } from 'react';
import Side from './Side';
import AdminNav from './AdminNav';
import axios from 'axios';

const Analytics = () => {
  const [data, setData] = useState({
    newRegistrations: 0,
    activeSessions: 0,
    caregivers: 0,
    totalRevenue: 0,
    insights: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [childRes, adultRes, staffRes, paymentRes] = await Promise.all([
          axios.get("http://localhost:5000/demo/childview"),
          axios.get("http://localhost:5000/demo/adultview"),
          axios.get("http://localhost:5000/demo/staffview"),
          axios.get("http://localhost:5000/demo/findallpayment")
        ]);

        const totalUsers = childRes.data.length + adultRes.data.length;
        const revenue = paymentRes.data.reduce((acc, curr) => acc + (curr.amount || 0), 0);

        // Process monthly revenue
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyData = paymentRes.data.reduce((acc, p) => {
          const monthIndex = new Date(p.date).getMonth();
          const monthName = monthNames[monthIndex];
          acc[monthName] = (acc[monthName] || 0) + p.amount;
          return acc;
        }, {});

        const chartData = monthNames.slice(0, 5).map(m => ({
          month: m,
          amount: monthlyData[m] || 0
        }));

        // Rule-based Insight for "Next Performance"
        const staffToClientRatio = staffRes.data.length / (totalUsers || 1);
        let staffingInsight = "✅ Staffing levels are optimal.";
        if (staffToClientRatio < 0.1) staffingInsight = "⚠️ Caution: High client-to-staff ratio detected. Consider hiring.";

        setData({
          newRegistrations: totalUsers,
          activeSessions: Math.floor(totalUsers * 0.8),
          caregivers: staffRes.data.length,
          totalRevenue: revenue,
          chartData: chartData,
          insights: [
            `💰 Total revenue reached ₹${revenue.toLocaleString()}`,
            `👥 ${childRes.data.length} Children & ${adultRes.data.length} Adults enrolled`,
            `👩‍⚕️ ${staffRes.data.length} Staff members active`,
            staffingInsight
          ]
        });

      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container-xxl position-relative bg-white d-flex p-0">
      <Side />
      <div className="content">
        <AdminNav />
        <div style={{
          padding: '30px',
          fontFamily: 'Segoe UI, sans-serif',
          backgroundColor: '#f0f4f8',
          color: '#1f2937',
          minHeight: '100vh',
          overflowX: 'hidden'
        }}>
          {/* Global Animation Styles */}
          <style>
            {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes bounce {
            0% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0); }
          }
          @keyframes slideUp {
            from { transform: translateY(40px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes zoomIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(100, 100, 255, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(100, 100, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(100, 100, 255, 0); }
          }
          @keyframes popUp {
            from { transform: translateY(50%) scale(0.9); opacity: 0; }
            to { transform: translateY(0) scale(1); opacity: 1; }
          }
          @keyframes swing {
            20% { transform: rotate3d(0, 0, 1, 15deg); }
            40% { transform: rotate3d(0, 0, 1, -10deg); }
            60% { transform: rotate3d(0, 0, 1, 5deg); }
            80% { transform: rotate3d(0, 0, 1, -5deg); }
            100% { transform: rotate3d(0, 0, 1, 0deg); }
          }
        `}
          </style>

          {/* Header */}
          <h1 style={{
            fontSize: '36px',
            textAlign: 'center',
            marginBottom: '30px',
            color: '#111827',
            animation: 'swing 1s ease'
          }}>
            🌈 CareSync – Analytics & Reports
          </h1>

          {/* Quick Stats */}
          <div style={{
            backgroundColor: '#ffffff',
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
            marginBottom: '30px',
            animation: 'zoomIn 1s ease'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>📌 Live Stats</h2>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px'
            }}>
              {[
                { label: 'Total Users', value: data.newRegistrations, emoji: '📝', delay: '0s' },
                { label: 'Active Sessions', value: data.activeSessions, emoji: '⏱️', delay: '0.2s' },
                { label: 'Caregivers Online', value: data.caregivers, emoji: '👩‍⚕️', delay: '0.4s' },
                { label: 'Total Revenue', value: `₹${data.totalRevenue.toLocaleString()}`, emoji: '💰', delay: '0.6s' }
              ].map((item, i) => (
                <div key={i} style={{
                  flex: '1 1 20%',
                  backgroundColor: '#e0f7fa',
                  padding: '20px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  fontSize: '18px',
                  animation: `fadeIn 0.7s ease ${item.delay} forwards`,
                  opacity: 0,
                  transform: 'translateY(20px)',
                  transition: 'transform 0.3s ease',
                  cursor: 'pointer'
                }}>
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>{item.emoji}</div>
                  <div><strong>{item.value}</strong></div>
                  <div style={{ fontSize: '14px', color: '#4b5563' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat-style Updates */}
          <div style={{
            backgroundColor: '#ffffff',
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
            marginBottom: '30px',
            animation: 'slideUp 1s ease'
          }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px' }}>💬 System Intelligence</h2>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              {data.insights.map((msg, i) => (
                <div key={i} style={{
                  alignSelf: i % 2 === 0 ? 'flex-start' : 'flex-end',
                  backgroundColor: i % 2 === 0 ? '#e0f2fe' : '#d1fae5',
                  padding: '14px 20px',
                  borderRadius: '18px',
                  maxWidth: '70%',
                  fontSize: '15px',
                  animation: `popUp 0.6s ease ${i * 0.3}s forwards`,
                  opacity: 0
                }}>
                  {msg}
                </div>
              ))}
            </div>
          </div>

          {/* Visual Graph Bars */}
          <div style={{
            backgroundColor: '#ffffff',
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
            marginBottom: '30px',
            animation: 'zoomIn 0.7s ease'
          }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px' }}>📅 Monthly Revenue Trend (Actual)</h2>
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-around',
              height: '160px',
              marginTop: '15px'
            }}>
              {(data.chartData || []).map((item, i) => {
                const maxAmount = Math.max(...data.chartData.map(d => d.amount)) || 1;
                const height = (item.amount / maxAmount) * 140 + 20; // Scale to max 140px
                return (
                  <div key={item.month} style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '30px',
                      height: `${height}px`,
                      backgroundColor: '#6366f1',
                      borderRadius: '8px',
                      animation: `slideUp 0.5s ease ${i * 0.2}s forwards`,
                      opacity: 0,
                      marginBottom: '5px'
                    }}></div>
                    <div style={{ fontSize: '12px' }}>{item.month}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Engagement Goals */}
          <div style={{
            backgroundColor: '#fff7ed',
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
            animation: 'pulse 2s infinite'
          }}>
            <h2 style={{ fontSize: '22px', marginBottom: '10px' }}>🎯 Facility Goals</h2>
            <ul style={{
              paddingLeft: '20px',
              fontSize: '15px',
              lineHeight: '1.8'
            }}>
              <li>Increase Adult enrollment by 10%</li>
              <li>Maintain 100% Staff Compliance</li>
              <li>Zero pending complaints by EOM</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
