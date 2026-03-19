import React, { useEffect, useState } from "react";
import Side from "./Side";
import AdminNav from "./AdminNav";
import { useLocation, useNavigate } from "react-router-dom";

export default function UpdateStaff() {
  const [name, Setname] = useState("");
  const [email, Setemail] = useState("");
  const [phone, Setphone] = useState("");
  const [password, Setpassword] = useState("");
  const [gender, Setgender] = useState("");
  const [role, Setrole] = useState("");
  const [shift, Setshift] = useState("");
  const [image, setImage] = useState(null);
  const [isAlternate, setIsAlternate] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    let edits = {
      id: location.state.id,
    };
    fetch("http://localhost:5000/demo/staffedit", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(edits),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
        Setname(result.edit.name);
        Setemail(result.edit.email);
        Setphone(result.edit.phone);
        Setgender(result.edit.gender);
        Setrole(result.edit.role);
        Setshift(result.edit.shift);
        Setemail(result.valid.email);
        setImage(result.edit.image);
        setIsAlternate(result.edit.isAlternate || false);
      });
  }, []);

  const fileUpload = (e, setFile) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);

    fetch("http://localhost:5000/util/fileUpload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((result) => {
        setFile(result);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };
  const handleupdate = (e) => {
    e.preventDefault();
    let ids = {
      id: location.state.id,
      name: name,
      email: email,
      phone: phone,
      gender: gender,
      role: role,
      shift: shift,
      image: image,
      isAlternate: isAlternate,
    };
    fetch("http://localhost:5000/demo/staffupdate", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ids),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        navigate("/staff");
      });
  };

  return (
    <>
      <div className="container-xxl position-relative bg-white d-flex p-0">
        <Side />
        <div className="content">
          <AdminNav />

          <div
            style={{
              margin: 0,
              fontFamily: "Arial, sans-serif",
              backgroundColor: "#f9fafb",
              color: "#111827",
              minHeight: "100vh",
              padding: "40px",
            }}
          >
            <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
              Update Staff Member
            </h1>

            <form
              style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "10px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                maxWidth: "600px",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="name"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Full Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter full name"
                  onChange={(e) => Setname(e.target.value)}
                  value={name}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                  }}
                  required
                />
              </div>

              {/* <div style={{ marginBottom: '20px' }}>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
        <input type="email" id="email" name="email" placeholder="Enter email"  onChange={(e) => Setemail(e.target.value)} value={email}  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}  />
      </div> */}

              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="phone"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Phone Number:
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter phone number"
                  onChange={(e) => Setphone(e.target.value)}
                  value={phone}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                  }}
                  required
                />
              </div>

              {/* <div style={{ marginBottom: '20px' }}>
        <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
        <input type="password" id="password" name="password" placeholder="Enter your password"  onChange={(e) => Setpassword(e.target.value)} value={password}  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}  />
      </div> */}

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Gender:
                </label>
                <div style={{ display: "flex", gap: "15px" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      onChange={(e) => Setgender(e.target.value)}
                      checked={gender === "female"}
                      required
                    />
                    Female
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      onChange={(e) => Setgender(e.target.value)}
                      checked={gender === "male"}
                    />
                    Male
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value="other"
                      onChange={(e) => Setgender(e.target.value)}
                      checked={gender === "other"}
                    />
                    Other
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="role"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Role:
                </label>
                <select
                  id="role"
                  name="role"
                  onChange={(e) => Setrole(e.target.value)}
                  value={role}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                  }}
                >
                  <option value="">Select Role</option>
                  <option value="caregiver">Caregiver</option>
                  <option value="nurse">Nurse</option>
                  <option value="therapist">Therapist</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="shift"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Preferred Shift:
                </label>
                <input
                  type="text"
                  id="shift"
                  name="shift"
                  onChange={(e) => Setshift(e.target.value)}
                  value={shift}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={isAlternate}
                    onChange={(e) => setIsAlternate(e.target.checked)}
                    style={{ width: "20px", height: "20px" }}
                  />
                  Is Alternate Staff? (Can be assigned as substitute)
                </label>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="shift"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Email
                </label>
                <input
                  type="text"
                  id="shift"
                  name="shift"
                  onChange={(e) => Setemail(e.target.value)}
                  value={email}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                  }}
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="image"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Profile Picture:
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={(e) => fileUpload(e, setImage)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                  }}
                  required
                />
                {image && (
                  <img
                    src={`http://localhost:5000/${image}`}
                    alt="User"
                    style={{ width: "100px", marginTop: "10px" }}
                  />
                )}
              </div>
              <button
                type="submit"
                onClick={handleupdate}
                style={{
                  backgroundColor: "#2563eb",
                  color: "white",
                  padding: "12px 20px",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Update staff
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
