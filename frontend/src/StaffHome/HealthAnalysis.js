import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import StaffNav from "./StaffNav";
import StaffSide from "./StaffSide";
import axios from "axios";

const generateMonthlyAdultData = (month) => {
  const daysInMonth = 30;
  const baseHeight = 170;
  const baseWeight = 60;
  return Array.from({ length: daysInMonth }, (_, day) => ({
    day: `${day + 1}`,
    height: baseHeight + Math.sin((day + 1) / 5) * 2,
    weight: baseWeight + Math.cos((day + 1) / 3) * 3,
  }));
};



const colors = { height: "#82ca9d", weight: "#8884d8" };

export default function HealthAnalysis() {
  const [view] = useState("Child");
  const [selectedMonth] = useState("January");
  const [reports, setReports] = useState([]);

  const auth = JSON.parse(localStorage.getItem("user"));
  const staffId = auth?.regid;

  // fetch reports once
  useEffect(() => {
    axios
      .post("http://localhost:5000/demo/viewhealthreport", { staffId })
      .then((res) => {
        if (res.data.success) setReports(res.data.data);
      })
      .catch((err) => console.error("Error fetching reports:", err));
  }, [staffId]);

  // prepare data for the chart
  const adultData = generateMonthlyAdultData(selectedMonth);
  const healthChartData = reports.map((r) => ({
    name: r.childId?.childname || r.adultId?.adultname || "Unnamed",
    height: r.height,
    weight: r.weight,
  }));

  // choose data & x-axis key based on view
  const data = view === "Child" ? healthChartData : adultData;
  const xKey = view === "Child" ? "name" : "day";
  const xLabel = view === "Child" ? "Name" : "Day";

  return (
    <div className="container-xxl position-relative bg-white d-flex p-0">
      <StaffSide />
      <div className="content">
        <StaffNav />
        <div
          style={{
            background: "linear-gradient(to right, #f8f9fa, #e3f2fd)",
            padding: "2rem",
            borderRadius: "20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            maxWidth: "900px",
            margin: "2rem auto",
          }}
        >
          <h2
            style={{ textAlign: "center", marginBottom: "1rem", color: "#333" }}
          >
            {view} Health Growth Chart
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
          </div>

          {view === "Child" && healthChartData.length === 0 ? (
            <p style={{ textAlign: "center", color: "#777" }}>
              No data found.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
                barGap={8}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={xKey}
                  label={{
                    value: xLabel,
                    position: "insideBottom",
                    offset: -5,
                    dy: 10,
                    // style: { fontSize: 14, fill: "#555" },
                  }}
                />
                <YAxis
                  label={{
                    value: "Measurement",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend verticalAlign="top" />
                <Bar
                  dataKey="height"
                  fill={colors.height}
                  animationDuration={1500}
                />
                <Bar
                  dataKey="weight"
                  fill={colors.weight}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}


