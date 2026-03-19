import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegistrationPage = () => {
  const bgStyle = {
    backgroundImage:
      "linear-gradient(rgba(89, 92, 255, 0.8), rgba(198, 248, 255, 0.8)), url('/assets/img/register.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    padding: "20px 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    margin: "0",
    color: "#333",
  };
  const navigate = useNavigate()
  const [name, Setname] = useState("");
  const [email, Setemail] = useState("");
  const [phone, Setphone] = useState("");
  const [password, Setpassword] = useState("");
  const [gender, Setgender] = useState("");
  const [role, Setrole] = useState(""); // ✅ Role state
  const [shift, Setshift] = useState("");
  const [staffList, SetstaffList] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [roles, setRoles] = useState([]); // Role list
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/demo/roleview")
      .then((res) => res.json())
      .then((data) => setRoles(data))
      .catch((err) => console.error("Error fetching roles:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/demo/staffview")
      .then((res) => res.json())
      .then((result) => SetstaffList(result));
  }, [refresh]);
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
  const handlesubmit = (e) => {
    e.preventDefault();

    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,}$/;

    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password.trim() ||
      !gender.trim() ||
      !role.trim() ||
      !shift.trim()
    ) {
      alert("Please fill in all the fields before submitting.");
      return;
    }

    if (!nameRegex.test(name)) {
      alert("Staff name should contain only letters and spaces.");
      return;
    }

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!phoneRegex.test(phone)) {
      alert(
        "Phone number should contain only digits and be at least 10 characters long."
      );
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }
    if (image.length < 1) {
      alert("Profile picture is required.");
      return;
    }
    let param = {
      name,
      email,
      phone,
      password,
      gender,
      role,
      shift,
      approval: 0,
      status: 1,
      image: image
    };

    fetch("http://localhost:5000/demo/staffRegister", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(param),
    })
      .then((res) => res.json())
      .then(() => {
        Setname("");
        Setemail("");
        Setphone("");
        Setpassword("");
        Setgender("");
        Setrole(""); // ✅ Reset selected role
        Setshift("");
        setImage(null);

        alert("Staff registered successfully!");
        navigate("/login")
        setRefresh((prev) => prev + 1);

      });
  };

  return (
    <div style={bgStyle}>
      <div
        style={{
          backgroundColor: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(8px)",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 0 20px rgba(4, 6, 119, 0.3)",
          width: "600px",
          textAlign: "center",
          animation: "fadeIn 1s ease-in-out",
        }}
      >
        <h1
          style={{
            color: "#040677",
            marginBottom: "30px",
            animation: "slideDown 0.8s ease-out",
          }}
        >
          Create Account
        </h1>

        {/* Staff Name */}
        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              color: "#666",
              fontSize: "14px",
            }}
          >
            Staff Name
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => Setname(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              color: "#666",
              fontSize: "14px",
            }}
          >
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => Setemail(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              color: "#666",
              fontSize: "14px",
            }}
          >
            Password
          </label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => Setpassword(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Phone */}
        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              color: "#666",
              fontSize: "14px",
            }}
          >
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => Setphone(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Gender */}
        <div style={{ marginBottom: "25px", textAlign: "left" }}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              color: "#666",
              fontSize: "14px",
            }}
          >
            Gender
          </label>
          <div style={{ display: "flex", gap: "20px" }}>
            {["male", "female", "other"].map((g) => (
              <label
                key={g}
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={gender === g}
                  onChange={(e) => Setgender(e.target.value)}
                  style={{ marginRight: "5px" }}
                />
                <span style={{ color: "#555" }}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Role dropdown */}
        <div style={{ marginBottom: "25px", textAlign: "left" }}>
          <label
            htmlFor="role"
            style={{
              display: "block",
              marginBottom: "6px",
              color: "#666",
              fontSize: "14px",
            }}
          >
            Role:
          </label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={(e) => Setrole(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select Role</option>
            {roles && roles.length > 0 ? (
              roles.map((roleItem) => (
                <option key={roleItem._id} value={roleItem.role}>
                  {roleItem.role.charAt(0).toUpperCase() + roleItem.role.slice(1)}
                </option>
              ))
            ) : (
              // Static Fallback if no roles found from DB
              ["Caregiver", "Nurse", "Cook", "Driver", "Security", "Admin"].map((r) => (
                <option key={r} value={r.toLowerCase()}>
                  {r}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Shift */}
        <div style={{ marginBottom: "25px", textAlign: "left" }}>
          <label
            htmlFor="shift"
            style={{
              display: "block",
              marginBottom: "6px",
              color: "#666",
              fontSize: "14px",
            }}
          >
            Preferred Shift:
          </label>
          <input
            type="text"
            id="shift"
            name="shift"
            placeholder="E.g. Morning, Evening"
            value={shift}
            onChange={(e) => Setshift(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              color: "#666",
              fontSize: "14px",
            }}
          >
            Profile Picture
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={(e) => fileUpload(e, setImage)}
            style={inputStyle}
          />
        </div>

        {/* Terms and Submit */}
        <div style={{ marginBottom: "25px", textAlign: "left" }}>
          <label
            style={{ display: "flex", alignItems: "start", cursor: "pointer" }}
          >
            <input
              type="checkbox"
              style={{ marginRight: "10px", marginTop: "3px" }}
            />
            <span style={{ color: "#666", fontSize: "14px" }}>
              I agree to the{" "}
              <a href="#" style={{ color: "#040677", textDecoration: "none" }}>
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" style={{ color: "#040677", textDecoration: "none" }}>
                Privacy Policy
              </a>
            </span>
          </label>
        </div>



        <button
          onClick={handlesubmit}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: "#040677",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background-color 0.3s, transform 0.3s",
            animation: "pulse 2s infinite",
            marginBottom: "15px",
            fontSize: "16px",
          }}
        >
          REGISTER NOW
        </button>

        <div style={{ marginTop: "20px", fontSize: "14px" }}>
          <p style={{ color: "#666" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#040677",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "2px solid #040677",
  borderRadius: "5px",
  backgroundColor: "white",
  color: "#333",
  outline: "none",
  transition: "border-color 0.3s, box-shadow 0.3s",
  boxSizing: "border-box",
};

export default RegistrationPage;
