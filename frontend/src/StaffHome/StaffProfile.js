import React, { useEffect, useState } from "react";
import StaffSide from "./StaffSide";
import StaffNav from "./StaffNav";
import { Link } from "react-router-dom";
export default function StaffProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const auth = JSON.parse(localStorage.getItem("user"));
  const id = auth?.regid;
  /* fetch once on mount */
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("user"));
    const id = auth?.regid;
    if (!id) {
      setErr("No user information found.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/demo/staffedit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setErr(d.error);
        else setProfile({ ...d.edit, ...d.valid });
      })
      .catch(() => setErr("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);
  console.log(profile, "profile");
  /* -------------------------------- styles (inline) */
  const wrap = { display: "flex", minHeight: "100vh", background: "#f3f4f6" };
  const body = { flex: 1, display: "flex", flexDirection: "column" };
  const main = {
    flexGrow: 1,
    padding: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  };
  const card = {
    width: 420,
    background: "#fff",
    borderRadius: 20,
    boxShadow: "0 8px 24px rgba(0,0,0,.12)",
    padding: 32,
    textAlign: "center",
  };
  const avatar = {
    width: 140,
    height: 140,
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #e5e7eb",
    marginBottom: 24,
  };
  const row = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 12,
    fontSize: 16,
  };
  const label = { color: "#6b7280", fontWeight: 600 };
  const val = {
    color: "#374151",
    fontWeight: 600,
  };

  /* -------------------------------- render */
  return (
    <div style={wrap}>
      <StaffSide />
      <div style={body}>
        <StaffNav />
        <main style={main}>
          {loading && <p>Loading profile…</p>}
          {err && <p style={{ color: "#b91c1c" }}>{err}</p>}

          {profile && (
            <div style={card}>
              <img
                src={`http://localhost:5000/${profile.image}`}
                alt="avatar"
                style={avatar}
              />

              <h2
                style={{
                  fontWeight: 800,
                  fontSize: 28,
                  color: "#4338ca",
                  marginBottom: 4,
                }}
              >
                {profile.name}
              </h2>
              <p style={{ color: "#6b7280", margin: 0 }}>{profile.role}</p>

              {[
                ["Email", profile.email, false],
                ["Phone", profile.phone, false],
                ["Gender", profile.gender, true],
                ["Shift", profile.shift, true],
              ].map(([labelText, value, capitalize]) => (
                <div key={labelText} style={row}>
                  <span style={label}>{labelText}</span>
                  <span
                    style={{
                      color: "#374151",
                      fontWeight: 600,
                      ...(capitalize ? { textTransform: "capitalize" } : {}),
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}

              {/* Edit Link */}
              <div style={{ marginTop: "20px" }}>
                <Link
                  to="/staffprofileedit"
                  state={{ id }}
                  style={{
                    color: "#2563eb",
                    fontWeight: 600,
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
