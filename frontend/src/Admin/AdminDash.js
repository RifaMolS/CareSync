import React from 'react'
import { motion } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import Side from './Side'
import AdminNav from './AdminNav'

const growthData = [
  { age: '1', height: 74, weight: 10 },
  { age: '2', height: 85, weight: 12 },
  { age: '3', height: 95, weight: 14 },
  { age: '4', height: 102, weight: 16 },
  { age: '5', height: 110, weight: 18 },
]

const progressData = [
  { name: 'Language', progress: 80 },
  { name: 'Motor Skills', progress: 70 },
  { name: 'Social Skills', progress: 90 },
]

const feedback = [
  { parent: 'Mrs. Priya', rating: 5, comment: 'Great care and development!' },
  { parent: 'Mr. Arun', rating: 4, comment: 'Good progress, happy with staff.' },
  { parent: 'Mrs. Rekha', rating: 5, comment: 'Amazing support and growth tracking.' },
]

const childTableData = [
  { name: 'Aarav', age: 4, height: 102, weight: 16 },
  { name: 'Meera', age: 3, height: 95, weight: 14 },
  { name: 'Kabir', age: 5, height: 110, weight: 18 },
]

const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  padding: '20px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
  marginBottom: '24px',
  transition: 'all 0.3s ease',
  flex: 1,
  minWidth: '280px'
}

const headingStyle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#333',
  marginBottom: '16px'
}

export default function AdminDash() {
  return (
    <div style={{ display: 'flex', backgroundColor: '#f7f9fc', minHeight: '100vh' }}>
      <Side />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <AdminNav />
        <div style={{ padding: '60px 90px' }}>
          <h2 style={{ fontSize: '50px', fontWeight: '700', color: '#222', marginBottom: '100px' }}>
            CareSync Dashboard
          </h2>

          {/* Grid row for circular progress and table */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '24px' }}>
            <motion.div
              style={cardStyle}
              whileHover={{ scale: 1.02 }}
            >
              <div style={headingStyle}>Activity Level</div>
              <div style={{ width: '120px', margin: '0 auto' }}>
                <CircularProgressbar
                  value={75}
                  text={`75%`}
                  styles={buildStyles({
                    textColor: '#222',
                    pathColor: '#3f51b5',
                    trailColor: '#eee'
                  })}
                />
              </div>
            </motion.div>

            <motion.div
              style={cardStyle}
              whileHover={{ scale: 1.02 }}
            >
              <div style={headingStyle}>Children Table</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f0f0' }}>
                    <th style={tableTh}>Name</th>
                    <th style={tableTh}>Age</th>
                    <th style={tableTh}>Height</th>
                    <th style={tableTh}>Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {childTableData.map((child, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={tableTd}>{child.name}</td>
                      <td style={tableTd}>{child.age}</td>
                      <td style={tableTd}>{child.height} cm</td>
                      <td style={tableTd}>{child.weight} kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>

          {/* Growth Chart */}
          <motion.div style={cardStyle} whileHover={{ scale: 1.02 }}>
            <div style={headingStyle}>Child Growth Chart</div>
            <div style={{ width: '100%', height: '250px' }}>
              <ResponsiveContainer>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="height" stroke="#3f51b5" />
                  <Line type="monotone" dataKey="weight" stroke="#ff9800" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Bar Chart */}
          <motion.div style={cardStyle} whileHover={{ scale: 1.02 }}>
            <div style={headingStyle}>Development Progress</div>
            <div style={{ width: '100%', height: '200px' }}>
              <ResponsiveContainer>
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="progress" fill="#4caf50" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Feedback */}
          <motion.div style={cardStyle} whileHover={{ scale: 1.02 }}>
            <div style={headingStyle}>Guardian Feedback</div>
            {feedback.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                style={{
                  backgroundColor: '#f9f9f9',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  borderLeft: '4px solid #03a9f4'
                }}
              >
                <strong>{item.parent}</strong> - {'⭐️'.repeat(item.rating)}
                <p style={{ margin: '5px 0', color: '#555' }}>{item.comment}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

const tableTh = {
  textAlign: 'left',
  padding: '12px',
  fontWeight: '600',
  color: '#444',
  borderBottom: '1px solid #ddd'
}

const tableTd = {
  padding: '10px',
  color: '#333'
}
