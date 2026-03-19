import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
export default function ParentRegister() {
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

  const [parentname, Setparentname] = useState("");
  const [email, Setemail] = useState("");
  const [phone, Setphone] = useState("");
  const [password, Setpassword] = useState("");
  const [gender, Setgender] = useState("");
  const [childname, Setchildname] = useState("");
  const [age, Setage] = useState("");
  const [address, Setaddress] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [image, setImage] = useState(null);

  const navigate = useNavigate();
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
      !parentname.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password.trim() ||
      !gender.trim() ||
      !childname.trim() ||
      !age.trim() ||
      !address.trim()
    ) {
      alert("Please fill in all the fields before submitting.");
      return;
    }

    if (!nameRegex.test(parentname)) {
      alert("Guardian name should contain only letters and spaces.");
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
    if (!image) {
      alert("Profile picture is required.");
      return;
    }
    let param = {
      parentname,
      email,
      phone,
      password,
      gender,
      childname,
      age,
      phone,
      address,
      approval: 2,
      status: 2,

      deactivation: 0,
      image: image,
    };

    fetch("http://localhost:5000/demo/parentRegisterPage", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(param),
    })
      .then((res) => res.json())
      .then((result) => {
        Setparentname("");
        Setemail("");
        Setphone("");
        Setpassword("");
        Setgender("");
        Setaddress("");
        Setage("");
        Setchildname("");
        setImage(null);
        alert("Guardian registered successfully");
        navigate("/login");
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
          position: "relative",
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

        <div
          style={{
            position: "relative",
            marginBottom: "20px",
            textAlign: "left",
          }}
        >
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              color: "#666",
              fontSize: "14px",
            }}
          >
            Guardian Name
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #040677",
              borderRadius: "5px",
              backgroundColor: "white",
              color: "#333",
              outline: "none",
              transition: "border-color 0.3s, box-shadow 0.3s",
              boxSizing: "border-box",
            }}
            onChange={(e) => Setparentname(e.target.value)}
          />
        </div>

        <div
          style={{
            position: "relative",
            marginBottom: "20px",
            textAlign: "left",
          }}
        >
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              color: "#666",
              fontSize: "14px",
            }}
          >
            Child Name
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #040677",
              borderRadius: "5px",
              backgroundColor: "white",
              color: "#333",
              outline: "none",
              transition: "border-color 0.3s, box-shadow 0.3s",
              boxSizing: "border-box",
            }}
            onChange={(e) => Setchildname(e.target.value)}
          />
        </div>

        <div
          style={{
            position: "relative",
            marginBottom: "20px",
            textAlign: "left",
          }}
        >
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
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #040677",
              borderRadius: "5px",
              backgroundColor: "white",
              color: "#333",
              outline: "none",
              transition: "border-color 0.3s, box-shadow 0.3s",
              boxSizing: "border-box",
            }}
            onChange={(e) => Setemail(e.target.value)}
          />
        </div>

        <div
          style={{
            position: "relative",
            marginBottom: "20px",
            textAlign: "left",
          }}
        >
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
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #040677",
              borderRadius: "5px",
              backgroundColor: "white",
              color: "#333",
              outline: "none",
              transition: "border-color 0.3s, box-shadow 0.3s",
              boxSizing: "border-box",
            }}
            onChange={(e) => Setpassword(e.target.value)}
          />
        </div>

        <div
          style={{
            position: "relative",
            marginBottom: "20px",
            textAlign: "left",
          }}
        >
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              color: "#666",
              fontSize: "14px",
            }}
          >
            Address
          </label>
          <textarea
            placeholder="Enter your address"
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #040677",
              borderRadius: "5px",
              backgroundColor: "white",
              color: "#333",
              outline: "none",
              transition: "border-color 0.3s, box-shadow 0.3s",
              boxSizing: "border-box",
              minHeight: "80px",
              resize: "vertical",
            }}
            onChange={(e) => Setaddress(e.target.value)}
          ></textarea>
        </div>

        <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
          <div style={{ flex: "1", textAlign: "left" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                color: "#666",
                fontSize: "14px",
              }}
            >
              Guardian Age
            </label>
            <input
              type="number"
              placeholder="Age"
              min="18"
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #040677",
                borderRadius: "5px",
                backgroundColor: "white",
                color: "#333",
                outline: "none",
                transition: "border-color 0.3s, box-shadow 0.3s",
                boxSizing: "border-box",
              }}
              onChange={(e) => Setage(e.target.value)}
            />
          </div>
          <div style={{ flex: "2", textAlign: "left" }}>
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
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #040677",
                borderRadius: "5px",
                backgroundColor: "white",
                color: "#333",
                outline: "none",
                transition: "border-color 0.3s, box-shadow 0.3s",
                boxSizing: "border-box",
              }}
              onChange={(e) => Setphone(e.target.value)}
            />
          </div>
        </div>

        <div
          style={{
            position: "relative",
            marginBottom: "25px",
            textAlign: "left",
          }}
        >
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
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name="gender"
                value="male"
                onChange={(e) => Setgender(e.target.value)}
                style={{ marginRight: "5px" }}
              />
              <span style={{ color: "#555" }}>Male</span>
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name="gender"
                value="female"
                onChange={(e) => Setgender(e.target.value)}
                style={{ marginRight: "5px" }}
              />
              <span style={{ color: "#555" }}>Female</span>
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name="gender"
                value="other"
                onChange={(e) => Setgender(e.target.value)}
                style={{ marginRight: "5px" }}
              />
              <span style={{ color: "#555" }}>Other</span>
            </label>
          </div>
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

        <div
          style={{
            position: "relative",
            marginBottom: "25px",
            textAlign: "left",
          }}
        >
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
          onClick={handlesubmit}
        >
          REGISTER NOW
        </button>

        <div style={{ marginTop: "20px", fontSize: "14px" }}>
          <p style={{ color: "#666", marginBottom: "10px" }}>
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
}
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